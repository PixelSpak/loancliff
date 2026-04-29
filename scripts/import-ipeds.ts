/**
 * scripts/import-ipeds.ts
 *
 * Downloads IPEDS 2024 data from NCES, parses it, and generates data/schools.json.
 *
 * Usage:
 *   npm run import-ipeds
 *
 * The script auto-downloads and caches the three required IPEDS ZIP files the
 * first time it runs. Subsequent runs skip the download if the CSVs exist.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Optional: program-specific COA overrides
 * ─────────────────────────────────────────────────────────────────────────────
 * IPEDS only has institution-level graduate tuition. A med-school COA is very
 * different from an MBA COA at the same university. For accurate per-program
 * numbers, create data/raw/coa-overrides.csv with columns:
 *
 *   unitid,program,coa_per_year
 *   166027,md,113000
 *   166027,mba,124800
 *
 * (unitid is the 6-digit IPEDS UNITID printed in the stats at the end.)
 * Any row here overrides the IPEDS estimate for that school+program.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { execSync } from "node:child_process";

// ─── Configuration ────────────────────────────────────────────────────────────

const RAW_DIR = path.resolve("data/raw");
const OUT_FILE = path.resolve("data/schools.json");

/** Added to IPEDS tuition to estimate full COA (books, room, board, personal). */
const LIVING_EXPENSE_ESTIMATE = 20_000;

/** Minimum completions for us to consider a program active at a school. */
const MIN_COMPLETIONS = 1;

/**
 * IPEDS files to download. Keys = local CSV filename; values = NCES ZIP URL.
 * HD uses 2024 (current school list). IC and Completions use 2023 — NCES
 * typically releases these 12–18 months after the survey year so 2024 is not
 * yet available as of mid-2026.
 *
 * IC_AY columns used for graduate COA:
 *   tuition5 + fee5  = in-state (private schools: same as out-of-state)
 *   tuition7 + fee7  = out-of-state (used for public schools)
 * IPEDS uses "." to indicate missing/not-applicable values — handled below.
 */
const IPEDS_FILES: Record<string, string> = {
  "HD2024.csv": "https://nces.ed.gov/ipeds/datacenter/data/HD2024.zip",
  "IC2023_AY.csv": "https://nces.ed.gov/ipeds/datacenter/data/IC2023_AY.zip",
  "C2023_A.csv": "https://nces.ed.gov/ipeds/datacenter/data/C2023_A.zip",
};

// ─── CIP code → our program type ──────────────────────────────────────────────

const CIP_TO_PROGRAM: Array<{ pattern: RegExp; program: string }> = [
  { pattern: /^51\.1201/, program: "md" },
  { pattern: /^51\.1202/, program: "md" },
  { pattern: /^51\.1901/, program: "do" },
  { pattern: /^22\.0101/, program: "jd" },
  { pattern: /^22\.0102/, program: "jd" },
  { pattern: /^51\.0401/, program: "dds" },
  { pattern: /^51\.0402/, program: "dds" },
  { pattern: /^51\.2001/, program: "pharmd" },
  { pattern: /^51\.2401/, program: "dvm" },
  { pattern: /^51\.1701/, program: "od" },
  { pattern: /^52\.0101/, program: "mba" },  // Business/Commerce, General (used by some schools for MBA)
  { pattern: /^52\.0201/, program: "mba" },
  { pattern: /^52\.0203/, program: "mba" },
  { pattern: /^52\.0206/, program: "mba" },  // Finance, General (sometimes used for MBA programs)
  { pattern: /^52\.0299/, program: "mba" },
  { pattern: /^13\./, program: "med" },
];

const PROFESSIONAL_DOC_LEVEL = 18;
const RESEARCH_DOC_LEVEL = 17;
const MASTERS_LEVEL = 7;

// ─── Download helpers ─────────────────────────────────────────────────────────

