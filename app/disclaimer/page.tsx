import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Important disclaimers about Loan Cliff's calculator — estimates, not guarantees.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <article className="max-w-2xl mx-auto">
        <header className="mb-10 pb-8 border-b border-[#e2e8f0]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#74777e] mb-3">
            Loan Cliff · Legal
          </p>
          <h1 className="font-serif text-[38px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229] mb-4">
            Disclaimer
          </h1>
          <p className="text-sm text-[#74777e]">Last updated: May 1, 2026</p>
        </header>

        <div className="flex flex-col gap-8 text-[#44474d] text-base leading-relaxed">

          {/* Callout */}
          <div className="bg-[#ffdad6]/30 border border-[#ba1a1a]/20 rounded-lg p-5">
            <p className="text-sm text-[#1b1c1e] font-medium">
              Loan Cliff provides estimates for planning purposes only. Calculator
              results are not a guarantee of the aid you will receive or the costs you
              will incur. Always verify figures with your school&apos;s financial aid office.
            </p>
          </div>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Estimates, Not Guarantees
            </h2>
            <p>
              The funding gap figures displayed by Loan Cliff are mathematical estimates
              derived from publicly available cost-of-attendance data and the federal loan
              caps established by the One Big Beautiful Bill (2025). They represent a
              simplified model of a complex financial situation. Your actual costs, aid,
              and loan eligibility will depend on many individual factors not captured by
              this calculator.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              What Is Not Included
            </h2>
            <p className="mb-3">
              The calculator does not account for the following, which may materially
              reduce or change your actual gap:
            </p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Merit scholarships, need-based grants, and institutional fellowships.",
                "Employer tuition assistance or military education benefits.",
                "State grant programs or external scholarship awards.",
                "Teaching or research assistantship stipends.",
                "Loan origination fees and interest accrual.",
                "Income-driven repayment plan eligibility.",
                "Future changes to federal loan policy beyond what is currently enacted.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#c4c6ce] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Not Financial or Legal Advice
            </h2>
            <p>
              Nothing on Loan Cliff constitutes financial, legal, tax, or investment advice.
              We are not a licensed financial advisor, lender, broker, or financial aid
              counselor. The information provided is for general educational and informational
              purposes only.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Data Accuracy
            </h2>
            <p>
              We make reasonable efforts to keep cost-of-attendance data and loan cap
              information current and accurate. However, data may contain errors or may not
              reflect the most recent institutional changes. Loan Cliff Financial Research
              makes no representation or warranty regarding the accuracy, completeness, or
              timeliness of any information on the Site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Legislative Risk
            </h2>
            <p>
              Federal student loan policy is subject to change by Congress or the Department
              of Education. The loan caps reflected in this calculator are based on current
              enacted law. Future legislative or regulatory changes could increase, decrease,
              or eliminate these caps. Loan Cliff is not responsible for decisions made based
              on assumptions about future policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">Contact</h2>
            <p>
              Questions about this disclaimer:{" "}
              <a href="mailto:hello@loancliff.com" className="text-[#001229] underline hover:opacity-70">
                hello@loancliff.com
              </a>
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
