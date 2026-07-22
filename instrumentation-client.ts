import { loadPostHog } from "@/lib/posthog";

// Defer PostHog off the critical path. posthog-js (~330KB parsed) is
// dynamically imported inside loadPostHog(), so kicking it off once the browser
// is idle keeps the library out of the first-load bundle and away from LCP /
// hydration. init() still captures the landing $pageview a moment after load.
//
// IMPORTANT: Do not combine with other client-side PostHog init approaches
// (e.g. a PostHogProvider). This idle-triggered lazy init is the single source.
if (typeof window !== "undefined") {
  const start = () => {
    void loadPostHog();
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 3000 });
  } else {
    setTimeout(start, 1500);
  }
}
