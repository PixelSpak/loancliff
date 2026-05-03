import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { computeGap } from "@/lib/calc";
import { caps, programs, schools } from "@/lib/data";
import { affiliateList } from "@/lib/affiliates";
import { buildSchemaGraph } from "@/lib/schema";
import { EmailCapture } from "@/components/EmailCapture";
import { GapPageAnalytics } from "@/components/GapPageAnalytics";
import { TrackedAffiliateLink } from "@/components/TrackedAffiliateLink";
import type { ProgramType } from "@/lib/types";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(schools).flatMap((school) =>
    Object.keys(school.programs).map((prog) => ({
      school: school.id,
      program: prog,
    }))
  );
}

interface Props {
  params: Promise<{ school: string; program: string }>;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

async function getResult(school: string, program: string) {
  return computeGap(
    { schoolId: school, programType: program as ProgramType, startYear: 2026 },
    schools,
    programs,
    caps
  );
}

const AFFILIATE_DISPLAY: Record<string, { letter: string; bg: string; color: string }> = {
  Credible:  { letter: "C", bg: "#0f2744", color: "#ffffff" },
  ELFI:      { letter: "E", bg: "#14532d", color: "#ffffff" },
  LendKey:   { letter: "L", bg: "#374151", color: "#ffffff" },
  SoFi:      { letter: "S", bg: "#ff632c", color: "#ffffff" },
  Earnest:   { letter: "E", bg: "#3b2000", color: "#b0855a" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { school, program } = await params;
  const result = await getResult(school, program);

  if (result.kind !== "ok") return { title: "Program not found — Loan Cliff" };

  const titleBase = `${result.schoolShortName} ${result.programShortLabel} Funding Gap: ${fmt(result.totalGap)}`;
  const title = `${titleBase} | Loan Cliff`;
  const description = `${result.schoolShortName} ${result.programShortLabel} students face a ${fmt(result.totalGap)} total funding gap starting July 2026. COA ${fmt(result.coaPerYear)}/yr vs. ${fmt(result.capPerYear)}/yr new federal cap. Compare private lenders.`;

  return {
    title,
    description,
    alternates: { canonical: `/cliff/${school}/${program}` },
    openGraph: {
      title,
      description,
      url: `https://loancliff.com/cliff/${school}/${program}`,
      siteName: "Loan Cliff",
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProgramPage({ params }: Props) {
  const { school, program } = await params;
  const result = await getResult(school, program);

  if (result.kind !== "ok") notFound();

  const pageUrl = `https://loancliff.com/cliff/${school}/${program}`;
  const schema = buildSchemaGraph(result, school, program, pageUrl);

  const otherPrograms = Object.keys(schools[school]?.programs ?? {}).filter(
    (p) => p !== program
  );

  const aggregateCap = result.category === "professional" ? 200_000 : 100_000;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <GapPageAnalytics
        schoolId={school}
        schoolName={result.schoolName}
        programType={program}
        programLabel={result.programLabel}
        category={result.category}
        startYear={2026}
        gapPerYear={result.gapPerYear}
        totalGap={result.totalGap}
        monthlyEquivalent={result.monthlyEquivalent}
      />

      <main className="w-full max-w-5xl mx-auto pt-28 pb-24 px-6 sm:px-8 flex flex-col gap-8">

        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#74777e] flex items-center gap-2">
          <Link href="/" className="hover:text-[#001229] transition-colors">Loan Cliff</Link>
          <span aria-hidden="true">›</span>
          <span className="text-[#44474d]">{result.schoolShortName}</span>
          <span aria-hidden="true">›</span>
          <span className="text-[#1b1c1e]">{result.programShortLabel}</span>
        </nav>

        {/* ── Hero header ── */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="inline-flex items-center gap-2 bg-[#e9e7ea] border border-[#c4c6ce] rounded px-3 py-1">
            <svg className="w-3.5 h-3.5 text-[#44474d] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#44474d]">
              Verified Calculation
            </span>
          </div>
          <h1 className="font-serif text-[40px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229]">
            Your Estimated Uncovered Cost
          </h1>
          <p className="text-base text-[#44474d] leading-relaxed max-w-xl">
            Based on {result.programLabel} at {result.schoolName} and the projected 2026 federal loan
            limits, you will face a significant funding shortfall. Below is a detailed breakdown.
          </p>
        </div>

        {/* ── Gap number card ── */}
        <div className="bg-white border border-[#c4c6ce] rounded-lg p-10 flex flex-col items-center shadow-[0_12px_24px_rgba(0,0,0,0.04)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#44474d] mb-3">
            Total Funding Gap
          </p>
          <p className="font-serif text-[64px] leading-none font-semibold text-[#ba1a1a] tabular-nums">
            {fmt(result.totalGap)}
          </p>
          <p className="text-sm text-[#44474d] mt-4">
            Over {result.lengthYears} years ·{" "}
            <strong className="text-[#1b1c1e]">{fmt(result.gapPerYear)}/year</strong>{" "}
            uncovered · ~{fmt(result.monthlyEquivalent)}/month
          </p>
        </div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Breakdown */}
          <section
            aria-label="Gap calculation breakdown"
            className="lg:col-span-7 bg-white border border-[#c4c6ce] rounded-lg p-8 shadow-[0_12px_24px_rgba(0,0,0,0.04)] flex flex-col gap-5"
          >
            <h2 className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
              Cost &amp; Funding Breakdown
            </h2>
            <div className="flex flex-col text-base">
              <div className="flex justify-between items-center py-3 border-b border-[#c4c6ce]/30">
                <span className="text-[#44474d]">
                  Cost of Attendance (IPEDS {result.citation.ipedsYear})
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
                  New Federal Cap — {result.category} programs
                </div>
                <span className="font-serif text-xl font-semibold text-[#1b1c1e] tabular-nums">
                  {fmt(result.capPerYear)}/yr
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[#c4c6ce]/30 text-sm text-[#74777e]">
                <span>× {result.lengthYears} years, aggregate cap {fmt(aggregateCap)}</span>
                <span className="font-bold text-[#ba1a1a] text-base tabular-nums">{fmt(result.totalGap)}</span>
              </div>
              <div className="flex justify-between items-center py-3 mt-1 bg-[#ffdad6]/20 px-3 rounded">
                <span className="text-lg font-bold text-[#ba1a1a]">Funding Gap</span>
                <span className="font-serif text-[28px] leading-none font-semibold text-[#ba1a1a] tabular-nums">
                  ={fmt(result.totalGap)}
                </span>
              </div>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#74777e] flex items-center gap-1.5 mt-auto pt-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Source: IPEDS {result.citation.ipedsYear} · {result.citation.statute}
            </p>
          </section>

          {/* Bridge the gap */}
          <section
            aria-label="Private lender options"
            className="lg:col-span-5 bg-white border border-[#c4c6ce] rounded-lg p-8 shadow-[0_12px_24px_rgba(0,0,0,0.04)] flex flex-col gap-5"
          >
            <h2 className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
              Bridge the Gap
            </h2>
            <p className="text-sm text-[#44474d] leading-relaxed">
              Federal aid no longer covers {fmt(result.gapPerYear)}/yr for{" "}
              {result.category} programs. Compare private lenders.
            </p>
            <div className="flex flex-col gap-3">
              {affiliateList.map((aff) => {
                const d = AFFILIATE_DISPLAY[aff.name] ?? { letter: aff.name[0], bg: "#374151", color: "#fff" };
                return (
                  <TrackedAffiliateLink
                    key={aff.name}
                    href={aff.url}
                    affiliateName={aff.name}
                    schoolId={school}
                    programType={program}
                    totalGap={result.totalGap}
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
                  </TrackedAffiliateLink>
                );
              })}
            </div>
            <p className="text-[10px] text-[#9ca3af] mt-auto pt-2 leading-relaxed">
              Loan Cliff may earn a commission if you refinance through these links.
              This does not affect our data or calculations.
            </p>
            <EmailCapture
              schoolId={school}
              programType={program as ProgramType}
              totalGap={result.totalGap}
            />
          </section>
        </div>

        {/* ── FAQ ── */}
        <section aria-label="Frequently asked questions" className="flex flex-col gap-6 pt-4">
          <h2 className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
            Frequently Asked Questions
          </h2>

          {[
            {
              q: "What is the Grad PLUS funding cliff?",
              a: `The Reconciliation Act of 2025 eliminates Grad PLUS loans on July 1, 2026 and replaces them with statutory caps: $20,500/year (aggregate $100,000) for graduate programs and $50,000/year (aggregate $200,000) for professional programs. Students who previously relied on Grad PLUS to cover the full cost of attendance now face an uncovered gap that no federal program fills.`,
            },
            {
              q: `How was the ${fmt(result.totalGap)} figure calculated?`,
              a: `${result.schoolName}'s published Cost of Attendance for the ${result.programLabel} program is ${fmt(result.coaPerYear)} per year (IPEDS ${result.citation.ipedsYear}). The new statutory cap for ${result.category} programs is ${fmt(result.capPerYear)} per year. The annual uncovered gap is ${fmt(result.gapPerYear)}. Over the standard ${result.lengthYears}-year program length, the total uncovered amount is ${fmt(result.totalGap)} — capped at the aggregate limit of ${fmt(aggregateCap)}.`,
            },
            {
              q: `Is ${result.programShortLabel} classified as graduate or professional?`,
              a: `${result.programLabel} is classified as a ${result.category} program under the Reconciliation Act of 2025. ${result.category === "professional" ? `Professional programs (MD, JD, DDS, PharmD, DVM, DO, OD) carry a higher cap of $50,000/year and a $200,000 aggregate — but that still leaves students at schools with full COA above $50,000 with a significant annual gap.` : `Graduate programs (MBA, MS, MA, MEd, PhD) carry the lower cap of $20,500/year and a $100,000 aggregate — the same limit that has applied to unsubsidized loans for years.`}`,
            },
            {
              q: `What options exist to cover the ${fmt(result.gapPerYear)}/year gap?`,
              a: "The most common options are private student loans (multiple lenders are actively targeting this gap with competitive rates), institutional scholarships and fellowships, graduate research or teaching assistantships, income-share agreements, and in some cases deferring enrollment by one year to build personal savings.",
            },
            {
              q: "When does the change take effect?",
              a: "July 1, 2026. Loans first disbursed on or after that date are subject to the new caps. Students already enrolled before July 1, 2026 may still be affected for disbursements in academic years 2026–27 and beyond.",
            },
          ].map(({ q, a }) => (
            <div key={q}>
              <h3 className="text-base font-bold text-[#1b1c1e] mb-1.5">{q}</h3>
              <p className="text-sm text-[#44474d] leading-relaxed">{a}</p>
            </div>
          ))}
        </section>

        {/* ── Other programs ── */}
        {otherPrograms.length > 0 && (
          <section aria-label="Other programs at this school" className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-[#1b1c1e] border-b border-[#c4c6ce]/40 pb-3">
              Other Programs at {result.schoolShortName}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherPrograms.map((prog) => {
                const p = programs[prog as ProgramType];
                return (
                  <Link
                    key={prog}
                    href={`/cliff/${school}/${prog}`}
                    className="text-sm border border-[#c4c6ce] rounded px-3 py-1.5 text-[#44474d] hover:border-[#001229] hover:text-[#001229] transition-colors"
                  >
                    {p.shortLabel}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Back link ── */}
        <div className="border-t border-[#e2e8f0] pt-6">
          <Link
            href="/"
            className="text-sm text-[#001229] font-medium hover:opacity-70 transition-opacity"
          >
            ← Calculate the gap for a different school or program
          </Link>
        </div>
      </main>
    </>
  );
}
