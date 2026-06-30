import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "https://b.indiancoffeebeans.com",
  ui_host: "https://eu.posthog.com",
  // Include the defaults option as required by PostHog
  defaults: "2026-01-30",
  // Enables capturing unhandled exceptions via Error Tracking
  capture_exceptions: true,
  // Scroll depth in Web Analytics: keep scroll context on (see disable_scroll_properties in posthog-js)
  disable_scroll_properties: false,
  // Turn on debug in development mode
  debug: process.env.NODE_ENV === "development",
  // Avoid lazy-loading the session recorder in dev (often fails under Turbopack / ad blockers → "could not load recorder")
  disable_session_recording: process.env.NODE_ENV === "development",
  // Dead-click analysis can crash on navigations when DOM nodes are already torn down (posthog-js <1.37).
  capture_dead_clicks: process.env.NODE_ENV !== "development",
  before_send: (event) => {
    if (event?.event !== "$exception") return event;
    if (process.env.NODE_ENV !== "production") return null;
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    if (host === "localhost" || host === "127.0.0.1") return null;
    const blob = JSON.stringify(event.properties?.$exception_list ?? "");
    const NOISE = [
      "__firefox__",
      "window.ethereum",
      "chrome-extension://",
      "moz-extension://",
      "ResizeObserver loop completed",
      // Transient user-side network + benign browser-policy errors (not bugs).
      // Deliberately NOT filtering "Script error." — cross-origin-masked, can hide real bugs.
      "Load failed",
      "Failed to fetch",
      "NetworkError",
      "Connection closed",
      "play method is not allowed",
    ];
    if (NOISE.some((m) => blob.includes(m))) return null;
    return event;
  },
});

// IMPORTANT: Never combine this approach with other client-side PostHog initialization approaches,
// especially components like a PostHogProvider. instrumentation-client.ts is the correct solution

// for initializing client-side PostHog in Next.js 15.3+ apps.