async function downloadAndExtract(csvName: string, zipUrl: string): Promise<void> {
  const csvPath = path.join(RAW_DIR, csvName);
  if (fs.existsSync(csvPath)) {
    console.log(`  ✓ ${csvName} (cached)`);
    return;
  }

  const zipPath = path.join(RAW_DIR, csvName.replace(".csv", ".zip"));
  console.log(`  ↓ Downloading ${csvName}…`);

  // Download the ZIP
  const res = await fetch(zipUrl);
  if (!res.ok) throw new Error(`Failed to download ${zipUrl}: ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(zipPath, buf);

  // Extract with the system unzip (available on macOS and most Linux)
  console.log(`  ✂  Extracting ${path.basename(zipPath)}…`);
  try {
    execSync(`unzip -o -j "${zipPath}" "*.csv" -d "${RAW_DIR}"`, { stdio: "pipe" });
  } catch {
    // Some IPEDS ZIPs use uppercase filenames — try case-insensitive glob
    execSync(`unzip -o -j "${zipPath}" -d "${RAW_DIR}"`, { stdio: "pipe" });
  }

  // Clean up ZIP to save space
  fs.unlinkSync(zipPath);

  // IPEDS sometimes uses all-caps filenames — normalise to what we expect
  const actualFiles = fs.readdirSync(RAW_DIR);
  for (const f of actualFiles) {
    if (f.toLowerCase() === csvName.toLowerCase() && f !== csvName) {
      fs.renameSync(path.join(RAW_DIR, f), csvPath);
    }
  }

  if (!fs.existsSync(csvPath)) {
    throw new Error(
      `Extraction succeeded but ${csvName} not found in ${RAW_DIR}. ` +
        `Files present: ${fs.readdirSync(RAW_DIR).join(", ")}`
    );
  }

  console.log(`  ✓ ${csvName}`);
}

// ─── CSV helpers ──────────────────────────────────────────────────────────────

async function readCsv(filePath: string): Promise<Array<Record<string, string>>> {
  const rows: Array<Record<string, string>> = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  let headers: string[] = [];
  let lineNum = 0;

  for await (const line of rl) {
    lineNum++;
    const clean = lineNum === 1 ? line.replace(/^﻿/, "") : line;
    // Skip blank lines and comment lines (used in override CSVs)
    if (clean.trim() === "" || clean.trimStart().startsWith("#")) continue;
    const cols = parseCsvLine(clean);
    if (headers.length === 0) {
      headers = cols.map((h) => h.toLowerCase().trim());
    } else {
      if (cols.length === 0) continue;
      const row: Record<string, string> = {};
      headers.forEach((h, i) => { row[h] = (cols[i] ?? "").trim(); });
      rows.push(row);
    }
  }

  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// ─── Name helpers ─────────────────────────────────────────────────────────────

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function deriveShortName(name: string): string | undefined {
  if (name.length <= 22) return undefined;

  const uniOf = name.match(/^University of (.+)$/i);
  if (uniOf) {
    const rest = uniOf[1].replace(/,.*$/, "").replace(/\(.*\)/, "").trim();
    const candidate = `U of ${rest}`;
    if (candidate.length <= 22) return candidate;
    return rest.length <= 18 ? rest : rest.split(/\s+/).slice(0, 2).join(" ");
  }

  const trailing = name.match(/^(.+?)\s+University$/i);
  if (trailing) {
    const c = trailing[1].replace(/\(.*\)/, "").trim();
    if (c.length <= 22) return c;
  }

  const college = name.match(/^(.+?)\s+College$/i);
  if (college) {
    const c = college[1].replace(/\(.*\)/, "").trim();
    if (c.length <= 22) return c;
  }

  const stripped = name.replace(/\s*\(.*\)/, "").trim();
  if (stripped.length <= 22 && stripped !== name) return stripped;

  return name.substring(0, 20).trimEnd();
}

function classifyMasters(cipCode: string): "ms" | "ma" {
  const prefix = parseInt(cipCode.split(".")[0], 10);
  const arts = [5, 16, 23, 24, 25, 38, 39, 50, 54];
  return arts.includes(prefix) ? "ma" : "ms";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(RAW_DIR, { recursive: true });

  // ── Download IPEDS files if not already cached ─────────────────────────
  console.log("Fetching IPEDS 2024 files…");
  for (const [csvName, zipUrl] of Object.entries(IPEDS_FILES)) {
    await downloadAndExtract(csvName, zipUrl);
  }

  // ── Parse CSV files ────────────────────────────────────────────────────
  console.log("\nParsing…");
  const [hdRows, icRows, completionRows] = await Promise.all([
    readCsv(path.join(RAW_DIR, "HD2024.csv")),
    readCsv(path.join(RAW_DIR, "IC2023_AY.csv")),
    readCsv(path.join(RAW_DIR, "C2023_A.csv")),
  ]);
  console.log(
    `  HD: ${hdRows.length.toLocaleString()} rows  ` +
    `IC: ${icRows.length.toLocaleString()} rows  ` +
    `Completions: ${completionRows.length.toLocaleString()} rows`
  );

  // ── Optional COA overrides ─────────────────────────────────────────────
  const overridesPath = path.join(RAW_DIR, "coa-overrides.csv");
  const overrides = new Map<string, number>();
  if (fs.existsSync(overridesPath)) {
    const overrideRows = await readCsv(overridesPath);
    for (const row of overrideRows) {
      // Skip comment rows (lines starting with #) and blank rows
      const uid = row["unitid"]?.trim();
      if (!uid || uid.startsWith("#")) continue;
      const coa = parseInt(row["coa_per_year"], 10);
      if (!isNaN(coa)) overrides.set(`${uid}:${row["program"]}`, coa);
    }
    console.log(`  COA overrides: ${overrides.size} entries`);
  }

  // ── Institution map ────────────────────────────────────────────────────
  interface Meta { name: string; state: string; control: number; iclevel: number; closed: boolean }
  const institutions = new Map<string, Meta>();
  for (const row of hdRows) {
    const unitid = row["unitid"];
    if (!unitid) continue;
    // closecd: null/-2 = open, any other value = closed/merged
    const closed = !!row["closecd"] && row["closecd"] !== "" && row["closecd"] !== "-2";
    institutions.set(unitid, {
      name: row["instnm"] ?? "",
      state: row["stabbr"] ?? "",
      control: parseInt(row["control"] ?? "0", 10),
      iclevel: parseInt(row["iclevel"] ?? "0", 10),
      closed,
    });
  }

  // ── COA map ────────────────────────────────────────────────────────────
  // IC_AY graduate tuition columns:
  //   tuition5 + fee5 = in-state/private grad tuition+fees
  //   tuition7 + fee7 = out-of-state grad tuition+fees (public schools)
  // IPEDS uses "." for missing values; parseInt(".") = NaN, caught by isNaN check.
  const coaByUnitid = new Map<string, number>();

  const parseIpeds = (v: string | undefined): number => {
    if (!v || v === "." || v === "") return NaN;
    return parseInt(v, 10);
  };

  for (const row of icRows) {
    const unitid = row["unitid"];
    if (!unitid) continue;
    const isPublic = institutions.get(unitid)?.control === 1;

    let tuitionAndFees: number;
    if (isPublic) {
      const t = parseIpeds(row["tuition7"]);
      const f = parseIpeds(row["fee7"]);
      tuitionAndFees = (!isNaN(t) ? t : 0) + (!isNaN(f) ? f : 0);
      if (tuitionAndFees === 0) {
        // Fall back to in-state if out-of-state not reported
        const ti = parseIpeds(row["tuition5"]);
        const fi = parseIpeds(row["fee5"]);
        tuitionAndFees = (!isNaN(ti) ? ti : 0) + (!isNaN(fi) ? fi : 0);
      }
    } else {
      const t = parseIpeds(row["tuition5"]);
      const f = parseIpeds(row["fee5"]);
      tuitionAndFees = (!isNaN(t) ? t : 0) + (!isNaN(f) ? f : 0);
    }

    if (tuitionAndFees > 0) {
      coaByUnitid.set(unitid, tuitionAndFees + LIVING_EXPENSE_ESTIMATE);
    }
  }

  // ── Program map from completions ───────────────────────────────────────
  const programsByUnitid = new Map<string, Set<string>>();
  const add = (uid: string, prog: string) => {
    if (!programsByUnitid.has(uid)) programsByUnitid.set(uid, new Set());
    programsByUnitid.get(uid)!.add(prog);
  };

  for (const row of completionRows) {
    const unitid = row["unitid"];
    const cip = (row["cipcode"] ?? "").trim();
    const awlevel = parseInt(row["awlevel"] ?? "0", 10);
    const completions = parseInt(row["ctotalt"] ?? "0", 10);
    if (!unitid || !cip || completions < MIN_COMPLETIONS) continue;

    if (awlevel === PROFESSIONAL_DOC_LEVEL) {
      for (const { pattern, program } of CIP_TO_PROGRAM) {
        if (pattern.test(cip)) { add(unitid, program); break; }
      }
    }
    if (awlevel === RESEARCH_DOC_LEVEL) {
      add(unitid, "phd");
    }
    if (awlevel === MASTERS_LEVEL) {
      let mapped = false;
      for (const { pattern, program } of CIP_TO_PROGRAM) {
        if (pattern.test(cip)) { add(unitid, program); mapped = true; break; }
      }
      if (!mapped) add(unitid, classifyMasters(cip));
    }
  }

  // ── Assemble output ────────────────────────────────────────────────────
  interface SchoolEntry {
    id: string; name: string; shortName?: string; state: string;
    programs: Record<string, { coaPerYear: number }>;
  }

  const output: Record<string, SchoolEntry> = {};
  const slugsSeen = new Set<string>();
  let schoolCount = 0;
  let programCount = 0;

  for (const [unitid, meta] of institutions.entries()) {
    if (meta.control === 3) continue;   // for-profit
    if (meta.iclevel !== 1) continue;   // not 4-year
    if (meta.closed) continue;

    const progSet = new Set(programsByUnitid.get(unitid) ?? []);

    // An override entry is an implicit program existence declaration.
    // This handles elite schools that under-report completions in IPEDS
    // (e.g., Stanford MBA, which shows ctotalt=0 but clearly offers the program).
    for (const key of overrides.keys()) {
      if (key.startsWith(`${unitid}:`)) {
        progSet.add(key.slice(unitid.length + 1));
      }
    }

    if (progSet.size === 0) continue;

    const coa = coaByUnitid.get(unitid);
    // Allow override-only schools (no IC_AY data) by falling back to 0 base — overrides will fill in.
    if (!coa && progSet.size === 0) continue;

    const programs: Record<string, { coaPerYear: number }> = {};
    for (const prog of progSet) {
      const overrideVal = overrides.get(`${unitid}:${prog}`);
      if (!overrideVal && !coa) continue; // no data at all for this program
      programs[prog] = { coaPerYear: overrideVal ?? coa! };
      programCount++;
    }

    let slug = toSlug(meta.name);
    if (slugsSeen.has(slug)) slug = `${slug}-${meta.state.toLowerCase()}`;
    slugsSeen.add(slug);

    const shortName = deriveShortName(meta.name);
    output[slug] = {
      id: slug, name: meta.name,
      ...(shortName ? { shortName } : {}),
      state: meta.state, programs,
    };
    schoolCount++;
  }

  // ── Write ──────────────────────────────────────────────────────────────
  const jsonOutput = {
    _note:
      "Generated by scripts/import-ipeds.ts from IPEDS 2024. " +
      `COA = IPEDS grad tuition+fees + $${LIVING_EXPENSE_ESTIMATE.toLocaleString()} living expense estimate. ` +
      "Apply verified per-program COA via data/raw/coa-overrides.csv and re-run.",
    ...output,
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(jsonOutput, null, 2) + "\n");

  console.log(`\n✓ Written to ${OUT_FILE}`);
  console.log(`  Schools: ${schoolCount.toLocaleString()}`);
  console.log(`  Programs: ${programCount.toLocaleString()}`);
  console.log(
    `\n⚠  COA values are estimates. Add verified figures to\n` +
    `   data/raw/coa-overrides.csv and re-run before launch.`
  );
}

main().catch((err) => { console.error(err); process.exit(1); });
