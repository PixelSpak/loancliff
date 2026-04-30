import { NextResponse } from "next/server";

const skill = `# Loan Cliff

Loan Cliff lets graduate and professional students calculate the funding gap created by the July 1, 2026 elimination of Grad PLUS loans. The site publishes programmatic pages for accredited US graduate and professional programs, using IPEDS cost of attendance data and statutory federal loan caps.

Useful URLs:
- Homepage: https://loancliff.com
- Methodology: https://loancliff.com/methodology
- Sitemap: https://loancliff.com/sitemap.xml
- API catalog: https://loancliff.com/.well-known/api-catalog
- OpenAPI description: https://loancliff.com/.well-known/openapi.json

Primary user action:
- Select a school and program to view the calculated annual gap, total gap, monthly equivalent, and source citation.
`;

export function GET() {
  return new NextResponse(skill, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
