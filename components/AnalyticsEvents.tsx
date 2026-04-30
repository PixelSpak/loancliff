"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

interface AnalyticsEventsProps {
  gaMeasurementId?: string;
  posthogKey?: string;
  posthogHost: string;
}

let posthogInitialized = false;

export function AnalyticsEvents({
  gaMeasurementId,
  posthogKey,
  posthogHost,
}: AnalyticsEventsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthogKey || posthogInitialized) return;

    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_pageview: false,
      person_profiles: "identified_only",
    });
    posthogInitialized = true;
  }, [posthogHost, posthogKey]);

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    const url = window.location.href;

    if (posthogKey && posthogInitialized) {
      posthog.capture("$pageview", {
        $current_url: url,
        page_path: path,
      });
    }

    if (gaMeasurementId && window.gtag) {
      window.gtag("config", gaMeasurementId, {
        page_path: path,
        page_location: url,
      });
    }
  }, [gaMeasurementId, pathname, posthogKey, searchParams]);

  return null;
}
