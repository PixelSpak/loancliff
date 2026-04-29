import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { computeGap } from "@/lib/calc";
import { caps, programs, schools } from "@/lib/data";
import { affiliateList } from "@/lib/affiliates";
import { buildSchemaGraph } from "@/lib/schema";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { school, program } = await params;
  const result = await getResult(school, program);

  if (result.kind !== "ok") return { title: "Program not found — Loan Cliff" };

  // Title ≤60 chars: "[ShortSchool] [ShortLabel] Funding Gap: $X | Loan Cliff"
  const titleBase = `${result.schoolShortName} ${result.programShortLabel} Funding Gap: ${fmt(result.totalGap)}`;
  const title = `${titleBase} | Loan Cliff`;
  // Description 120–160 chars
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

  // Other programs offered at this school (for internal linking)
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

      <main className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-zinc-800 dark:hover:text-zinc-200">
            Loan Cliff
          </Link>
          <span className="mx-2" aria-hidden="true">›</span>
          <span>{result.schoolName}</span>
          <span className="mx-2" aria-hidden="true">›</span>
          <span>{result.programLabel}</span>
        </nav>

        {/* Hero: gap number */}
        <header className="mb-10">
          <p className="text-sm font-medium text-red-600 uppercase tracking-wide mb-2">
            Grad PLUS funding gap · effective July 1, 2026
          </p>
          <h1 className="text-2xl font-bold mb-1">
            {result.programLabel} at {result.schoolName}
          </h1>
          <p className="text-6xl font-extrabold text-red-600 mt-4 leading-none tabular-nums">
            {fmt(result.totalGap)}
          </p>
          <p className="text-base text-zinc-500 dark:text-zinc-400 mt-3">
            Over {result.lengthYears} years ·{" "}
            <strong className="text-zinc-700 dark:text-zinc-200">{fmt(result.gapPerYear)}/year</strong>{" "}
            uncovered · ~{fmt(result.monthlyEquivalent)}/month equivalent
          </p>
        </header>

        {/* Breakdown */}
        <section
          aria-label="Gap calculation breakdown"
          className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-5 mb-10 text-sm"
        >
          <h2 className="font-semibold text-base mb-4">How this number is calculated</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                Published cost of attendance (IPEDS {result.citation.ipedsYear})
              </span>
              <span className="font-medium tabular-nums">{fmt(result.coaPerYear)}/yr</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-600 dark:text-zinc-400">
                New federal loan cap — {result.category} programs (effective Jul 2026)
              </span>
              <span className="font-medium tabular-nums text-green-700 dark:text-green-400">
                −{fmt(result.capPerYear)}/yr
              </span>
            </div>
            <div className="flex justify-between border-t pt-3 font-semibold">
              <span>Annual funding gap</span>
              <span className="text-red-600 tabular-nums">{fmt(result.gapPerYear)}/yr</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-500 pt-1">
              <span>
                × {result.lengthYears} years, aggregate cap {fmt(aggregateCap)}
              </span>
              <span className="font-bold text-red-600 text-sm tabular-nums">
                {fmt(result.totalGap)} total
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-4 border-t pt-3">
            Source: IPEDS {result.citation.ipedsYear} Cost of Attendance ·{" "}
            {result.citation.statute}
          </p>
        </section>

        {/* Affiliate CTAs */}
        <section aria-label="Private lender options" className="mb-12">
          <h2 className="font-semibold text-base mb-1">Cover the gap — compare private lenders</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Federal aid no longer covers {fmt(result.gapPerYear)}/yr for{" "}
            {result.category} programs. Private student loans are the primary bridge for most students.
          </p>
          <div className="space-y-3">
            {affiliateList.map((aff) => (
              <a
                key={aff.name}
                href={aff.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center justify-between border-l-4 border-l-red-200 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div>
                  <span className="font-medium text-sm">{aff.name}</span>
                  <p className="text-xs text-zinc-500 mt-0.5">{aff.description}</p>
                </div>
                <span className="text-sm font-semibold text-red-600 shrink-0 ml-4 whitespace-nowrap">
                  {aff.cta}
                </span>
              </a>
            ))}
          </div>
          <p className="text-xs text-zinc-400 mt-3">
            Loan Cliff may earn a commission if you refinance through these links. This does not
            affect our data or calculations. Rates and eligibility vary by lender and borrower.
          </p>
        </section>

        {/* FAQ */}
        <section aria-label="Frequently asked questions" className="mb-12 space-y-6">
          <h2 className="font-semibold text-base">Frequently asked questions</h2>

          <div>
            <h3 className="font-medium mb-1">What is the Grad PLUS funding cliff?</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The Reconciliation Act of 2025 eliminates Grad PLUS loans on July 1, 2026 and
              replaces them with statutory caps: $20,500/year (aggregate $100,000) for graduate
              programs and $50,000/year (aggregate $200,000) for professional programs. Students who
              previously relied on Grad PLUS to cover the full cost of attendance now face an
              uncovered gap that no federal program fills.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">
              How was the {fmt(result.totalGap)} figure calculated for {result.programLabel} at{" "}
              {result.schoolName}?
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {result.schoolName}'s published Cost of Attendance for the {result.programLabel}{" "}
              program is {fmt(result.coaPerYear)} per year (IPEDS {result.citation.ipedsYear}). The
              new statutory cap for {result.category} programs is {fmt(result.capPerYear)} per year.
              The annual uncovered gap is {fmt(result.gapPerYear)}. Over the standard{" "}
              {result.lengthYears}-year program length, the total uncovered amount is{" "}
              {fmt(result.totalGap)} — capped at the aggregate limit of {fmt(aggregateCap)}.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">
              Is a {result.category === "professional" ? "professional" : "graduate"} program like{" "}
              {result.programShortLabel} classified as graduate or professional for cap purposes?
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {result.programLabel} is classified as a{" "}
              <strong>{result.category} program</strong> under the Reconciliation Act of 2025.{" "}
              {result.category === "professional"
                ? `Professional programs (MD, JD, DDS, PharmD, DVM, DO, OD) carry a higher cap of $50,000/year and a $200,000 aggregate — but that still leaves students at schools with full COA above $50,000 with a significant annual gap.`
                : `Graduate programs (MBA, MS, MA, MEd, PhD) carry the lower cap of $20,500/year and a $100,000 aggregate — the same limit that has applied to unsubsidized loans for years.`}
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">What options exist to cover the {fmt(result.gapPerYear)}/year gap?</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              The most common options are private student loans (multiple lenders are actively
              targeting this gap with competitive rates), institutional scholarships and fellowships,
              graduate research or teaching assistantships, income-share agreements, and in some
              cases deferring enrollment by one year to build personal savings. Comparing private
              lenders before committing is the single highest-leverage step.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-1">When does the change take effect?</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              July 1, 2026. Loans first disbursed on or after that date are subject to the new caps.
              Students already enrolled before July 1, 2026 may still be affected for disbursements
              in academic years 2026–27 and beyond.
            </p>
          </div>
        </section>

        {/* Other programs at this school — internal linking + unique content */}
        {otherPrograms.length > 0 && (
          <section aria-label="Other programs at this school" className="mb-12">
            <h2 className="font-semibold text-base mb-3">
              Other programs at {result.schoolName}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherPrograms.map((prog) => {
                const p = programs[prog as ProgramType];
                return (
                  <Link
                    key={prog}
                    href={`/cliff/${school}/${prog}`}
                    className="text-sm border rounded px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    {p.shortLabel}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Back to calculator */}
        <div className="border-t pt-6 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Calculate the gap for a different school or program
          </Link>
        </div>
      </main>
    </>
  );
}
