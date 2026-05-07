export const dynamic = "force-static";

import type { Metadata } from "next";
import Link from "next/link";
import { schools, programs } from "@/lib/data";

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

export const metadata: Metadata = {
  title: "Graduate School Funding Gaps by State and Program | Loan Cliff",
  description:
    "Browse funding gap calculations for 1,788 graduate and professional schools across all 50 states. Find your exact uncovered amount by state or program type.",
  alternates: { canonical: "/cliff" },
  openGraph: {
    title: "Graduate School Funding Gaps by State and Program | Loan Cliff",
    description:
      "Browse funding gap calculations for 1,788 graduate and professional schools across all 50 states.",
    url: "https://loancliff.com/cliff",
    type: "website",
  },
};

const PROGRAM_ORDER = ["md", "jd", "mba", "pharmd", "dds", "do", "dvm", "od", "phd", "ms", "ma", "med"] as const;

export default function CliffIndexPage() {
  const allSchools = Object.values(schools);
  const totalPages = allSchools.reduce((sum, s) => sum + Object.keys(s.programs).length, 0);

  const states = [...new Set(allSchools.map((s) => s.state).filter(Boolean))]
    .sort((a, b) => {
      const na = STATE_NAMES[a] ?? a;
      const nb = STATE_NAMES[b] ?? b;
      return na.localeCompare(nb);
    });

  const programCounts: Record<string, number> = {};
  for (const school of allSchools) {
    for (const prog of Object.keys(school.programs)) {
      programCounts[prog] = (programCounts[prog] ?? 0) + 1;
    }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://loancliff.com" },
      { "@type": "ListItem", position: 2, name: "Browse Schools", item: "https://loancliff.com/cliff" },
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
          <span className="text-[#1b1c1e]">Browse Schools</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[36px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229]">
            Graduate School Funding Gaps
          </h1>
          <p className="text-base text-[#44474d] leading-relaxed max-w-2xl">
            The July 2026 Grad PLUS elimination created funding gaps at{" "}
            <strong className="text-[#1b1c1e]">{allSchools.length.toLocaleString()} schools</strong>{" "}
            across{" "}
            <strong className="text-[#1b1c1e]">{totalPages.toLocaleString()} programs</strong>.
            Browse by program type or find every school in your state.
          </p>
        </div>

        {/* Browse by Program */}
        <section aria-labelledby="by-program-heading" className="flex flex-col gap-5">
          <h2 id="by-program-heading" className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
            Browse by Program Type
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {PROGRAM_ORDER.map((prog) => {
              const p = programs[prog];
              if (!p) return null;
              const count = programCounts[prog] ?? 0;
              if (count === 0) return null;
              const capLabel = p.category === "professional" ? "$50,000/yr cap" : "$20,500/yr cap";
              return (
                <Link
                  key={prog}
                  href={`/?program=${prog}`}
                  className="group bg-white border border-[#c4c6ce] rounded-lg p-4 hover:border-[#001229] transition-colors flex flex-col gap-1.5"
                >
                  <span className="text-base font-bold text-[#1b1c1e] group-hover:text-[#001229] transition-colors">
                    {p.shortLabel}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#74777e]">
                    {count.toLocaleString()} schools
                  </span>
                  <span className="text-[10px] text-[#9ca3af]">{capLabel}</span>
                </Link>
              );
            })}
          </div>
          <p className="text-sm text-[#44474d]">
            Use the <Link href="/" className="text-[#001229] font-semibold hover:underline">calculator</Link> to get your exact gap for any school and program.
          </p>
        </section>

        {/* Browse by State */}
        <section aria-labelledby="by-state-heading" className="flex flex-col gap-5">
          <h2 id="by-state-heading" className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
            Browse by State
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {states.map((state) => {
              const count = allSchools.filter((s) => s.state === state).length;
              const name = STATE_NAMES[state] ?? state;
              return (
                <Link
                  key={state}
                  href={`/cliff/state/${state.toLowerCase()}`}
                  className="group flex items-center justify-between bg-white border border-[#c4c6ce] rounded px-4 py-3 hover:border-[#001229] transition-colors"
                >
                  <span className="text-sm font-semibold text-[#1b1c1e] group-hover:text-[#001229] transition-colors">
                    {name}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#74777e] ml-2 shrink-0">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

      </main>
    </>
  );
}
