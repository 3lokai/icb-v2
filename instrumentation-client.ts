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
  // Never start the recorder during init — its script (posthog-recorder.js ≈ 52KB)
  // loaded on every page and competed with LCP. Prod starts it on idle below;
  // dev leaves it off (often fails under Turbopack / ad blockers).
  disable_session_recording: true,
  // Surveys and dead-click tracking are unused (Clarity covers dead clicks) — skip
  // their bundles entirely rather than paying the fetch on every page load.
  disable_surveys: true,
  capture_dead_clicks: false,
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
      // Recovered by ChunkErrorHandler (bounded reload/cooldown). The $exception is logged at the
      // unhandled-rejection layer before recovery, so it's expected post-deploy churn, not a bug —
      // genuine reload *exhaustion* still surfaces via the capture("chunk_load_exhausted") event.
      // ponytail: a ChunkLoadError arriving as a plain "error" event (not a rejection) is neither
      // caught by the handler nor reported after this — rare, upgrade path is a window "error" listener.
      "An unexpected response was received from the server",
      "ChunkLoadError",
      // Cross-origin-masked. First-party bundles are same-origin + source-mapped, so real app bugs
      // report with concrete stacks and can't collapse to this string — only third-party internals can.
      "Script error.",
      // Transient user-side network + benign browser-policy errors (not bugs).
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

// Session recording is off entirely (disable_session_recording above) — we don't
// record sessions, so posthog-recorder.js (~52KB) never loads and never blocks the
// main thread. Re-enable by calling posthog.startSessionRecording() if that changes.

// IMPORTANT: Never combine this approach with other client-side PostHog initialization approaches,
// especially components like a PostHogProvider. instrumentation-client.ts is the correct solution

// for initializing client-side PostHog in Next.js 15.3+ apps.
