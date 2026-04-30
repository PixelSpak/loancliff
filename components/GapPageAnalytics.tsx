"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface GapPageAnalyticsProps {
  schoolId: string;
  schoolName: string;
  programType: string;
  programLabel: string;
  category: string;
  startYear: number;
  gapPerYear: number;
  totalGap: number;
  monthlyEquivalent: number;
}

export function GapPageAnalytics(props: GapPageAnalyticsProps) {
  useEffect(() => {
    trackEvent("gap_calculated", {
      school_id: props.schoolId,
      school_name: props.schoolName,
      program_type: props.programType,
      program_label: props.programLabel,
      category: props.category,
      start_year: props.startYear,
      gap_per_year: props.gapPerYear,
      total_gap: props.totalGap,
      monthly_equivalent: props.monthlyEquivalent,
      page_type: "programmatic_gap_page",
    });
  }, [props]);

  return null;
}
