type GtagCommand = "config" | "event" | "js";

interface Window {
  dataLayer?: unknown[];
  gtag?: (
    command: GtagCommand,
    target: string | Date,
    params?: Record<string, unknown>
  ) => void;
}
