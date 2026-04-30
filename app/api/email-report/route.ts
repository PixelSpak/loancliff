import { NextResponse } from "next/server";
import { computeGap } from "@/lib/calc";
import { caps, programs, schools } from "@/lib/data";
import { renderGapReportPdf } from "@/lib/pdf";
import { sendGapReportEmail, upsertBrevoContact } from "@/lib/brevo";
import type { ProgramType } from "@/lib/types";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PROGRAM_TYPES = new Set(Object.keys(programs));

interface EmailReportRequest {
  email: string;
  schoolId: string;
  programType: ProgramType;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseRequest(value: unknown): EmailReportRequest | null {
  if (!isObject(value)) return null;

  const email = value.email;
  const schoolId = value.schoolId;
  const programType = value.programType;

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) return null;
  if (typeof schoolId !== "string" || !schools[schoolId]) return null;
  if (typeof programType !== "string" || !PROGRAM_TYPES.has(programType)) return null;

  return {
    email: email.trim().toLowerCase(),
    schoolId,
    programType: programType as ProgramType,
  };
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://loancliff.com").replace(/\/$/, "");
}

function filenameFor(schoolId: string, programType: ProgramType) {
  return `loan-cliff-${schoolId}-${programType}-gap-report.pdf`;
}

export async function POST(request: Request) {
  try {
    const input = parseRequest(await request.json());

    if (!input) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid email address." },
        { status: 400 }
      );
    }

    const result = computeGap(
      { schoolId: input.schoolId, programType: input.programType, startYear: 2026 },
      schools,
      programs,
      caps
    );

    if (result.kind !== "ok") {
      return NextResponse.json(
        { ok: false, error: "We could not generate a report for that school and program." },
        { status: 404 }
      );
    }

    const resultUrl = `${siteUrl()}/cliff/${input.schoolId}/${input.programType}`;
    const pdf = await renderGapReportPdf(result);
    const pdfBase64 = pdf.toString("base64");

    await upsertBrevoContact({
      email: input.email,
      result,
      resultUrl,
    });

    await sendGapReportEmail({
      email: input.email,
      result,
      resultUrl,
      pdfBase64,
      filename: filenameFor(input.schoolId, input.programType),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We could not send the report right now. Please try again." },
      { status: 500 }
    );
  }
}
