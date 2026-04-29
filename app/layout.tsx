import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
        <header className="border-b">
          <div className="max-w-2xl mx-auto px-6 h-12 flex items-center justify-between">
            <a href="/" className="text-base font-bold tracking-tight hover:opacity-80 transition-opacity">
              Loan Cliff
            </a>
            <a href="/" className="text-sm text-blue-600 hover:underline">
              Calculate yours →
            </a>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
