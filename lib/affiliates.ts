export interface AffiliateLink {
  name: string;
  url: string;
  description: string;
  cta: string;
}

const BASE = "utm_source=loancliff&utm_medium=affiliate&utm_campaign=cliff-page";

export const affiliates = {
  credible: {
    name: "Credible",
    url: `https://www.credible.com/refinance-student-loans?${BASE}&utm_content=credible`,
    description: "Compare rates from multiple lenders in 2 minutes — no hard credit pull",
    cta: "Compare multiple lenders →",
  },
  elfi: {
    name: "ELFI",
    url: `https://www.elfi.com/refinance-student-loans/?${BASE}&utm_content=elfi`,
    description: "Among the lowest fixed rates available for grad school refi",
    cta: "See lowest rates →",
  },
  lendkey: {
    name: "LendKey",
    url: `https://www.lendkey.com/student-loan-refinancing/?${BASE}&utm_content=lendkey`,
    description: "Refinance through community banks and credit unions",
    cta: "Credit union rates →",
  },
  sofi: {
    name: "SoFi",
    url: `https://www.sofi.com/refinance-student-loan/?${BASE}&utm_content=sofi`,
    description: "No origination fees, career coaching, and unemployment protection",
    cta: "Members-only perks →",
  },
  earnest: {
    name: "Earnest",
    url: `https://www.earnest.com/student-loan-refinancing?${BASE}&utm_content=earnest`,
    description: "Flexible payments and a skip-a-payment option once per year",
    cta: "Custom repayment →",
  },
} satisfies Record<string, AffiliateLink>;

export type AffiliateName = keyof typeof affiliates;

export const affiliateList = Object.values(affiliates);
