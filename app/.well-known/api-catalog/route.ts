import { NextResponse } from "next/server";

const catalog = {
  linkset: [
    {
      anchor: "https://loancliff.com",
      "service-desc": [
        {
          href: "https://loancliff.com/.well-known/openapi.json",
          type: "application/vnd.oai.openapi+json",
        },
      ],
      "service-doc": [
        {
          href: "https://loancliff.com/methodology",
          type: "text/html",
        },
        {
          href: "https://loancliff.com/llms.txt",
          type: "text/plain",
        },
      ],
      status: [
        {
          href: "https://loancliff.com/api/health",
          type: "application/json",
        },
      ],
    },
  ],
};

export function GET() {
  return NextResponse.json(catalog, {
    headers: {
      "Content-Type":
        'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    },
  });
}

export function HEAD() {
  return new NextResponse(null, {
    headers: {
      Link: '</.well-known/openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", </methodology>; rel="service-doc"; type="text/html", </api/health>; rel="status"; type="application/json"',
      "Content-Type":
        'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    },
  });
}
