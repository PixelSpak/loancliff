import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Methodology",
  description:
    "How Loan Cliff calculates your Grad PLUS funding gap — data sources, cap assumptions, and cost-of-attendance methodology.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <article className="max-w-2xl mx-auto">

        {/* Header */}
        <header className="mb-10 pb-8 border-b border-[#e2e8f0]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#74777e] mb-3">
            Loan Cliff · Methodology
          </p>
          <h1 className="font-serif text-[38px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229] mb-4">
            How We Calculate Your Gap
          </h1>
          <p className="text-base text-[#44474d] leading-relaxed">
            Every number on Loan Cliff traces back to a public data source. This page
            explains exactly where those numbers come from and how the gap is computed.
          </p>
        </header>

        {/* Sections */}
        <div className="flex flex-col gap-10 text-[#1b1c1e]">

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#001229] mb-3">
              The Core Formula
            </h2>
            <p className="text-base leading-relaxed text-[#44474d] mb-4">
              Your funding gap is the difference between what your program costs and
              how much you can borrow under the new federal limits:
            </p>
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-6 font-mono text-sm text-[#001229] leading-loose">
              <div>Total Cost of Attendance (COA)</div>
              <div className="text-[#74777e]">− New Federal Loan Cap</div>
              <div className="border-t border-[#c4c6ce] pt-2 mt-2 font-bold text-[#ba1a1a]">
                = Funding Gap
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#001229] mb-3">
              Data Sources
            </h2>
            <div className="flex flex-col gap-4">
              <div className="border-l-2 border-[#001229] pl-4">
                <h3 className="font-semibold text-[#1b1c1e] mb-1">
                  Cost of Attendance — IPEDS
                </h3>
                <p className="text-sm text-[#44474d] leading-relaxed">
                  Institutional cost-of-attendance figures are sourced from the Integrated
                  Postsecondary Education Data System (IPEDS), published annually by the
                  U.S. Department of Education. We use the most recent available academic
                  year data (2023–24) as the baseline and apply a 4% annual inflation
                  adjustment for future start-year projections.
                </p>
              </div>
              <div className="border-l-2 border-[#001229] pl-4">
                <h3 className="font-semibold text-[#1b1c1e] mb-1">
                  Federal Loan Caps — Big Beautiful Bill (2025)
                </h3>
                <p className="text-sm text-[#44474d] leading-relaxed">
                  The &ldquo;One Big Beautiful Bill&rdquo; signed into law in 2025 eliminates the
                  Grad PLUS loan program effective July 1, 2026, and replaces it with a
                  new Unsubsidized Stafford loan for graduate students with revised annual
                  and aggregate caps by program category. We use the caps as enacted:
                </p>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-[#44474d]">
                  <li className="flex justify-between py-2 border-b border-[#e2e8f0]">
                    <span>Professional programs (MD, JD, MBA, PharmD, DDS, DVM)</span>
                    <span className="font-semibold text-[#1b1c1e] ml-4 shrink-0">$50,000/yr</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-[#e2e8f0]">
                    <span>Research doctoral programs (PhD)</span>
                    <span className="font-semibold text-[#1b1c1e] ml-4 shrink-0">$20,500/yr</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span>Master&apos;s programs (MS, MA, MEd, OD)</span>
                    <span className="font-semibold text-[#1b1c1e] ml-4 shrink-0">$20,500/yr</span>
                  </li>
                </ul>
              </div>
              <div className="border-l-2 border-[#001229] pl-4">
                <h3 className="font-semibold text-[#1b1c1e] mb-1">
                  Program Length
                </h3>
                <p className="text-sm text-[#44474d] leading-relaxed">
                  Standard program lengths are used for total-gap calculation: MD (4 yrs),
                  JD (3 yrs), MBA (2 yrs), PharmD (4 yrs), DDS (4 yrs), DVM (4 yrs),
                  PhD (5 yrs), MS/MA/MEd/OD (2 yrs). These reflect the median completion
                  time reported in IPEDS graduation rate data.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#001229] mb-3">
              School Coverage
            </h2>
            <p className="text-base leading-relaxed text-[#44474d]">
              Loan Cliff covers 1,788 Title IV-eligible institutions that report graduate
              enrollment to IPEDS. Each school is matched to the programs it offers based
              on its CIP code submissions. Schools that offer a program but did not report
              graduate COA separately are excluded from that program&apos;s calculation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#001229] mb-3">
              Limitations
            </h2>
            <ul className="flex flex-col gap-3 text-sm text-[#44474d] leading-relaxed list-none">
              {[
                "COA figures are institutional averages and will vary by individual living situation, residency, and enrollment status.",
                "Scholarship, fellowship, and institutional grant aid are not factored in. Many students will receive aid that reduces their personal gap.",
                "Interest accrual, origination fees, and income-driven repayment impacts are not modeled in this calculator.",
                "Future legislative changes may alter the federal loan caps shown here. Figures reflect the law as enacted.",
                "We are not a financial aid office. These numbers should be used as a planning estimate, not a financial commitment.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#c4c6ce] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold text-[#001229] mb-3">
              Update Schedule
            </h2>
            <p className="text-base leading-relaxed text-[#44474d]">
              COA data is refreshed each fall when IPEDS releases the prior-year survey
              results. Federal cap figures are updated immediately upon legislative
              changes. The current dataset reflects IPEDS 2023–24 and loan limits as
              of July 2026.
            </p>
          </section>

          {/* Citation */}
          <div className="mt-2 pt-6 border-t border-[#e2e8f0]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
              Sources: National Center for Education Statistics (NCES) IPEDS Data Center ·
              U.S. Department of Education Federal Student Aid ·
              One Big Beautiful Bill (Pub. L. 119-__) § 2001 et seq.
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
