"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { schools, programs } from "@/lib/data";
import { trackEvent } from "@/lib/analytics";
import type { ProgramType } from "@/lib/types";

/* ── constants ── */

const ALL_PROGRAM_OPTIONS: ProgramType[] = [
  "mba", "md", "do", "jd", "dds", "pharmd", "dvm", "od", "phd", "ms", "ma", "med",
];

const START_YEARS = [2026, 2027, 2028, 2029, 2030];

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

function InfoIcon() {
  return (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

/* ── shared classes ── */

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.05em] text-[#1b1c1e] mb-2";

const inputBase =
  "w-full h-12 bg-white border border-[#c4c6ce] rounded text-[#1b1c1e] text-base " +
  "placeholder:text-[#74777e] focus:border-[#001229] focus:ring-1 focus:ring-[#001229] " +
  "focus:outline-none transition-colors";

/* ── SchoolCombobox ── */

interface SchoolEntry { id: string; name: string; shortName: string; state: string }

function SchoolCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const allSchools: SchoolEntry[] = useMemo(
    () =>
      Object.values(schools)
        .map((s) => ({ id: s.id, name: s.name, shortName: s.shortName ?? s.name, state: s.state ?? "" }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const selectedSchool = useMemo(
    () => (value ? allSchools.find((s) => s.id === value) ?? null : null),
    [value, allSchools]
  );

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  const filtered = useMemo(() => {
    if (!query.trim()) return allSchools.slice(0, 60);
    const q = query.toLowerCase();
    return allSchools
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortName.toLowerCase().includes(q) ||
          s.state.toLowerCase() === q
      )
      .slice(0, 60);
  }, [query, allSchools]);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  /* close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* scroll highlighted item into view */
  useEffect(() => {
    if (!open || !listRef.current) return;
    const item = listRef.current.children[highlighted] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setOpen(true);
    setHighlighted(0);
    if (value) onChange(""); // clear selection when user types
  }

  function selectSchool(school: SchoolEntry) {
    onChange(school.id);
    setQuery("");
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) selectSchool(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
    setQuery("");
    setOpen(false);
    inputRef.current?.focus();
  }

  const displayValue = selectedSchool ? selectedSchool.name : query;
  const listboxId = "school-options";

  return (
    <div ref={containerRef} className="relative">
      {/* Input */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777e] pointer-events-none">
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          id="school"
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for an institution..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-expanded={open}
          aria-haspopup="listbox"
          role="combobox"
          className={`${inputBase} pl-10 pr-10 ${selectedSchool ? "font-medium" : ""}`}
        />
        {(selectedSchool || query) && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74777e] hover:text-[#001229] transition-colors"
            aria-label="Clear school selection"
          >
            <XIcon />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-[calc(100%+4px)] left-0 right-0 bg-white border border-[#001229] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-[#e2e8f0] bg-[#f8fafc]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#74777e]">
              {query ? `${filtered.length} results` : `Showing ${filtered.length} of ${allSchools.length} schools`}
            </p>
          </div>

          {/* List */}
          <ul
            id={listboxId}
            ref={listRef}
            role="listbox"
            className="overflow-y-auto max-h-64"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-[#74777e]">
                No schools found for &ldquo;{query}&rdquo;
              </li>
            ) : (
              filtered.map((school, i) => (
                <li
                  key={school.id}
                  role="option"
                  aria-selected={school.id === value}
                  onMouseDown={(e) => { e.preventDefault(); selectSchool(school); }}
                  onMouseEnter={() => setHighlighted(i)}
                  className={[
                    "flex items-center justify-between px-4 py-3 cursor-pointer border-b border-[#f1f1f1] last:border-0 transition-colors",
                    i === highlighted ? "bg-[#001229] text-white" : "hover:bg-[#f8fafc] text-[#1b1c1e]",
                  ].join(" ")}
                >
                  <span className={`text-sm font-medium ${i === highlighted ? "text-white" : "text-[#1b1c1e]"}`}>
                    {school.name}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.06em] ml-3 shrink-0 ${i === highlighted ? "text-[#b2c8ed]" : "text-[#74777e]"}`}>
                    {school.state}
                  </span>
                </li>
              ))
            )}
          </ul>

          {!query && (
            <div className="px-4 py-2 border-t border-[#e2e8f0] bg-[#f8fafc]">
              <p className="text-[10px] text-[#74777e]">Type to search all 1,788 institutions</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── page ── */

export default function Home() {
  const router = useRouter();

  const [schoolId, setSchoolId] = useState("");
  const [programType, setProgramType] = useState<ProgramType | "">("");
  const [startYear, setStartYear] = useState<number>(2026);
  const [loading, setLoading] = useState(false);

  const availablePrograms = useMemo(() => {
    if (!schoolId || !schools[schoolId]) return ALL_PROGRAM_OPTIONS;
    const offered = new Set(Object.keys(schools[schoolId].programs));
    return ALL_PROGRAM_OPTIONS.filter((p) => offered.has(p));
  }, [schoolId]);

  /* reset program when school changes and current program is unavailable */
  const handleSchoolChange = useCallback((id: string) => {
    setSchoolId(id);
    if (id && schools[id]) {
      trackEvent("school_selected", {
        school_id: id,
        school_name: schools[id].name,
      });
    }
    if (programType && id && schools[id] && !schools[id].programs[programType]) {
      setProgramType("");
    }
  }, [programType]);

  function handleProgramChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextProgram = e.target.value as ProgramType;
    setProgramType(nextProgram);
    if (nextProgram) {
      trackEvent("program_selected", {
        school_id: schoolId,
        program_type: nextProgram,
        program_label: programs[nextProgram].label,
      });
    }
  }

  function handleStartYearChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStartYear(Number(e.target.value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolId || !programType) return;
    setLoading(true);
    trackEvent("calculator_started", {
      school_id: schoolId,
      school_name: schools[schoolId]?.name,
      program_type: programType,
      start_year: startYear,
    });
    router.push(`/cliff/${schoolId}/${programType}`);
  }

  const canSubmit = !!schoolId && !!programType;

  return (
    <main className="min-h-screen flex flex-col items-center pt-28 pb-24 px-6">
      {/* ── Hero ── */}
      <div className="text-center mb-10 max-w-xl">
        <h1 className="font-serif text-[40px] sm:text-[44px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229] mb-4">
          Calculate Your Graduate<br />Funding Gap for 2026.
        </h1>
        <p className="text-base text-[#44474d] leading-relaxed">
          With the elimination of Grad PLUS loans, federal aid for professional
          degrees is changing. Find out your exact shortfall in three steps.
        </p>
      </div>

      {/* ── Form card ── */}
      <div className="w-full max-w-[500px] bg-white border border-[#c4c6ce] rounded-lg p-8 sm:p-10 shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          {/* School */}
          <div>
            <label className={labelClass} htmlFor="school">School</label>
            <SchoolCombobox value={schoolId} onChange={handleSchoolChange} />
          </div>

          {/* Program */}
          <div>
            <label className={labelClass} htmlFor="program">Program</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777e] pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </span>
              <select
                id="program"
                value={programType}
                onChange={handleProgramChange}
                disabled={!schoolId}
                required
                className={`${inputBase} pl-10 pr-10 appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <option value="">
                  {schoolId ? "Choose your program…" : "Select a school first"}
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
            <label className={labelClass} htmlFor="year">Start Year</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74777e] pointer-events-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <select
                id="year"
                value={startYear}
                onChange={handleStartYearChange}
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
              disabled={!canSubmit || loading}
              className="w-full h-14 bg-[#001229] text-white text-lg font-bold rounded flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Calculating…
                </>
              ) : (
                <>
                  Show My Gap
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Trust signal ── */}
      <div className="mt-4 flex items-center gap-1.5 px-4 py-2.5 bg-[#efedf0] border border-[#c4c6ce]/50 rounded max-w-[500px]">
        <span className="text-[#74777e]"><InfoIcon /></span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#44474d]">
          Data sources: U.S. Dept. of Education · IPEDS · Updated for 2026 projections
        </span>
      </div>
    </main>
  );
}
