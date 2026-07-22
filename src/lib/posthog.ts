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
          "Connection closed",
          "play method is not allowed",
        ];
        if (NOISE.some((m) => blob.includes(m))) return null;
        return event;
      },
    });
    return posthog;
  });
  return instance;
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
