"use client";

import type { ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackedAffiliateLinkProps {
  href: string;
  affiliateName: string;
  schoolId: string;
  programType: string;
  totalGap: number;
  className: string;
  children: ReactNode;
}

export function TrackedAffiliateLink({
  href,
  affiliateName,
  schoolId,
  programType,
  totalGap,
  className,
  children,
}: TrackedAffiliateLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={className}
      onClick={() => {
        trackEvent("affiliate_click", {
          affiliate_name: affiliateName,
          school_id: schoolId,
          program_type: programType,
          total_gap: totalGap,
        });
      }}
    >
      {children}
    </a>
  );
}
