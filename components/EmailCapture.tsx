"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import type { ProgramType } from "@/lib/types";

interface EmailCaptureProps {
  schoolId: string;
  programType: ProgramType;
  totalGap: number;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

export function EmailCapture({
  schoolId,
  programType,
  totalGap,
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setError("");

    trackEvent("email_report_started", {
      school_id: schoolId,
      program_type: programType,
      total_gap: totalGap,
    });

    try {
      const response = await fetch("/api/email-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, schoolId, programType }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Unable to send report.");
      }

      setState("success");
      trackEvent("email_report_sent", {
        school_id: schoolId,
        program_type: programType,
        total_gap: totalGap,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to send report.";
      setError(message);
      setState("error");
      trackEvent("email_report_failed", {
        school_id: schoolId,
        program_type: programType,
        total_gap: totalGap,
      });
    }
  }

  if (state === "success") {
    return (
      <div className="border-t border-[#c4c6ce]/40 pt-5">
        <p className="text-sm font-bold text-[#1b1c1e]">Report sent.</p>
        <p className="text-xs text-[#44474d] leading-relaxed mt-1">
          Check your inbox for the PDF and your saved Loan Cliff estimate.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-[#c4c6ce]/40 pt-5">
      <label htmlFor="email-report" className="block text-sm font-bold text-[#1b1c1e]">
        Email me this gap report as a PDF
      </label>
      <p className="text-xs text-[#44474d] leading-relaxed mt-1">
        Plus alerts if refi rates drop below 6%. No account, no spam.
      </p>
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          id="email-report"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 h-11 bg-white border border-[#c4c6ce] rounded px-3 text-sm text-[#1b1c1e] placeholder:text-[#74777e] focus:border-[#001229] focus:ring-1 focus:ring-[#001229] focus:outline-none"
          disabled={state === "submitting"}
        />
        <button
          type="submit"
          disabled={state === "submitting"}
          className="h-11 px-4 rounded bg-[#001229] text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
        >
          {state === "submitting" ? "Sending..." : "Send PDF"}
        </button>
      </div>
      {state === "error" && (
        <p className="text-xs text-[#ba1a1a] font-semibold mt-2">{error}</p>
      )}
    </form>
  );
}
