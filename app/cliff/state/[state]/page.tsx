export const dynamic = "force-static";
export const dynamicParams = false;

import type { Metadata } from "next";
import Link from "next/link";
import { schools, programs } from "@/lib/data";
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

const PROG_ORDER = ["md", "do", "jd", "dds", "pharmd", "dvm", "od", "mba", "phd", "ms", "ma", "med"];

export function generateStaticParams() {
  const states = [...new Set(Object.values(schools).map((s) => s.state).filter(Boolean))];
  return states.map((state) => ({ state: state.toLowerCase() }));
}

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const code = state.toUpperCase();
  const name = STATE_NAMES[code] ?? code;
  const count = Object.values(schools).filter((s) => s.state?.toUpperCase() === code).length;

  return {
    title: `Graduate School Funding Gaps in ${name} | Loan Cliff`,
    description: `${count} schools in ${name} are affected by the July 2026 Grad PLUS elimination. Find the exact funding gap for MD, JD, MBA, PharmD, and other programs.`,
    alternates: { canonical: `/cliff/state/${state.toLowerCase()}` },
    openGraph: {
      title: `Graduate School Funding Gaps in ${name} | Loan Cliff`,
      description: `${count} schools in ${name} are affected by the July 2026 Grad PLUS elimination.`,
      url: `https://loancliff.com/cliff/state/${state.toLowerCase()}`,
      type: "website",
    },
  };
}

export default async function StatePage({ params }: Props) {
  const { state } = await params;
  const code = state.toUpperCase();
  const stateName = STATE_NAMES[code] ?? code;

  const stateSchools = Object.values(schools)
    .filter((s) => s.state?.toUpperCase() === code)
    .sort((a, b) => a.name.localeCompare(b.name));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://loancliff.com" },
      { "@type": "ListItem", position: 2, name: "Browse Schools", item: "https://loancliff.com/cliff" },
      { "@type": "ListItem", position: 3, name: stateName, item: `https://loancliff.com/cliff/state/${state.toLowerCase()}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="w-full max-w-5xl mx-auto pt-28 pb-24 px-6 sm:px-8 flex flex-col gap-8">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#74777e] flex items-center gap-2">
          <Link href="/" className="hover:text-[#001229] transition-colors">Loan Cliff</Link>
          <span aria-hidden="true">›</span>
          <Link href="/cliff" className="hover:text-[#001229] transition-colors">Browse Schools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-[#1b1c1e]">{stateName}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229]">
            Graduate Funding Gaps in {stateName}
          </h1>
          <p className="text-base text-[#44474d] leading-relaxed max-w-2xl">
            {stateSchools.length} school{stateSchools.length !== 1 ? "s" : ""} in {stateName}{" "}
            offer programs affected by the July 2026 Grad PLUS elimination. Select any program to
            calculate the exact uncovered funding gap.
          </p>
        </div>

        {/* School list */}
        <section aria-label={`Schools in ${stateName}`} className="flex flex-col gap-3">
          {stateSchools.map((school) => {
            const progKeys = PROG_ORDER.filter((p) => school.programs[p as ProgramType]);
            return (
              <div
                key={school.id}
                className="bg-white border border-[#c4c6ce] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-bold text-[#1b1c1e] truncate">{school.name}</span>
                  {school.state && (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#74777e]">
                      {stateName}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {progKeys.map((prog) => {
                    const p = programs[prog as ProgramType];
                    return (
                      <Link
                        key={prog}
                        href={`/cliff/${school.id}/${prog}`}
                        className="text-[11px] font-semibold uppercase tracking-[0.05em] border border-[#c4c6ce] rounded px-2.5 py-1 text-[#44474d] hover:border-[#001229] hover:text-[#001229] transition-colors whitespace-nowrap"
                      >
                        {p?.shortLabel ?? prog.toUpperCase()}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        {/* Back link */}
        <div className="border-t border-[#e2e8f0] pt-6 flex items-center justify-between flex-wrap gap-3">
          <Link
            href="/cliff"
            className="text-sm text-[#001229] font-medium hover:opacity-70 transition-opacity"
          >
            ← Browse all states
          </Link>
          <Link
            href="/"
            className="text-sm text-[#001229] font-medium hover:opacity-70 transition-opacity"
          >
            Use the calculator →
          </Link>
        </div>

      </main>
    </>
  );
}
