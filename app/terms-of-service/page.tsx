import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Loan Cliff terms of service — conditions for using this calculator tool.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <article className="max-w-2xl mx-auto">
        <header className="mb-10 pb-8 border-b border-[#e2e8f0]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#74777e] mb-3">
            Loan Cliff · Legal
          </p>
          <h1 className="font-serif text-[38px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229] mb-4">
            Terms of Service
          </h1>
          <p className="text-sm text-[#74777e]">Effective date: May 1, 2026</p>
        </header>

        <div className="flex flex-col gap-8 text-[#44474d] text-base leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">Acceptance</h2>
            <p>
              By accessing or using loancliff.com (the &ldquo;Site&rdquo;), you agree to be
              bound by these Terms of Service. If you do not agree, do not use the Site.
              These terms apply to all visitors, users, and others who access the Site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Description of Service
            </h2>
            <p>
              Loan Cliff provides a free online calculator that estimates the funding gap
              created by changes to federal graduate student loan programs effective July 2026.
              The Site is an informational and educational tool only. It does not constitute
              financial, legal, or tax advice.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              No Financial Advice
            </h2>
            <p className="mb-3">
              <strong className="text-[#1b1c1e]">
                Loan Cliff is not a financial advisor, broker, or lender.
              </strong>{" "}
              Calculator results are estimates based on publicly available data and simplified
              assumptions. They may not reflect your actual financial situation, available
              aid, scholarship awards, or future legislative changes.
            </p>
            <p>
              Before making any financial decisions regarding graduate school financing, you
              should consult your school&apos;s financial aid office, a licensed financial
              advisor, and review official government resources at StudentAid.gov.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Third-Party Links
            </h2>
            <p>
              The Site contains links to third-party lender websites. These links are provided
              for convenience only. We do not endorse, control, or guarantee the products,
              services, or information provided by linked sites. Your use of third-party sites
              is at your own risk and subject to their own terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Intellectual Property
            </h2>
            <p>
              All content on the Site — including text, design, data compilations, and
              calculation logic — is the property of Loan Cliff Financial Research or its
              licensors and is protected by copyright and other intellectual property laws.
              You may not reproduce, distribute, or create derivative works without prior
              written permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Permitted Use
            </h2>
            <p className="mb-3">You may use the Site for personal, non-commercial purposes. You agree not to:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Scrape or systematically download Site content via automated means.",
                "Reproduce calculator results for commercial purposes without permission.",
                "Interfere with the Site's operation, security, or server infrastructure.",
                "Use the Site in any way that violates applicable law.",
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
              Disclaimer of Warranties
            </h2>
            <p>
              THE SITE AND ITS CONTENT ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF
              ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS
              FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT
              CALCULATOR RESULTS ARE ACCURATE, COMPLETE, OR CURRENT.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Limitation of Liability
            </h2>
            <p>
              TO THE FULLEST EXTENT PERMITTED BY LAW, LOAN CLIFF FINANCIAL RESEARCH SHALL
              NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
              DAMAGES ARISING FROM YOUR USE OF, OR INABILITY TO USE, THE SITE OR ITS CONTENT,
              EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL OUR
              AGGREGATE LIABILITY EXCEED $100 USD.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by the laws of the State of Delaware, without
              regard to its conflict of law provisions. Any disputes shall be resolved in
              the state or federal courts located in Delaware.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Continued use of the
              Site after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">Contact</h2>
            <p>
              Questions:{" "}
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
