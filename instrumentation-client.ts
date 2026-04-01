import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "https://b.indiancoffeebeans.com",
  ui_host: "https://eu.posthog.com",
  // Include the defaults option as required by PostHog
  defaults: "2026-01-30",
  // Enables capturing unhandled exceptions via Error Tracking
  capture_exceptions: true,
  // Turn on debug in development mode
  debug: process.env.NODE_ENV === "development",
  // Avoid lazy-loading the session recorder in dev (often fails under Turbopack / ad blockers → "could not load recorder")
  disable_session_recording: process.env.NODE_ENV === "development",
});

// IMPORTANT: Never combine this approach with other client-side PostHog initialization approaches,
// especially components like a PostHogProvider. instrumentation-client.ts is the correct solution
// for initializing client-side PostHog in Next.js 15.3+ apps.
