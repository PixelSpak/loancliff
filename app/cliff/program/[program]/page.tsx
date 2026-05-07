export const dynamic = "force-static";
export const dynamicParams = false;

import type { Metadata } from "next";
import Link from "next/link";
import { computeGap } from "@/lib/calc";
import { caps, programs, schools } from "@/lib/data";
import type { ProgramType } from "@/lib/types";

const STATE_NAMES: Record<string, string> = {
  AK: "Alaska", AL: "Alabama", AR: "Arkansas", AZ: "Arizona", CA: "California",
  CO: "Colorado", CT: "Connecticut", DC: "Washington D.C.", DE: "Delaware",
  FL: "Florida", GA: "Georgia", GU: "Guam", HI: "Hawaii", IA: "Iowa",
  ID: "Idaho", IL: "Illinois", IN: "Indiana", KS: "Kansas", KY: "Kentucky",
  LA: "Louisiana", MA: "Massachusetts", MD: "Maryland", ME: "Maine",
  MI: "Michigan", MN: "Minnesota", MO: "Missouri", MS: "Mississippi",
  MT: "Montana", NC: "North Carolina", ND: "North Dakota", NE: "Nebraska",
  NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NV: "Nevada",
  NY: "New York", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  PR: "Puerto Rico", RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota",
  TN: "Tennessee", TX: "Texas", UT: "Utah", VA: "Virginia", VI: "U.S. Virgin Islands",
  VT: "Vermont", WA: "Washington", WI: "Wisconsin", WV: "West Virginia", WY: "Wyoming",
};

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function generateStaticParams() {
  return Object.keys(programs).map((prog) => ({ program: prog }));
}

interface Props {
  params: Promise<{ program: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { program } = await params;
  const prog = programs[program as ProgramType];
  if (!prog) return { title: "Program not found — Loan Cliff" };

  const count = Object.values(schools).filter((s) => program in s.programs).length;
  const capLabel = prog.category === "professional" ? "$50,000/yr" : "$20,500/yr";

  return {
    title: `${prog.shortLabel} Funding Gaps at ${count} Schools | Loan Cliff`,
    description: `${prog.shortLabel} students face funding gaps above the new ${capLabel} federal cap at ${count} schools after the July 2026 Grad PLUS elimination. Find your school's exact gap.`,
    alternates: { canonical: `/cliff/program/${program}` },
    openGraph: {
      title: `${prog.shortLabel} Funding Gaps at ${count} Schools | Loan Cliff`,
      description: `${prog.shortLabel} students face funding gaps above the new ${capLabel} federal cap at ${count} schools.`,
      url: `https://loancliff.com/cliff/program/${program}`,
      type: "website",
    },
  };
}

export default async function ProgramIndexPage({ params }: Props) {
  const { program } = await params;
  const prog = programs[program as ProgramType];
  if (!prog) return null;

  const matchingSchools = Object.values(schools)
    .filter((s) => program in s.programs)
    .sort((a, b) => {
      const stateA = a.state ?? "";
      const stateB = b.state ?? "";
      if (stateA !== stateB) return stateA.localeCompare(stateB);
      return a.name.localeCompare(b.name);
    });

  // Group by state
  const byState = new Map<string, typeof matchingSchools>();
  for (const school of matchingSchools) {
    const st = school.state ?? "Other";
    if (!byState.has(st)) byState.set(st, []);
    byState.get(st)!.push(school);
  }

  const capLabel = prog.category === "professional" ? "$50,000/yr" : "$20,500/yr";
  const capPerYear = prog.category === "professional" ? 50_000 : 20_500;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://loancliff.com" },
      { "@type": "ListItem", position: 2, name: "Browse Schools", item: "https://loancliff.com/cliff" },
      { "@type": "ListItem", position: 3, name: prog.shortLabel, item: `https://loancliff.com/cliff/program/${program}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="w-full max-w-5xl mx-auto pt-28 pb-24 px-6 sm:px-8 flex flex-col gap-10">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#74777e] flex items-center gap-2">
          <Link href="/" className="hover:text-[#001229] transition-colors">Loan Cliff</Link>
          <span aria-hidden="true">›</span>
          <Link href="/cliff" className="hover:text-[#001229] transition-colors">Browse Schools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-[#1b1c1e]">{prog.shortLabel}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229]">
            {prog.label} Funding Gaps
          </h1>
          <p className="text-base text-[#44474d] leading-relaxed max-w-2xl">
            After July 2026, {prog.shortLabel} students are capped at{" "}
            <strong className="text-[#1b1c1e]">{capLabel}</strong> in federal loans.{" "}
            <strong className="text-[#1b1c1e]">{matchingSchools.length.toLocaleString()} schools</strong>{" "}
            below all have programs where the cost of attendance exceeds that cap. Click your school to see the exact gap.
          </p>
        </div>

        {/* Cap callout */}
        <div className="bg-[#ffdad6]/20 border border-[#ba1a1a]/20 rounded-lg px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#ba1a1a]">
              New Federal Cap — {prog.category === "professional" ? "Professional Student" : "Graduate Student"}
            </p>
            <p className="text-2xl font-bold font-serif text-[#ba1a1a]">{capLabel}</p>
          </div>
          <p className="text-sm text-[#44474d] sm:ml-8 sm:border-l sm:border-[#ba1a1a]/20 sm:pl-8 leading-relaxed">
            The Reconciliation Act of 2025 eliminated Grad PLUS on July 1, 2026. Any school cost above {capLabel} must be covered by private loans or other funding.{" "}
            <Link href="/learn/grad-plus-loans-eliminated-2026" className="text-[#001229] font-semibold hover:underline">
              Learn more →
            </Link>
          </p>
        </div>

        {/* Schools by state */}
        <section className="flex flex-col gap-8">
          {[...byState.entries()].map(([stateCode, stateSchools]) => {
            const stateName = STATE_NAMES[stateCode] ?? stateCode;
            return (
              <div key={stateCode} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-[#44474d] uppercase tracking-[0.07em]">{stateName}</h2>
                  <div className="flex-1 border-t border-[#e2e8f0]" />
                  <Link
                    href={`/cliff/state/${stateCode.toLowerCase()}`}
                    className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#74777e] hover:text-[#001229] transition-colors"
                  >
                    All {stateName} schools →
                  </Link>
                </div>
                <div className="flex flex-col gap-2">
                  {stateSchools.map((school) => {
                    const result = computeGap(
                      { schoolId: school.id, programType: program as ProgramType, startYear: 2026 },
                      schools, programs, caps
                    );
                    const gap = result.kind === "ok" ? result.gapPerYear : null;
                    const hasGap = gap !== null && gap > 0;
                    return (
                      <Link
                        key={school.id}
                        href={`/cliff/${school.id}/${program}`}
                        className="group flex items-center justify-between bg-white border border-[#c4c6ce] rounded px-5 py-3 hover:border-[#001229] transition-colors"
                      >
                        <span className="text-sm font-semibold text-[#1b1c1e] group-hover:text-[#001229] transition-colors">
                          {school.name}
                        </span>
                        <div className="flex items-center gap-3 shrink-0 ml-4">
                          {hasGap ? (
                            <span className="text-sm font-bold text-[#ba1a1a] tabular-nums">
                              {fmt(gap!)}/yr gap
                            </span>
                          ) : (
                            <span className="text-xs text-[#74777e]">Within cap</span>
                          )}
                          <svg className="w-4 h-4 text-[#74777e] group-hover:text-[#001229] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

      </main>
    </>
  );
}
