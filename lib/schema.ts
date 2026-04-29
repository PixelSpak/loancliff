import type { CalcSuccess } from "./types";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function buildSchemaGraph(
  result: CalcSuccess,
  schoolSlug: string,
  programSlug: string,
  pageUrl: string
) {
  const programName = `${result.programLabel} at ${result.schoolName}`;
  const gapYearRange = `${2026}–${2026 + result.lengthYears - 1}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: `${result.schoolShortName} ${result.programShortLabel} Funding Gap: ${fmt(result.totalGap)}`,
        description: `${result.schoolName} ${result.programLabel} students face a ${fmt(result.totalGap)} funding gap (${fmt(result.gapPerYear)}/yr) after the July 2026 Grad PLUS cap elimination.`,
        dateModified: "2026-04-29",
        inLanguage: "en-US",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Loan Cliff", item: "https://loancliff.com" },
            { "@type": "ListItem", position: 2, name: result.schoolName, item: `https://loancliff.com/cliff/${schoolSlug}` },
            { "@type": "ListItem", position: 3, name: result.programLabel, item: pageUrl },
          ],
        },
        mainEntity: {
          "@type": "EducationalOccupationalProgram",
          "@id": `${pageUrl}#program`,
          name: programName,
          provider: {
            "@type": "CollegeOrUniversity",
            name: result.schoolName,
            address: { "@type": "PostalAddress", addressRegion: result.schoolState },
          },
          timeToComplete: `P${result.lengthYears}Y`,
          educationalCredentialAwarded: result.programLabel,
          offers: {
            "@type": "Offer",
            price: result.coaPerYear,
            priceCurrency: "USD",
            description: `Annual cost of attendance ${fmt(result.coaPerYear)}`,
          },
        },
      },
      {
        // Standalone MonetaryAmount for AI/LLM citation — not a Google rich result target.
        "@type": "MonetaryAmount",
        name: `Grad PLUS funding gap — ${programName} (${gapYearRange})`,
        currency: "USD",
        value: result.totalGap,
        description: `After the July 2026 federal cap of ${fmt(result.capPerYear)}/yr, students face a ${fmt(result.gapPerYear)}/yr gap (${fmt(result.totalGap)} total over ${result.lengthYears} years).`,
      },
      {
        // FAQPage: not targeted for Google rich results on commercial sites (Aug 2023 restriction).
        // Retained because FAQPage schema improves AI Overview / LLM citation probability.
        "@type": "FAQPage",
        mainEntity: buildFAQ(result),
      },
    ],
  };
}

function buildFAQ(result: CalcSuccess) {
  const aggregateCap = result.category === "professional" ? 200_000 : 100_000;

  return [
    {
      "@type": "Question",
      name: "What is the Grad PLUS funding cliff?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Reconciliation Act of 2025 eliminates Grad PLUS loans on July 1, 2026 and replaces them with statutory caps: $20,500/year (aggregate $100,000) for graduate programs and $50,000/year (aggregate $200,000) for professional programs. Students who previously relied on Grad PLUS to cover the full cost of attendance now face an uncovered gap.",
      },
    },
    {
      "@type": "Question",
      name: `How was the ${fmt(result.totalGap)} funding gap calculated for ${result.programLabel} at ${result.schoolName}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${result.schoolName}'s published Cost of Attendance for the ${result.programLabel} program is ${fmt(result.coaPerYear)} per year (IPEDS ${result.citation.ipedsYear}). The new statutory cap for ${result.category} programs is ${fmt(result.capPerYear)} per year. The annual uncovered gap is ${fmt(result.gapPerYear)}. Over the standard ${result.lengthYears}-year program, the total is ${fmt(result.totalGap)} — capped at the aggregate limit of ${fmt(aggregateCap)}. Source: ${result.citation.statute}.`,
      },
    },
    {
      "@type": "Question",
      name: `What options exist to cover the ${fmt(result.gapPerYear)}/year gap?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: "Private student loans are the most common bridge. Rates vary significantly by lender — comparing several before borrowing can save thousands. Other options include institutional scholarships, graduate assistantships, income-share agreements, and deferring enrollment by one year to build savings.",
      },
    },
    {
      "@type": "Question",
      name: "When does the Grad PLUS elimination take effect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "July 1, 2026. Loans first disbursed on or after that date are subject to the new caps. Students already enrolled before that date may still be affected for disbursements in academic years 2026–27 and beyond.",
      },
    },
  ];
}
