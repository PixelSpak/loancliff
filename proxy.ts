import { NextResponse, type NextRequest } from "next/server";

const homeMarkdown = `---
title: Loan Cliff
description: Graduate funding gap calculator for the July 1, 2026 Grad PLUS elimination.
---

# Loan Cliff

Loan Cliff is a free calculator that shows graduate and professional students their estimated funding gap after the July 1, 2026 elimination of Grad PLUS loans.

## What It Does

- Calculates annual uncovered cost.
- Calculates total uncovered cost over the standard program length.
- Shows the monthly equivalent.
- Cites IPEDS cost of attendance data and the federal statutory cap.
- Publishes program-specific pages at /cliff/{school}/{program}.

## Useful Links

- [Calculator](https://loancliff.com)
- [Methodology](https://loancliff.com/methodology)
- [Sitemap](https://loancliff.com/sitemap.xml)
- [API Catalog](https://loancliff.com/.well-known/api-catalog)
- [OpenAPI Description](https://loancliff.com/.well-known/openapi.json)
`;

function withDiscoveryHeaders(response: NextResponse) {
  response.headers.append("Link", '</.well-known/api-catalog>; rel="api-catalog"');
  response.headers.append("Link", '</.well-known/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"');
  response.headers.append("Link", '</methodology>; rel="service-doc"; type="text/html"');
  response.headers.append("Link", '</llms.txt>; rel="service-doc"; type="text/plain"');
  return response;
}

export function proxy(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";

  if (request.nextUrl.pathname === "/" && accept.includes("text/markdown")) {
    const response = new NextResponse(homeMarkdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
        "x-markdown-tokens": String(Math.ceil(homeMarkdown.length / 4)),
        "Content-Signal": "ai-train=no, search=yes, ai-input=yes",
      },
    });

    return withDiscoveryHeaders(response);
  }

  return withDiscoveryHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/", "/methodology"],
};
