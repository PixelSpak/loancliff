"use client";

import { useState, useCallback } from "react";
import { computeGap } from "@/lib/calc";
import { caps, programs, schools } from "@/lib/data";
import type { CalcSuccess, ProgramType } from "@/lib/types";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtInput(raw: string): number {
  const n = parseInt(raw.replace(/[^0-9]/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

/* ── Aggregate exhaustion warning ─────────────────────────────────────────── */

function AggregateWarning({
  capPerYear,
  aggregateCap,
  lengthYears,
}: {
  capPerYear: number;
  aggregateCap: number;
  lengthYears: number;
}) {
  const [priorDebtRaw, setPriorDebtRaw] = useState("");
  const priorDebt = fmtInput(priorDebtRaw);
  const remaining = Math.max(0, aggregateCap - priorDebt);
  const yearsOfFederal = remaining > 0 ? Math.floor(remaining / capPerYear) : 0;
  const exhaustedMidProgram = priorDebt > 0 && yearsOfFederal < lengthYears;

  return (
    <div className="mt-4 pt-4 border-t border-[#e2e8f0]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#44474d] mb-2">
        Prior Federal Loans
      </p>
      <p className="text-xs text-[#74777e] mb-3 leading-relaxed">
        If you borrowed federal loans for undergrad or a prior degree, you may hit the lifetime aggregate cap before finishing this program.
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#44474d] shrink-0">I already owe</span>
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#74777e] text-sm">$</span>
          <input
            type="text"
            inputMode="numeric"
            value={priorDebtRaw}
            onChange={(e) => setPriorDebtRaw(e.target.value)}
            placeholder="0"
            className="w-full h-9 pl-6 pr-3 bg-white border border-[#c4c6ce] rounded text-sm text-[#1b1c1e] focus:border-[#001229] focus:ring-1 focus:ring-[#001229] focus:outline-none transition-colors"
          />
        </div>
        <span className="text-sm text-[#44474d] shrink-0">in federal loans</span>
      </div>

      {priorDebt > 0 && (
        <div className={`mt-3 rounded p-3 text-sm leading-relaxed ${
          exhaustedMidProgram
            ? "bg-[#ffdad6]/30 border border-[#ba1a1a]/20 text-[#ba1a1a]"
            : "bg-[#eef2ff] border border-[#c7d2fe] text-[#1b1c1e]"
        }`}>
          {exhaustedMidProgram ? (
            <>
              <strong>Warning:</strong> With {fmt(priorDebt)} in prior federal loans, your {fmt(aggregateCap)} lifetime cap is exhausted after <strong>Year {yearsOfFederal}</strong> of your {lengthYears}-year program. You will have <strong>zero federal borrowing</strong> for the remaining {lengthYears - yearsOfFederal} year{lengthYears - yearsOfFederal > 1 ? "s" : ""}.
            </>
          ) : remaining >= aggregateCap ? (
            <>Your prior debt leaves {fmt(remaining)} of your {fmt(aggregateCap)} aggregate remaining -- enough to cover the full program.</>
          ) : (
            <>With {fmt(priorDebt)} in prior loans, you have {fmt(remaining)} of your {fmt(aggregateCap)} aggregate remaining ({yearsOfFederal} full year{yearsOfFederal !== 1 ? "s" : ""} of federal borrowing).</>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main GapSection component ────────────────────────────────────────────── */

interface Props {
  schoolId: string;
  programType: string;
  defaultResult: CalcSuccess;
}

export function GapSection({ schoolId, programType, defaultResult }: Props) {
  const [isInState, setIsInState] = useState(false);

  const inStateResult: CalcSuccess | null = defaultResult.hasInStateRate
    ? (() => {
        const r = computeGap(
          { schoolId, programType: programType as ProgramType, startYear: 2026, residency: "in-state" },
          schools, programs, caps
        );
        return r.kind === "ok" ? r : null;
      })()
    : null;

  const result = isInState && inStateResult ? inStateResult : defaultResult;
  const aggregateCap = result.category === "professional" ? 200_000 : 100_000;

  const handleToggle = useCallback((inState: boolean) => {
    setIsInState(inState);
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Gap number card (toggle lives inside to keep top edge flush with Bridge the Gap) ── */}
      <div className="bg-white border border-[#c4c6ce] rounded-lg p-8 flex flex-col items-center shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
        {defaultResult.hasInStateRate && (
          <div className="flex items-center gap-1 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className={`text-xs font-semibold px-4 py-1.5 rounded transition-colors ${
                !isInState
                  ? "bg-[#001229] text-white shadow-sm"
                  : "text-[#44474d] hover:text-[#1b1c1e]"
              }`}
            >
              Out-of-state
            </button>
            <button
              type="button"
              onClick={() => handleToggle(true)}
              className={`text-xs font-semibold px-4 py-1.5 rounded transition-colors ${
                isInState
                  ? "bg-[#001229] text-white shadow-sm"
                  : "text-[#44474d] hover:text-[#1b1c1e]"
              }`}
            >
              In-state
            </button>
          </div>
        )}
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#44474d] mb-3">
          Total Funding Gap{isInState ? " (In-State)" : ""}
        </p>
        <p className="font-serif text-[64px] leading-none font-semibold text-[#ba1a1a] tabular-nums">
          {fmt(result.totalGap)}
        </p>
        <p className="text-sm text-[#44474d] mt-4">
          Over {result.lengthYears} years &middot;{" "}
          <strong className="text-[#1b1c1e]">{fmt(result.gapPerYear)}/year</strong>{" "}
          uncovered &middot; ~{fmt(result.monthlyEquivalent)}/month
        </p>
      </div>

      {/* ── Breakdown section ── */}
      <div className="bg-white border border-[#c4c6ce] rounded-lg p-8 shadow-[0_12px_24px_rgba(0,0,0,0.04)] flex flex-col gap-5">
        <h2 className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
          Cost &amp; Funding Breakdown
        </h2>
        <div className="flex flex-col text-base">
          <div className="flex justify-between items-center py-3 border-b border-[#c4c6ce]/30">
            <span className="text-[#44474d]">
              Cost of Attendance (IPEDS {result.citation.ipedsYear}){isInState ? " — in-state" : ""}
            </span>
            <span className="font-serif text-xl font-semibold text-[#1b1c1e] tabular-nums">
              {fmt(result.coaPerYear)}/yr
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#c4c6ce]/30">
            <div className="flex items-center gap-2 text-[#44474d]">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
              </svg>
              New Federal Cap &mdash; {result.category} programs
            </div>
            <span className="font-serif text-xl font-semibold text-[#1b1c1e] tabular-nums">
              {fmt(result.capPerYear)}/yr
            </span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#c4c6ce]/30 text-sm text-[#74777e]">
            <span>&times; {result.lengthYears} years, aggregate cap {fmt(aggregateCap)}</span>
            <span className="font-bold text-[#ba1a1a] text-base tabular-nums">{fmt(result.totalGap)}</span>
          </div>
          <div className="flex justify-between items-center py-3 mt-1 bg-[#ffdad6]/20 px-3 rounded">
            <span className="text-lg font-bold text-[#ba1a1a]">Funding Gap</span>
            <span className="font-serif text-[28px] leading-none font-semibold text-[#ba1a1a] tabular-nums">
              ={fmt(result.totalGap)}
            </span>
          </div>
        </div>

        {/* Aggregate cap exhaustion warning */}
        <AggregateWarning
          capPerYear={result.capPerYear}
          aggregateCap={aggregateCap}
          lengthYears={result.lengthYears}
        />

        <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#74777e] flex items-center gap-1.5 mt-auto pt-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Source: IPEDS {result.citation.ipedsYear} &middot; {result.citation.statute}
        </p>
      </div>
    </div>
  );
}
