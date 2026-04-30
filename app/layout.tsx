import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Loan Cliff — Your Grad PLUS Funding Gap Calculator",
    template: "%s | Loan Cliff",
  },
  description:
    "The July 2026 elimination of Grad PLUS loans created five- to six-figure funding gaps for med, law, MBA, and other grad students. Calculate your personal gap in three inputs.",
  metadataBase: new URL("https://loancliff.com"),
  openGraph: {
    siteName: "Loan Cliff",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

const siteSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://loancliff.com/#website",
      url: "https://loancliff.com",
      name: "Loan Cliff",
      description:
        "Personal Grad PLUS funding gap calculator — see your exact uncovered amount in three inputs.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://loancliff.com/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://loancliff.com/#organization",
      name: "Loan Cliff",
      url: "https://loancliff.com",
      logo: {
        "@type": "ImageObject",
        url: "https://loancliff.com/og-default.png",
      },
      sameAs: [],
    },
  ],
};

const NAV_LINKS = ["Calculators", "Analysis", "Resources", "Support"];
const FOOTER_LINKS = [
  "Methodology",
  "Privacy Policy",
  "Terms of Service",
  "Disclaimer",
  "Affiliate Disclosure",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf9fc] text-[#1b1c1e]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />

        {/* ── Header ── */}
        <header className="bg-white border-b border-[#e2e8f0] fixed top-0 w-full z-50 h-16">
          <div className="max-w-5xl mx-auto px-8 h-full flex items-center justify-between">
            {/* Wordmark */}
            <Link
              href="/"
              className="font-serif text-lg font-semibold text-[#001229] uppercase tracking-[0.15em] hover:opacity-75 transition-opacity"
            >
              Loan Cliff
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((label, i) => (
                i === 0 ? (
                  <Link
                    key={label}
                    href="/"
                    className="text-sm text-[#001229] border-b-2 border-[#001229] pb-0.5 font-medium"
                  >
                    {label}
                  </Link>
                ) : (
                  <span
                    key={label}
                    className="text-sm text-[#9ca3af] cursor-default select-none"
                  >
                    {label}
                  </span>
                )
              ))}
            </nav>

            {/* Log In */}
            <button className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#001229] hover:opacity-70 transition-opacity">
              Log In
            </button>
          </div>
        </header>

        {/* ── Page content ── */}
        {children}

        {/* ── Footer ── */}
        <footer className="mt-auto border-t border-[#e2e8f0] bg-[#f8fafc] py-12 px-8">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-5">
            <span className="font-serif text-base font-semibold text-[#1b1c1e]">
              Loan Cliff
            </span>
            <nav className="flex flex-wrap justify-center gap-6">
              {FOOTER_LINKS.map((label) => (
                <a
                  key={label}
                  href="#"
                  className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b7280] hover:text-[#1b1c1e] transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
              © 2026 Loan Cliff Financial Research. All rights reserved.
              Data sources: Department of Education, IPEDS.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
