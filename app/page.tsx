"use client";

import { useMemo, useRef, useState } from "react";
import { computeGap } from "@/lib/calc";
import { caps, programs, schools } from "@/lib/data";
import type { CalcOutput, ProgramType } from "@/lib/types";

const ALL_PROGRAM_OPTIONS: ProgramType[] = [
  "mba", "md", "do", "jd", "dds", "pharmd", "dvm", "od", "phd", "ms", "ma", "med",
];

const START_YEARS = [2026, 2027, 2028, 2029, 2030];

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Home() {
  const schoolEntries = useMemo(
    () => Object.values(schools).sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const [schoolId, setSchoolId] = useState("");
  const [programType, setProgramType] = useState<ProgramType | "">("");
  const [startYear, setStartYear] = useState<number>(2026);
  const [result, setResult] = useState<CalcOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const resultRef = useRef<HTMLElement>(null);

  // Programs offered by the selected school
  const availablePrograms = useMemo(() => {
    if (!schoolId || !schools[schoolId]) return ALL_PROGRAM_OPTIONS;
    const offered = new Set(Object.keys(schools[schoolId].programs));
    return ALL_PROGRAM_OPTIONS.filter((p) => offered.has(p));
  }, [schoolId]);

  function handleSchoolChange(id: string) {
    setSchoolId(id);
    // Reset program if the new school doesn't offer the currently selected one
    if (programType && schools[id] && !schools[id].programs[programType]) {
      setProgramType("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolId || !programType) return;
    const r = computeGap(
      { schoolId, programType, startYear },
      schools,
      programs,
      caps
    );
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

  return (
    <main className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
      <a
        href="#results"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:px-3 focus:py-2 focus:rounded focus:text-sm focus:font-medium"
      >
        Skip to results
      </a>

      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Loan Cliff</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Grad PLUS loans are eliminated July 1, 2026. See exactly how much of
          your program cost won&apos;t be covered by federal loans anymore.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="school">
            School
          </label>
          <select
            id="school"
            className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-900"
            value={schoolId}
            onChange={(e) => handleSchoolChange(e.target.value)}
            required
          >
            <option value="">Select a school</option>
            {schoolEntries.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="program">
            Program
          </label>
          <select
            id="program"
            className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
            value={programType}
            onChange={(e) => setProgramType(e.target.value as ProgramType)}
            disabled={!schoolId}
            required
          >
            <option value="">
              {schoolId ? "Select a program" : "Select a school first"}
            </option>
            {availablePrograms.map((p) => (
              <option key={p} value={p}>
                {programs[p].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="year">
            Start year
          </label>
          <select
            id="year"
            className="w-full border rounded px-3 py-2 bg-white dark:bg-zinc-900"
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
          >
            {START_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!schoolId || !programType}
          className="w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Show my gap
        </button>
      </form>

      <section id="results" ref={resultRef} aria-live="polite">
        {result?.kind === "ok" && (
          <div className="border-t pt-8 space-y-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Students starting {programs[programType as ProgramType]?.label} at schools
              like {result.schoolShortName} face this gap starting July 2026.
            </p>

            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Your funding gap · {result.schoolShortName} {result.programShortLabel}
                </p>
                <p className="text-5xl font-bold text-red-600 mt-2 tabular-nums leading-none">
                  {formatUSD(result.totalGap)}
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  Over {result.lengthYears} years ·{" "}
                  {formatUSD(result.gapPerYear)}/year · ~
                  {formatUSD(result.monthlyEquivalent)}/month equivalent
                </p>
              </div>
              <button
                onClick={handleShare}
                className="shrink-0 text-sm border rounded px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                {copied ? "Link copied!" : "Share this gap →"}
              </button>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-5 text-sm space-y-1 text-zinc-700 dark:text-zinc-300">
              <p className="font-medium text-base mb-3">How this number is calculated</p>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Cost of attendance</span>
                <span className="tabular-nums">{formatUSD(result.totalCoa)} total</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">
                  New federal cap ({result.category})
                </span>
                <span className="tabular-nums text-green-700 dark:text-green-400">
                  −{formatUSD(result.totalCap)} total
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold mt-2">
                <span>Your uncovered gap</span>
                <span className="text-red-600 tabular-nums">{formatUSD(result.totalGap)}</span>
              </div>
              <p className="text-xs text-zinc-400 mt-3 pt-2 border-t">
                {result.citation.statute}
              </p>
            </div>
          </div>
        )}

        {result?.kind === "missing_school" && (
          <p className="text-zinc-600 dark:text-zinc-400 border-t pt-6">
            We don&apos;t have data for this school yet.
          </p>
        )}

        {result?.kind === "missing_program" && (
          <p className="text-zinc-600 dark:text-zinc-400 border-t pt-6">
            {result.schoolName} doesn&apos;t offer {result.programType} in our dataset.
          </p>
        )}
      </section>
    </main>
  );
}
