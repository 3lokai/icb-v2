// src/lib/analytics/index.ts
// Cookie-consent wiring + UTM attribution capture.
// Product event tracking lives in PostHog (@/lib/posthog); session replay in
// Microsoft Clarity. This module only handles consent updates and storing the
// visitor's original UTM attribution for later reference.

import { getCookie, setCookie } from "@/lib/reviews/anon-id";
import { getStoredPreferences } from "@/lib/consent";

// Update consent status
// Consent mode is initialized by the beforeInteractive script in layout.tsx;
// this is called when the user changes preferences via the cookie-consent UI.
export const updateAnalyticsConsent = (granted: boolean) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });
  }
  // window.clarity only exists once MicrosoftClarity has called Clarity.init;
  // optional-chain rather than the Clarity.consent() helper, which throws if
  // called before that (e.g. consent rejected before Clarity ever loaded).
  if (typeof window !== "undefined") {
    window.clarity?.("consent", granted);
  }
  // PostHog, if it is already running. Imported dynamically to keep the module
  // graph acyclic — @/lib/posthog imports the consent hook, which imports this
  // module. The import itself is cheap; posthog-js only loads inside
  // loadPostHog(), which this deliberately does not call.
  if (typeof window !== "undefined") {
    void import("@/lib/posthog").then(({ loadedPostHog }) =>
      loadedPostHog()?.then((posthog) =>
        granted ? posthog.opt_in_capturing() : posthog.opt_out_capturing()
      )
    );
  }
  // Revoking consent must also drop attribution already on disk. The cookie
  // outlives the toggle by 90 days and is readable server-side at signup, so
  // leaving it would make the UI assert a stop that never happened.
  if (!granted) {
    setCookie(ATTRIBUTION_COOKIE, "", 0);
  }
};

// Marketing/advertising consent. Deliberately separate from analytics: this one
// is opt-IN, and every ad tag or hashed-email export must gate on it rather than
// on `analytics`. There is no ad tech on the site yet — this lands the lawful
// basis before the first tag ships, not after.
export const updateMarketingConsent = (granted: boolean) => {
  if (typeof window !== "undefined" && window.gtag) {
    const value = granted ? "granted" : "denied";
    window.gtag("consent", "update", {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    });
  }
};

// UTM Parameter Extraction and Attribution
export type UTMParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type AttributionData = {
  original_source?: string;
  original_campaign?: string;
  original_content?: string;
  touchpoints: number;
  first_visit_time: number;
  last_visit_time: number;
  session_quality_score: number;
};

// Extract UTM parameters from the current URL
export const getUTMParams = (): UTMParams => {
  if (typeof window === "undefined") {
    return {};
  }

  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get("utm_source") || undefined,
    utm_medium: urlParams.get("utm_medium") || undefined,
    utm_campaign: urlParams.get("utm_campaign") || undefined,
    utm_content: urlParams.get("utm_content") || undefined,
    utm_term: urlParams.get("utm_term") || undefined,
  };
};

// Calculate session quality based on real behavior
const calculateSessionQuality = (): number => {
  if (typeof window === "undefined") {
    return 1;
  }

  const sessionData = {
    timeOnSite: performance.now() / 1000, // Seconds since page load
    pageCount: Number.parseInt(
      sessionStorage.getItem("icb_page_count") || "1",
      10
    ),
    scrollDepth: Math.max(
      document.documentElement.scrollTop /
        document.documentElement.scrollHeight,
      0
    ),
    hasEngaged: sessionStorage.getItem("icb_has_engaged") === "true",
  };

  let qualityScore = 1; // Base score

  if (sessionData.timeOnSite > 120) {
    qualityScore += 1;
  } // 2+ minutes = quality visit
  if (sessionData.pageCount > 2) {
    qualityScore += 1;
  } // Multi-page = engaged
  if (sessionData.scrollDepth > 0.5) {
    qualityScore += 0.5;
  } // Scrolled halfway = reading
  if (sessionData.hasEngaged) {
    qualityScore += 1;
  } // Interacted = quality

  return Math.min(qualityScore, 5); // Cap at 5
};

