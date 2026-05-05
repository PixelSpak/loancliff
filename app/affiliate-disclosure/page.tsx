import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "How Loan Cliff earns revenue through affiliate partnerships with student loan lenders.",
};

const LENDERS = [
  { name: "Credible",  description: "Multi-lender marketplace for private student loans and refinancing." },
  { name: "ELFI",     description: "Education Loan Finance — private student and refinance loans." },
  { name: "LendKey",  description: "Credit union and community bank student lending network." },
  { name: "SoFi",     description: "Private student loans, refinancing, and personal finance products." },
  { name: "Earnest",  description: "Student loan refinancing and private student loans." },
];

export default function AffiliateDisclosurePage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <article className="max-w-2xl mx-auto">
        <header className="mb-10 pb-8 border-b border-[#e2e8f0]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#74777e] mb-3">
            Loan Cliff · Legal
          </p>
          <h1 className="font-serif text-[38px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229] mb-4">
            Affiliate Disclosure
          </h1>
          <p className="text-sm text-[#74777e]">Last updated: May 1, 2026</p>
        </header>

        <div className="flex flex-col gap-8 text-[#44474d] text-base leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              FTC Disclosure
            </h2>
            <p>
              Spak Labs participates in affiliate marketing programs through LoanCliff.
              This means that when you click certain links on this Site and complete an
              application or transaction with a lender, we may receive a commission or
              referral fee from that lender. This is how we fund the free calculator and
              keep it available to all users at no cost.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Our Affiliate Partners
            </h2>
            <p className="mb-4">
              We currently have affiliate relationships with the following lenders, which
              appear in the &ldquo;Bridge the Gap&rdquo; section of your calculator results:
            </p>
            <div className="flex flex-col gap-3">
              {LENDERS.map((l) => (
                <div key={l.name} className="flex gap-4 p-4 border border-[#e2e8f0] rounded-lg">
                  <div className="w-10 h-10 bg-[#001229] text-white flex items-center justify-center rounded font-bold text-sm shrink-0">
                    {l.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1b1c1e]">{l.name}</p>
                    <p className="text-sm text-[#74777e]">{l.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Our Editorial Standards
            </h2>
            <p className="mb-3">
              Affiliate compensation does not influence our calculator results, our
              methodology, or the order in which lenders are displayed. We do not accept
              payment for favorable placement in our results. Lenders appear because they
              are relevant to graduate student financing, not because of the size of any
              commission arrangement.
            </p>
            <p>
              We strive to provide accurate, unbiased information regardless of our
              commercial relationships. Our gap calculations are derived entirely from
              independent public data sources. See our{" "}
              <a href="/methodology" className="text-[#001229] underline hover:opacity-70">
                Methodology
              </a>{" "}
              for details.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              No Endorsement or Guarantee
            </h2>
            <p>
              The presence of a lender on Loan Cliff does not constitute an endorsement
              of that lender&apos;s products or services. Loan rates, terms, eligibility
              requirements, and availability vary by lender and borrower. You should
              compare multiple options and read all terms carefully before applying.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              How Commission Works
            </h2>
            <p>
              When you click an affiliate link and submit an application or fund a loan,
              the referring lender pays us a commission. The commission is paid by the
              lender — not by you — and does not affect your loan rate or terms. You are
              not charged any additional fee for using our referral links.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Compliance
            </h2>
            <p>
              This disclosure is provided in accordance with the Federal Trade Commission&apos;s
              guidelines on endorsements and testimonials (16 C.F.R. Part 255) and applicable
              state disclosure requirements. We are committed to transparent disclosure of our
              commercial relationships.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">Contact</h2>
            <p className="mb-3">
              Questions about our affiliate relationships:{" "}
              <a href="mailto:hello@loancliff.com" className="text-[#001229] underline hover:opacity-70">
                hello@loancliff.com
              </a>
            </p>
            <p>
              LoanCliff is operated by Spak Labs
              <br />
              353 Lexington Avenue, 4th Floor PMB505
              <br />
              New York, NY 10016
              <br />
              United States
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
