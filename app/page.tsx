"use client";

import { useMemo, useRef, useState } from "react";
import { computeGap } from "@/lib/calc";
import { caps, programs, schools } from "@/lib/data";
import { affiliateList } from "@/lib/affiliates";
import type { CalcOutput, ProgramType } from "@/lib/types";

/* ── constants ── */

const ALL_PROGRAM_OPTIONS: ProgramType[] = [
  "mba", "md", "do", "jd", "dds", "pharmd", "dvm", "od", "phd", "ms", "ma", "med",
];

const START_YEARS = [2026, 2027, 2028, 2029, 2030];

const AFFILIATE_DISPLAY: Record<string, { letter: string; bg: string; color: string }> = {
  Credible:  { letter: "C", bg: "#0f2744", color: "#ffffff" },
  ELFI:      { letter: "E", bg: "#14532d", color: "#ffffff" },
  LendKey:   { letter: "L", bg: "#374151", color: "#ffffff" },
  SoFi:      { letter: "S", bg: "#ff632c", color: "#ffffff" },
  Earnest:   { letter: "E", bg: "#3b2000", color: "#b0855a" },
};

/* ── helpers ── */

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/* ── icons ── */

function SearchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );
}

/* ── shared input classes ── */

const inputBase =
  "w-full h-12 bg-white border border-[#c4c6ce] rounded text-[#1b1c1e] text-base placeholder:text-[#74777e] " +
  "focus:border-[#001229] focus:ring-1 focus:ring-[#001229] focus:outline-none transition-colors";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.05em] text-[#1b1c1e] mb-2";

/* ── component ── */

export default function Home() {
  const schoolEntries = useMemo(
    () => Object.values(schools).sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const schoolsByName = useMemo(() => {
    const map = new Map<string, string>();
    schoolEntries.forEach((s) => map.set(s.name, s.id));
    return map;
  }, [schoolEntries]);

  const [schoolInput, setSchoolInput] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [programType, setProgramType] = useState<ProgramType | "">("");
  const [startYear, setStartYear] = useState<number>(2026);
  const [result, setResult] = useState<CalcOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const resultRef = useRef<HTMLElement>(null);

  const availablePrograms = useMemo(() => {
    if (!schoolId || !schools[schoolId]) return ALL_PROGRAM_OPTIONS;
    const offered = new Set(Object.keys(schools[schoolId].programs));
    return ALL_PROGRAM_OPTIONS.filter((p) => offered.has(p));
  }, [schoolId]);

  function handleSchoolChange(id: string) {
    setSchoolId(id);
    if (programType && schools[id] && !schools[id].programs[programType]) {
      setProgramType("");
    }
  }

  function handleSchoolInput(val: string) {
    setSchoolInput(val);
    const id = schoolsByName.get(val) ?? "";
    handleSchoolChange(id);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolId || !programType) return;
    const r = computeGap({ schoolId, programType, startYear }, schools, programs, caps);
    setResult(r);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function handleShare() {
    if (result?.kind !== "ok") return;
    const url = `https://loancliff.com/cliff/${schoolId}/${programType}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const canSubmit = !!schoolId && !!programType;

  return (
    <main className="min-h-screen flex flex-col items-center pt-28 pb-24 px-6">
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-4 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded focus:text-sm focus:font-medium"
      >
        Skip to results
      </a>

      {/* ── Hero ── */}
      <div className="text-center mb-10 max-w-xl">
        <h1 className="font-serif text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229] mb-4">
          Calculate Your Graduate<br />Funding Gap for 2026.
        </h1>
        <p className="text-base text-[#44474d] leading-relaxed">
          With the elimination of Grad PLUS loans, federal aid for professional
          degrees is changing. Find out your exact shortfall.
        </p>
      </div>

      {/* ── Form card ── */}
      <div className="w-full max-w-[500px] bg-white border border-[#c4c6ce] rounded-lg p-10 shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* School */}
          <div>
            <label className={labelClass} htmlFor="school">Select School</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777e]">
                <SearchIcon />
              </span>
              <input
                id="school"
                type="text"
                list="schools-list"
                value={schoolInput}
                onChange={(e) => handleSchoolInput(e.target.value)}
                placeholder="Search for an institution..."
                className={`${inputBase} pl-10 pr-4`}
                autoComplete="off"
                required
              />
              <datalist id="schools-list">
                {schoolEntries.map((s) => (
                  <option key={s.id} value={s.name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Program */}
          <div>
            <label className={labelClass} htmlFor="program">Select Program</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777e]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </span>
              <select
                id="program"
                value={programType}
                onChange={(e) => setProgramType(e.target.value as ProgramType)}
                disabled={!schoolId}
                required
                className={`${inputBase} pl-10 pr-10 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {schoolId ? "Choose field of study…" : "Select a school first"}
                </option>
                {availablePrograms.map((p) => (
                  <option key={p} value={p}>{programs[p].label}</option>
                ))}
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74777e] pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Year */}
          <div>
            <label className={labelClass} htmlFor="year">Academic Year</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777e]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <select
                id="year"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
                className={`${inputBase} pl-10 pr-10 appearance-none`}
              >
                {START_YEARS.map((y) => (
                  <option key={y} value={y}>{y}–{y + 1}</option>
                ))}
              </select>
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74777e] pointer-events-none">
                <ChevronDownIcon />
              </span>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 border-t border-[#c4c6ce]/30 mt-1">
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-14 bg-[#001229] text-white text-lg font-bold rounded flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              Show My Gap
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* ── Trust signal ── */}
      <div className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#efedf0] border border-[#c4c6ce]/50 rounded max-w-[500px]">
        <span className="text-[#74777e]"><InfoIcon /></span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#44474d]">
          Data sources: U.S. Department of Education, IPEDS. Updated for 2026 projections.
        </span>
      </div>

      {/* ── Results ── */}
      <section
        id="results"
        ref={resultRef}
        aria-live="polite"
        className="w-full max-w-3xl mt-14"
      >
        {result?.kind === "ok" && (
          <div className="flex flex-col gap-6">

            {/* Verified badge + heading */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="inline-flex items-center gap-2 bg-[#e9e7ea] border border-[#c4c6ce] rounded px-3 py-1">
                <span className="text-[#44474d]"><ShieldIcon /></span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#44474d]">
                  Verified Calculation
                </span>
              </div>
              <h2 className="font-serif text-[36px] leading-[1.15] font-semibold text-[#001229]">
                Your Estimated Uncovered Cost
              </h2>
              <p className="text-sm text-[#44474d] max-w-lg leading-relaxed">
                Based on your selected program and the projected 2026 federal loan
                limits, you will face a significant funding shortfall.
              </p>
            </div>

            {/* Gap number card */}
            <div className="bg-white border border-[#c4c6ce] rounded-lg p-10 flex flex-col items-center shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#44474d] mb-3">
                Total Funding Gap
              </p>
              <p className="font-serif text-[64px] leading-none font-semibold text-[#ba1a1a] tabular-nums">
                {fmt(result.totalGap)}
              </p>
            </div>

            {/* Two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

              {/* Breakdown */}
              <section
                aria-label="Gap calculation breakdown"
                className="lg:col-span-7 bg-white border border-[#c4c6ce] rounded-lg p-8 shadow-[0_12px_24px_rgba(0,0,0,0.04)] flex flex-col gap-5"
              >
                <h3 className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
                  Cost &amp; Funding Breakdown
                </h3>
                <div className="flex flex-col gap-0 text-base">
                  <div className="flex justify-between items-center py-3 border-b border-[#c4c6ce]/30">
                    <span className="text-[#44474d]">Estimated Cost of Attendance</span>
                    <span className="font-serif text-xl font-semibold text-[#1b1c1e] tabular-nums">
                      {fmt(result.totalCoa)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#c4c6ce]/30">
                    <div className="flex items-center gap-2 text-[#44474d]">
                      <MinusIcon />
                      <span>New Federal Loan Cap ({result.category})</span>
                    </div>
                    <span className="font-serif text-xl font-semibold text-[#1b1c1e] tabular-nums">
                      {fmt(result.totalCap)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 mt-1 bg-[#ffdad6]/20 px-3 rounded">
                    <span className="text-lg font-bold text-[#ba1a1a]">Funding Gap</span>
                    <span className="font-serif text-[28px] leading-none font-semibold text-[#ba1a1a] tabular-nums">
                      ={fmt(result.totalGap)}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#74777e] flex items-center gap-1.5 mt-auto pt-2">
                  <InfoIcon />
                  {result.citation.statute}
                </p>
              </section>

              {/* Bridge the gap */}
              <section
                aria-label="Private lender options"
                className="lg:col-span-5 bg-white border border-[#c4c6ce] rounded-lg p-8 shadow-[0_12px_24px_rgba(0,0,0,0.04)] flex flex-col gap-5"
              >
                <h3 className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
                  Bridge the Gap
                </h3>
                <p className="text-sm text-[#44474d] leading-relaxed">
                  Explore trusted private financing options to cover the remaining
                  costs of your education.
                </p>
                <div className="flex flex-col gap-3">
                  {affiliateList.map((aff) => {
                    const d = AFFILIATE_DISPLAY[aff.name] ?? { letter: aff.name[0], bg: "#374151", color: "#fff" };
                    return (
                      <a
                        key={aff.name}
                        href={aff.url}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="group flex items-center justify-between p-3 border border-[#c4c6ce] rounded hover:border-[#001229] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 flex items-center justify-center rounded text-sm font-bold shrink-0"
                            style={{ backgroundColor: d.bg, color: d.color }}
                          >
                            {d.letter}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#1b1c1e] group-hover:text-[#001229] transition-colors">
                              {aff.name}
                            </div>
                            <div className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#44474d]">
                              {aff.description.split(" — ")[0]}
                            </div>
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-[#74777e] group-hover:text-[#001229] transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Per-year + share row */}
            <div className="flex items-center justify-between gap-4 flex-wrap px-1">
              <p className="text-sm text-[#44474d]">
                Over {result.lengthYears} years ·{" "}
                <strong className="text-[#1b1c1e]">{fmt(result.gapPerYear)}/year</strong>{" "}
                · ~{fmt(result.monthlyEquivalent)}/month
              </p>
              <button
                onClick={handleShare}
                className="text-sm border border-[#c4c6ce] rounded px-4 py-2 text-[#44474d] hover:border-[#001229] hover:text-[#001229] transition-colors"
              >
                {copied ? "Link copied!" : "Share this gap →"}
              </button>
            </div>
          </div>
        )}

        {result?.kind === "missing_school" && (
          <div className="bg-white border border-[#c4c6ce] rounded-lg p-8 text-center text-[#44474d]">
            We don&apos;t have data for this school yet.
          </div>
        )}

        {result?.kind === "missing_program" && (
          <div className="bg-white border border-[#c4c6ce] rounded-lg p-8 text-center text-[#44474d]">
            {result.schoolName} doesn&apos;t offer {result.programType} in our dataset.
          </div>
        )}
      </section>
    </main>
  );
}
