import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Loan Cliff privacy policy — what we collect, how we use it, and your rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 px-6">
      <article className="max-w-2xl mx-auto">
        <header className="mb-10 pb-8 border-b border-[#e2e8f0]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#74777e] mb-3">
            Loan Cliff · Legal
          </p>
          <h1 className="font-serif text-[38px] leading-[1.1] tracking-[-0.02em] font-semibold text-[#001229] mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#74777e]">Effective date: May 1, 2026</p>
        </header>

        <div className="flex flex-col gap-8 text-[#44474d] text-base leading-relaxed">

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">Overview</h2>
            <p>
              Loan Cliff (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates
              loancliff.com, a free calculator tool that helps graduate students estimate the
              funding gap created by the elimination of Grad PLUS loans. We are committed to
              protecting your privacy. This policy explains what data we collect, how we use it,
              and your rights regarding that data.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              What We Collect
            </h2>
            <p className="mb-3">
              <strong className="text-[#1b1c1e]">We do not create accounts or store personal information.</strong>{" "}
              You can use the calculator anonymously without providing any identifying information.
            </p>
            <p className="mb-3">We may collect the following through standard server logs and analytics:</p>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "Anonymous usage data: pages visited, calculator inputs (school, program type, year), time on site.",
                "Technical data: browser type, operating system, screen resolution, referring URL.",
                "IP addresses: collected in standard server logs and used only for abuse prevention and geographic analytics (country-level). Not linked to any individual.",
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
              Cookies and Analytics
            </h2>
            <p className="mb-3">
              We use standard analytics tools (e.g., Plausible Analytics or Vercel Analytics)
              to understand how visitors use the site. These tools may use cookies or local
              storage. We do not use advertising cookies or cross-site tracking.
            </p>
            <p>
              You can opt out of analytics tracking by enabling &ldquo;Do Not Track&rdquo; in
              your browser or by using a content blocker. The calculator functions fully
              without cookies.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Affiliate Links
            </h2>
            <p>
              When you click on a lender link (Credible, ELFI, LendKey, SoFi, Earnest, etc.),
              you leave Loan Cliff and visit that lender&apos;s site. Those sites have their own
              privacy policies and data collection practices. We receive a commission if you
              complete an application through those links. See our{" "}
              <a href="/affiliate-disclosure" className="text-[#001229] underline hover:opacity-70">
                Affiliate Disclosure
              </a>{" "}
              for details.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              How We Use Data
            </h2>
            <ul className="flex flex-col gap-2 pl-4">
              {[
                "To improve calculator accuracy and user experience.",
                "To understand which schools and programs are most frequently searched.",
                "To detect and prevent abuse, spam, or automated scraping.",
                "To comply with legal obligations.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#c4c6ce] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              We do not sell, rent, or share your data with third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Data Retention
            </h2>
            <p>
              Server logs are retained for up to 90 days. Aggregate analytics data (without
              any individual identifiers) may be retained indefinitely for trend analysis.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Your Rights
            </h2>
            <p className="mb-3">
              Because we do not collect personally identifiable information, most data
              subject rights (access, deletion, portability) do not apply to typical usage.
              If you believe we have collected information that identifies you, contact us
              and we will investigate and respond within 30 days.
            </p>
            <p>
              California residents (CCPA) and EU/UK residents (GDPR) may contact us at{" "}
              <a href="mailto:hello@loancliff.com" className="text-[#001229] underline hover:opacity-70">
                hello@loancliff.com
              </a>{" "}
              with any privacy-related requests.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Children
            </h2>
            <p>
              Loan Cliff is designed for graduate students and is not directed at children
              under 13. We do not knowingly collect data from children under 13.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">
              Changes to This Policy
            </h2>
            <p>
              We may update this policy from time to time. Material changes will be noted
              by updating the effective date above. Continued use of the site after changes
              constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#001229] mb-3">Contact</h2>
            <p>
              Questions about this privacy policy:{" "}
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
