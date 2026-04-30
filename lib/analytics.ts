"use client";

import posthog from "posthog-js";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;

  posthog.capture(eventName, properties);
  window.gtag?.("event", eventName, properties);
}
