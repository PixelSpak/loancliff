import Script from "next/script";
import { Suspense } from "react";
import { AnalyticsEvents } from "./AnalyticsEvents";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export function Analytics() {
  const hasGoogleAnalytics = Boolean(gaMeasurementId);
  const hasPostHog = Boolean(posthogKey);

  if (!hasGoogleAnalytics && !hasPostHog) return null;

  return (
    <>
      {hasGoogleAnalytics && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { send_page_view: false });
            `}
          </Script>
        </>
      )}

      <Suspense fallback={null}>
        <AnalyticsEvents
          gaMeasurementId={gaMeasurementId}
          posthogKey={posthogKey}
          posthogHost={posthogHost}
        />
      </Suspense>
    </>
  );
}
