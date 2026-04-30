import { NextResponse } from "next/server";

const openApi = {
  openapi: "3.1.0",
  info: {
    title: "Loan Cliff Public Discovery API",
    version: "0.1.0",
    description:
      "Public discovery metadata for Loan Cliff. The calculator itself is currently served as static pages.",
  },
  servers: [{ url: "https://loancliff.com" }],
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "Service is reachable",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { type: "boolean" },
                    service: { type: "string" },
                  },
                  required: ["ok", "service"],
                },
              },
            },
          },
        },
      },
    },
  },
};

export function GET() {
  return NextResponse.json(openApi, {
    headers: {
      "Content-Type": "application/vnd.oai.openapi+json; charset=utf-8",
    },
  });
}