// Cookie rather than sessionStorage: the rating -> gate -> signup funnel is
// cross-session by design, so per-tab storage recorded every delayed signup as
// unattributed. A cookie also lets the server read it at signup (see
// persist-attribution.ts) without any client plumbing.
export const ATTRIBUTION_COOKIE = "icb_attribution";
const ATTRIBUTION_MAX_AGE = 90 * 24 * 60 * 60; // 90 days in seconds

const EMPTY_ATTRIBUTION: AttributionData = {
  touchpoints: 0,
  first_visit_time: 0,
  last_visit_time: 0,
  session_quality_score: 1,
};

// Get stored attribution data
export const getStoredAttribution = (): AttributionData => {
  if (typeof window === "undefined") {
    return { ...EMPTY_ATTRIBUTION };
  }

  try {
    const stored = getCookie(ATTRIBUTION_COOKIE);
    if (stored) {
      return JSON.parse(decodeURIComponent(stored));
    }
  } catch (error) {
    console.error("Error reading attribution data:", error);
  }

  return { ...EMPTY_ATTRIBUTION };
};

// URL-encoded: the value is JSON, and a raw comma or semicolon would truncate
// the cookie. The server decodes with the same symmetry.
const writeAttribution = (data: AttributionData): void => {
  setCookie(
    ATTRIBUTION_COOKIE,
    encodeURIComponent(JSON.stringify(data)),
    ATTRIBUTION_MAX_AGE
  );
};

// Store attribution data with quality metrics
export const storeAttributionData = (utmParams: UTMParams): void => {
  if (typeof window === "undefined") {
    return;
  }

  // Gate at the source: with no attribution cookie there is nothing for the
  // signup persist or the PostHog person write downstream to pick up, so this
  // single check covers every consumer.
  // Attribution is analytics-category data. Shares the parse in @/lib/consent
  // rather than re-implementing it: the two copies previously disagreed about a
  // legacy marketing opt-out, and this side wrote the cookie anyway.
  if (!getStoredPreferences().analytics) {
    return;
  }

  try {
    const existingAttribution = getStoredAttribution();
    const now = Date.now();
    const currentQuality = calculateSessionQuality();

    // Update page count for quality calculation
    const currentPageCount =
      Number.parseInt(sessionStorage.getItem("icb_page_count") || "0", 10) + 1;
    sessionStorage.setItem("icb_page_count", currentPageCount.toString());

    if (utmParams.utm_source && !existingAttribution.original_source) {
      // New attribution
      const newAttribution: AttributionData = {
        original_source: utmParams.utm_source,
        original_campaign: utmParams.utm_campaign,
        original_content: utmParams.utm_content,
        touchpoints: 1,
        first_visit_time: now,
        last_visit_time: now,
        session_quality_score: currentQuality,
      };

      writeAttribution(newAttribution);
    } else if (existingAttribution.original_source) {
      // Update existing attribution
      const updatedAttribution: AttributionData = {
        ...existingAttribution,
        touchpoints: existingAttribution.touchpoints + 1,
        last_visit_time: now,
        session_quality_score: Math.max(
          existingAttribution.session_quality_score,
          currentQuality
        ),
      };

      writeAttribution(updatedAttribution);
    }
  } catch (error) {
    console.error("Error storing attribution data:", error);
  }
};

// Type declarations for Google Analytics consent + Microsoft Clarity
declare global {
  interface Window {
    // gtag consent signature (GA scripts only load when a measurement ID is set)
    gtag?: (
      command: "event" | "config" | "consent" | "js",
      actionOrTarget: any,
      params?: Record<string, any>
    ) => void;
    // Microsoft Clarity queue function, defined once @microsoft/clarity's
    // Clarity.init() injects the tag script
    clarity?: (...args: unknown[]) => void;
  }
}
