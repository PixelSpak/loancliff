import { describe, expect, it } from "vitest";
import { computeGap } from "./calc";
import type { CapsData, ProgramsData, SchoolsData } from "./types";

// ── Stable inline fixtures — never depend on production data/schools.json ────

const testSchools: SchoolsData = {
  harvard: {
    id: "harvard",
    name: "Harvard University",
    state: "MA",
    programs: {
      mba: { coaPerYear: 124800 },
      md: { coaPerYear: 113000 },
      jd: { coaPerYear: 106000 },
    },
  },
  nyu: {
    id: "nyu",
    name: "New York University",
    state: "NY",
    programs: {
      // MD is tuition-free (Grossman School) — COA is living expenses only
      md: { coaPerYear: 40000 },
      jd: { coaPerYear: 108000 },
    },
  },
};

const testPrograms: ProgramsData = {
  mba:    { category: "graduate",     defaultLengthYears: 2, label: "MBA",                  shortLabel: "MBA" },
  md:     { category: "professional", defaultLengthYears: 4, label: "MD (Medicine)",        shortLabel: "MD" },
  do:     { category: "professional", defaultLengthYears: 4, label: "DO",                   shortLabel: "DO" },
  jd:     { category: "professional", defaultLengthYears: 3, label: "JD (Law)",             shortLabel: "JD" },
  dds:    { category: "professional", defaultLengthYears: 4, label: "DDS",                  shortLabel: "DDS" },
  pharmd: { category: "professional", defaultLengthYears: 4, label: "PharmD",               shortLabel: "PharmD" },
  dvm:    { category: "professional", defaultLengthYears: 4, label: "DVM",                  shortLabel: "DVM" },
  od:     { category: "professional", defaultLengthYears: 4, label: "OD",                   shortLabel: "OD" },
  phd:    { category: "graduate",     defaultLengthYears: 5, label: "PhD",                  shortLabel: "PhD" },
  ms:     { category: "graduate",     defaultLengthYears: 2, label: "Master of Science",    shortLabel: "MS" },
  ma:     { category: "graduate",     defaultLengthYears: 2, label: "Master of Arts",       shortLabel: "MA" },
  med:    { category: "graduate",     defaultLengthYears: 2, label: "Master of Education",  shortLabel: "MEd" },
};

const testCaps: CapsData = {
  effective_date: "2026-07-01",
  statute: "Reconciliation Act of 2025",
  caps: {
    graduate:     { annual: 20500,  aggregate: 100000 },
    professional: { annual: 50000,  aggregate: 200000 },
  },
  total_federal_aggregate: 257500,
  old_grad_plus: { interest_rate_2025_2026: 0.0894, loan_fee: 0.04228, annual_limit: "cost_of_attendance_minus_aid" },
};

// ─────────────────────────────────────────────────────────────────────────────

describe("computeGap", () => {
  it("computes annual gap for an MBA at Harvard (graduate cap binds)", () => {
    const result = computeGap(
      { schoolId: "harvard", programType: "mba", startYear: 2026 },
      testSchools, testPrograms, testCaps
    );
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.coaPerYear).toBe(124800);
    expect(result.capPerYear).toBe(20500);
    expect(result.gapPerYear).toBe(124800 - 20500);
    expect(result.lengthYears).toBe(2);
    expect(result.totalCoa).toBe(124800 * 2);
    expect(result.totalCap).toBe(20500 * 2);
    expect(result.totalGap).toBe(124800 * 2 - 20500 * 2);
    expect(result.programShortLabel).toBe("MBA");
    expect(result.schoolShortName).toBe("Harvard University");
  });

  it("clamps total cap by aggregate for a 4-year MD (professional aggregate binds)", () => {
    const result = computeGap(
      { schoolId: "harvard", programType: "md", startYear: 2026 },
      testSchools, testPrograms, testCaps
    );
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.coaPerYear).toBe(113000);
    expect(result.capPerYear).toBe(50000);
    expect(result.lengthYears).toBe(4);
    expect(result.totalCoa).toBe(113000 * 4);
    expect(result.totalCap).toBe(200000);          // aggregate clamps 50k×4=200k
    expect(result.totalGap).toBe(113000 * 4 - 200000);
  });

  it("returns missing_school for an unknown school id", () => {
    const result = computeGap(
      { schoolId: "not-a-real-school", programType: "jd", startYear: 2026 },
      testSchools, testPrograms, testCaps
    );
    expect(result.kind).toBe("missing_school");
  });

  it("returns missing_program when the school does not offer the requested program", () => {
    const result = computeGap(
      { schoolId: "harvard", programType: "dvm", startYear: 2026 },
      testSchools, testPrograms, testCaps
    );
    expect(result.kind).toBe("missing_program");
    if (result.kind !== "missing_program") return;
    expect(result.schoolName).toBe("Harvard University");
  });

  it("never produces a negative gap (low-COA, high-aid edge case)", () => {
    // NYU MD is tuition-free — COA ($40k) is below the professional cap ($50k/yr)
    const result = computeGap(
      { schoolId: "nyu", programType: "md", startYear: 2026 },
      testSchools, testPrograms, testCaps
    );
    expect(result.kind).toBe("ok");
    if (result.kind !== "ok") return;
    expect(result.gapPerYear).toBe(0);
    expect(result.totalGap).toBeGreaterThanOrEqual(0);
  });
});
