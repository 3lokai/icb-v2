"use client";

import type { PostHog } from "posthog-js";

let instance: Promise<PostHog> | null = null;

/**
 * Lazy-load + initialize posthog-js off the critical path. The library
 * (~330KB parsed) is dynamically imported, so it lands in a separate async
 * chunk instead of every route's first-load bundle. The first caller triggers
 * load + init; everyone else reuses the same instance. init() still captures
 * the landing $pageview a moment after load. The idle trigger lives in
 * instrumentation-client.ts; manual capture()/identify() calls also load it.
 */
export function loadPostHog(): Promise<PostHog> {
  if (instance) return instance;
  instance = import("posthog-js").then(({ default: posthog }) => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
      api_host: "https://b.indiancoffeebeans.com",
      ui_host: "https://eu.posthog.com",
      // Include the defaults option as required by PostHog
      defaults: "2026-01-30",
      // Enables capturing unhandled exceptions via Error Tracking
      capture_exceptions: true,
      // Scroll depth in Web Analytics: keep scroll context on
      disable_scroll_properties: false,
      // Turn on debug in development mode
      debug: process.env.NODE_ENV === "development",
      // Never start the recorder — its script (~52KB) competed with LCP.
      disable_session_recording: true,
      // Surveys and dead-click tracking are unused (Clarity covers dead clicks).
      disable_surveys: true,
      capture_dead_clicks: false,
      before_send: (event) => {
        if (event?.event !== "$exception") return event;
        if (process.env.NODE_ENV !== "production") return null;
        const host =
          typeof window !== "undefined" ? window.location.hostname : "";
        if (host === "localhost" || host === "127.0.0.1") return null;
        const blob = JSON.stringify(event.properties?.$exception_list ?? "");
        const NOISE = [
          "__firefox__",
          "window.ethereum",
          "chrome-extension://",
          "moz-extension://",
          "ResizeObserver loop completed",
          // Recovered by ChunkErrorHandler (bounded reload/cooldown) — expected
          // post-deploy churn, not a bug. Genuine exhaustion still surfaces via
          // the capture("chunk_load_exhausted") event.
          "An unexpected response was received from the server",
          "ChunkLoadError",
          // Cross-origin-masked. First-party bundles are same-origin +
          // source-mapped, so real app bugs report with concrete stacks.
          "Script error.",
          // Transient user-side network + benign browser-policy errors.
          "Load failed",
          "Failed to fetch",
          "NetworkError",
          // `blob.includes` is case-sensitive, so the lowercase-with-a-space
          // variant needs its own entry — "NetworkError" never caught it.
          "network error",
          "AbortError: signal is aborted",
          "Access is denied for this document",
          "Connection closed",
          "play method is not allowed",
          // Host-app and extension runtimes, not page code: an Android WebView
          // torn down mid-postMessage (in-app browsers), and a Safari App
          // Extension messaging its native host.
          "Error invoking postMessage",
          "runtime.sendNativeMessage",
          // NOT filtered on purpose: "NotFoundError". It is the largest single
          // match, but removeChild detach may be a React portal/unmount race
          // rather than an extension — see [posthog-source-maps]. Filtering it
          // would delete the evidence that review needs.
        ];
        if (NOISE.some((m) => blob.includes(m))) return null;
        return event;
      },
    });
    captureTtfb(posthog);
    return posthog;
  });
  return instance;
}

/**
 * TTFB, which posthog-js does not capture.
 *
 * Its web-vitals integration is hard-limited to LCP/CLS/FCP/INP
 * (`SupportedWebVitalsMetrics`), so TTFB cannot be switched on through
 * `capture_performance.web_vitals_allowed_metrics` — it has to be read from the
 * Navigation Timing API directly. Without it there is no way to tell a slow
 * server response apart from slow hydration when an LCP regression shows up;
 * PERFORMANCE-FIXES.md had to establish that split by hand.
 *
 * Fires once per full document load. Client-side App Router navigations do not
 * create a new navigation entry, which is correct — TTFB only describes the
 * initial document.
 */
function captureTtfb(posthog: PostHog): void {
  try {
    const [nav] = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    if (!nav) return;

    // Prerendered pages start the clock at activation, per the web-vitals spec.
    // activationStart is not in this TS lib's DOM types yet, so read it narrowly
    // rather than widening `nav` and losing the rest of the timing types.
    const activationStart =
      (nav as PerformanceNavigationTiming & { activationStart?: number })
        .activationStart ?? 0;
    const ttfb = nav.responseStart - activationStart;
    // Guard the same outlier band posthog-js uses for its own vitals (15 min).
    if (!Number.isFinite(ttfb) || ttfb <= 0 || ttfb > 15 * 60 * 1000) return;

    // Read the path off the navigation entry, not window.location: init is
    // deferred to idle, by which point the user may already have navigated on.
    let pathname: string | undefined;
    try {
      pathname = new URL(nav.name).pathname;
    } catch {
      /* non-URL entry name; leave undefined rather than guess */
    }

    posthog.capture("web_vitals_ttfb", {
      value: Math.round(ttfb),
      pathname,
      env: process.env.NODE_ENV,
    });
  } catch {
    /* Navigation Timing unavailable — telemetry must never break the page. */
  }
}

/** Fire-and-forget event capture; loads + inits posthog on first use. */
export const capture = (
  event: string,
  props?: Record<string, unknown>
): void => {
  void loadPostHog().then((posthog) =>
    posthog.capture(event, { env: process.env.NODE_ENV, ...props })
  );
};

/** Associate subsequent events with a user. */
export const identifyUser = (
  distinctId: string,
  props?: Record<string, unknown>
): void => {
  void loadPostHog().then((posthog) => posthog.identify(distinctId, props));
};

/** Clear identity on sign-out. */
export const resetPostHog = (): void => {
  void loadPostHog().then((posthog) => posthog.reset());
};

/** Report an exception to PostHog Error Tracking. */
export const captureException = (error: unknown): void => {
  void loadPostHog().then((posthog) => posthog.captureException(error));
};
