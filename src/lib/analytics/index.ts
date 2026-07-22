// src/lib/analytics/index.ts
// Cookie-consent wiring + UTM attribution capture.
// Product event tracking lives in PostHog (@/lib/posthog); session replay in
// Microsoft Clarity. This module only handles consent updates and storing the
// visitor's original UTM attribution for later reference.

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

// Get stored attribution data
export const getStoredAttribution = (): AttributionData => {
  if (typeof window === "undefined") {
    return {
      touchpoints: 0,
      first_visit_time: 0,
      last_visit_time: 0,
      session_quality_score: 1,
    };
  }

  try {
    const stored = sessionStorage.getItem("icb_attribution");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading attribution data:", error);
  }

  return {
    touchpoints: 0,
    first_visit_time: 0,
    last_visit_time: 0,
    session_quality_score: 1,
  };
};

// Store attribution data with quality metrics
export const storeAttributionData = (utmParams: UTMParams): void => {
  if (typeof window === "undefined") {
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

      sessionStorage.setItem("icb_attribution", JSON.stringify(newAttribution));
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

      sessionStorage.setItem(
        "icb_attribution",
        JSON.stringify(updatedAttribution)
      );
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
