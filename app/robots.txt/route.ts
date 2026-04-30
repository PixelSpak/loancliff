import { NextResponse } from "next/server";

const robots = `User-agent: *
Allow: /

Sitemap: https://loancliff.com/sitemap.xml
Content-Signal: ai-train=no, search=yes, ai-input=yes
`;

export function GET() {
  return new NextResponse(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
