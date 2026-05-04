"use client";

import { useState, useEffect } from "react";
import { Analytics } from "@/components/Analytics";
import Link from "next/link";

const CONSENT_KEY = "lc_consent";

export function CookieConsentWrapper() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null | "loading">("loading");

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as "accepted" | "declined" | null;
    setConsent(stored ?? null);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setConsent("accepted");
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setConsent("declined");
  };

  return (
    <>
      {consent === "accepted" && <Analytics />}

      {consent === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
        >
          <div className="max-w-2xl mx-auto bg-white border border-[#e2e8f0] rounded-xl shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-[13px] text-[#44474d] leading-relaxed flex-1">
              We use cookies to understand how people use Loan Cliff. No advertising data is
              collected.{" "}
              <Link
                href="/privacy-policy"
                className="text-[#001229] font-semibold underline underline-offset-2 hover:opacity-75"
              >
                Privacy Policy
              </Link>
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={decline}
                className="text-[12px] font-semibold text-[#44474d] hover:text-[#1b1c1e] transition-colors px-3 py-1.5"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="text-[12px] font-semibold bg-[#001229] text-white px-4 py-1.5 rounded-lg hover:bg-[#0f2744] transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
