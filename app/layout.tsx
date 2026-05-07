import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { CookieConsentWrapper } from "@/components/CookieConsentWrapper";
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
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
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
    },
    {
      "@type": "Organization",
      "@id": "https://loancliff.com/#organization",
      name: "LoanCliff",
      legalName: "Spak Labs",
      url: "https://loancliff.com",
      logo: {
        "@type": "ImageObject",
        url: "https://loancliff.com/og-default.png",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "353 Lexington Avenue, 4th Floor PMB505",
        addressLocality: "New York",
        addressRegion: "NY",
        postalCode: "10016",
        addressCountry: "US",
      },
      sameAs: [
        "https://x.com/loancliffcalc",
        "https://www.instagram.com/loancliffcalc/",
      ],
    },
  ],
};

const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Browse Schools",     href: "/cliff" },
  { label: "Learn",              href: "/learn" },
  { label: "Methodology",        href: "/methodology" },
  { label: "Privacy Policy",     href: "/privacy-policy" },
  { label: "Terms of Service",   href: "/terms-of-service" },
  { label: "Disclaimer",         href: "/disclaimer" },
  { label: "Affiliate Disclosure", href: "/affiliate-disclosure" },
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
        <CookieConsentWrapper />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />

        {/* ── Header ── */}
        <header className="bg-white border-b border-[#e2e8f0] fixed top-0 w-full z-50 h-16">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between">
            {/* Wordmark */}
            <Link
              href="/"
              className="font-serif text-lg font-semibold text-[#001229] uppercase tracking-[0.15em] hover:opacity-75 transition-opacity"
            >
              Loan Cliff
            </Link>

            {/* Minimal nav — only real pages */}
            <nav className="flex items-center gap-6">
              <Link
                href="/methodology"
                className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#44474d] hover:text-[#001229] transition-colors"
              >
                Methodology
              </Link>
              <Link
                href="/learn"
                className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#44474d] hover:text-[#001229] transition-colors hidden sm:block"
              >
                Learn
              </Link>
              <Link
                href="/affiliate-disclosure"
                className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#44474d] hover:text-[#001229] transition-colors hidden sm:block"
              >
                Disclosures
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Page content ── */}
        {children}

        {/* ── Footer ── */}
        <footer className="mt-auto border-t border-[#e2e8f0] bg-[#f8fafc] py-12 px-6 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
            <Link
              href="/"
              className="font-serif text-base font-semibold text-[#1b1c1e] hover:opacity-75 transition-opacity"
            >
              Loan Cliff
            </Link>
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-3">
              {FOOTER_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#6b7280] hover:text-[#1b1c1e] transition-colors whitespace-nowrap"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <a
                href="https://x.com/loancliffcalc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Loan Cliff on X"
                className="text-[#9ca3af] hover:text-[#1b1c1e] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/loancliffcalc/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Loan Cliff on Instagram"
                className="text-[#9ca3af] hover:text-[#1b1c1e] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af] max-w-sm leading-relaxed">
              © 2026 Spak Labs. LoanCliff is operated by Spak Labs.
              Data sources: Department of Education, IPEDS.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
