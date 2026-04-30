import type { CalcSuccess } from "@/lib/types";

interface BrevoContactPayload {
  email: string;
  result: CalcSuccess;
  resultUrl: string;
}

interface SendReportPayload extends BrevoContactPayload {
  pdfBase64: string;
  filename: string;
}

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

async function brevoFetch(path: string, init: RequestInit) {
  const response = await fetch(`https://api.brevo.com/v3${path}`, {
    ...init,
    headers: {
      "api-key": requiredEnv("BREVO_API_KEY"),
      "content-type": "application/json",
      accept: "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Brevo request failed with ${response.status}: ${details}`);
  }

  if (response.status === 204) return null;
  return response.json() as Promise<unknown>;
}

function contactAttributes(result: CalcSuccess, resultUrl: string) {
  return {
    SCHOOL: result.schoolName,
    PROGRAM: result.programLabel,
    START_YEAR: 2026,
    GAP_TOTAL: result.totalGap,
    GAP_PER_YEAR: result.gapPerYear,
    MONTHLY_EQUIVALENT: result.monthlyEquivalent,
    RESULT_URL: resultUrl,
  };
}

function reportParams(result: CalcSuccess, resultUrl: string) {
  return {
    school_name: result.schoolName,
    school_short_name: result.schoolShortName,
    program_label: result.programLabel,
    program_short_label: result.programShortLabel,
    gap_total: currency(result.totalGap),
    gap_per_year: currency(result.gapPerYear),
    monthly_equivalent: currency(result.monthlyEquivalent),
    coa_per_year: currency(result.coaPerYear),
    cap_per_year: currency(result.capPerYear),
    length_years: result.lengthYears,
    category: result.category,
    result_url: resultUrl,
  };
}

export async function upsertBrevoContact({
  email,
  result,
  resultUrl,
}: BrevoContactPayload) {
  const listId = Number(requiredEnv("BREVO_LIST_ID"));

  await brevoFetch("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
      attributes: contactAttributes(result, resultUrl),
    }),
  });
}

export async function sendGapReportEmail({
  email,
  result,
  resultUrl,
  pdfBase64,
  filename,
}: SendReportPayload) {
  const templateId = Number(requiredEnv("BREVO_TEMPLATE_REPORT"));

  await brevoFetch("/smtp/email", {
    method: "POST",
    body: JSON.stringify({
      to: [{ email }],
      templateId,
      params: reportParams(result, resultUrl),
      attachment: [
        {
          name: filename,
          content: pdfBase64,
        },
      ],
    }),
  });
}
