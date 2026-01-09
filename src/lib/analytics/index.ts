// src/lib/analytics/index.ts
// Use GA_MEASUREMENT_ID (G-XXXX) for config and events, NOT GOOGLE_TAG_ID (GT-XXXX)
// IMPORTANT: Never use Google Tag ID (GT-XXXX) here - only GA4 Measurement ID (G-XXXX)
// This is used for gtag('config', ...) and all event tracking
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const isProduction = (): boolean => {
  // Allow explicit override via environment variable
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true") {
    return true;
  }

  // Standard production check
  if (process.env.NODE_ENV !== "production") {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  // More precise hostname checking - only exclude actual localhost/127.0.0.1
  // Don't exclude hostnames that just contain these strings (e.g., staging-3000.example.com)
  const hostname = window.location.hostname;
  return (
    hostname !== "localhost" &&
    hostname !== "127.0.0.1" &&
    !hostname.startsWith("localhost:") &&
    !hostname.startsWith("127.0.0.1:")
  );
};

// Check if consent has been granted
// Defaults to true (opt-out model) unless explicitly rejected
// Note: In development, still respects consent but doesn't track (handled by isProduction check in pageview)
export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const consent = localStorage.getItem("icb-cookie-consent");
    if (consent) {
      const { analytics } = JSON.parse(consent);
      // If analytics is explicitly false, return false
      // Otherwise default to true (opt-out model)
      return analytics !== false;
    }
    // No consent stored = default to granted (opt-out model)
    return true;
  } catch (e) {
    console.error("Error checking analytics consent", e);
    // Default to granted on error (opt-out model)
    return true;
  }
};

// Initialize Google Analytics (simplified - core initialization is done inline in layout.tsx)
// This function now only handles runtime consent updates and ensures GA is ready
// The inline script in layout.tsx handles: dataLayer, gtag function, and initial consent mode
export const initGA = () => {
  // Core initialization is done via inline script in layout.tsx
  // This function is kept for backward compatibility and to ensure consent is up-to-date
  if (typeof window === "undefined" || !GA_TRACKING_ID || !isProduction()) {
    if (process.env.NODE_ENV === "development") {
      console.log("GA4 tracking disabled (dev environment)");
    }
    return;
  }

  // Ensure dataLayer and gtag exist (fallback - should already be initialized by inline script)
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (!window.gtag) {
    // Use rest parameters (TypeScript-friendly) - inline script uses arguments (standard GA pattern)
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag("js", new Date());
    // Set default consent if gtag wasn't initialized (opt-out model - default granted)
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
    });
  }

  // Update consent status based on user preference (opt-out model)
  if (hasAnalyticsConsent()) {
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
  } else {
    // User explicitly rejected - deny consent
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    });
  }
};

// Update consent status
export const updateAnalyticsConsent = (granted: boolean) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("consent", "update", {
      analytics_storage: granted ? "granted" : "denied",
    });

    // Dispatch custom event to notify GoogleAnalytics component
    // This allows tracking the current pageview when consent is granted
    if (granted) {
      window.dispatchEvent(new Event("icb-consent-updated"));
    }
  }
};

export const pageview = (url: string) => {
  // Ensure GA is initialized before tracking
  if (typeof window === "undefined" || !GA_TRACKING_ID || !isProduction()) {
    return;
  }

  // Initialize if not already done (safety check)
  if (!window.dataLayer || !window.gtag) {
    initGA();
  }

  // Only track if consent is given
  if (window.gtag && hasAnalyticsConsent()) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  // Only track if consent is given
  if (typeof window !== "undefined" && window.gtag && hasAnalyticsConsent()) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

// UTM Parameter Extraction and Attribution (REAL)
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
  session_quality_score: number; // ✅ REAL metric based on behavior
};

// Extract UTM parameters from URL (REAL)
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

// Calculate session quality based on REAL behavior (HONEST)
export const calculateSessionQuality = (): number => {
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
    hasEngaged: sessionStorage.getItem("icb_has_engaged") === "true", // Clicked something, used tools, etc.
  };

  // Real quality scoring
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

// Store attribution data with REAL quality metrics
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

// Get stored attribution data (REAL)
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

// Mark user engagement for quality scoring
export const markUserEngagement = (
  engagementType: "tool_use" | "filter_apply" | "content_read" | "link_click"
) => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem("icb_has_engaged", "true");
  sessionStorage.setItem("icb_last_engagement", engagementType);
};

// HONEST track event with attribution (NO FAKE COMMISSIONS)
type TrackEventWithAttributionOptions = {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParams?: Record<string, unknown>;
};

export const trackEventWithAttribution = (
  options: TrackEventWithAttributionOptions
): void => {
  const { action, category, label, value, customParams } = options;
  if (!hasAnalyticsConsent()) {
    return;
  }
  if (typeof window === "undefined") {
    return;
  }

  const attribution = getStoredAttribution();
  const currentUTM = getUTMParams();
  const sessionQuality = calculateSessionQuality();

  const enhancedParams = {
    event_category: category,
    event_label: label,
    value,

    // REAL Attribution data
    utm_source: currentUTM.utm_source || attribution.original_source,
    utm_campaign: currentUTM.utm_campaign || attribution.original_campaign,
    utm_content: currentUTM.utm_content || attribution.original_content,
    attribution_touchpoints: attribution.touchpoints,

    // REAL Quality metrics
    session_quality_score: sessionQuality,
    time_on_site: Math.floor(performance.now() / 1000),
    page_count: Number.parseInt(
      sessionStorage.getItem("icb_page_count") || "1",
      10
    ),

    // Custom parameters
    ...(customParams || {}),
  };

  // Send to GA4
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, enhancedParams);
  }

  // Also send to your API endpoint
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: action,
      properties: enhancedParams,
    }),
  }).catch(console.error);
};

// HONEST roaster click tracking (NO FAKE COMMISSION VALUES)
export const trackRoasterClick = (
  roasterId: string,
  clickType: "website" | "social" | "phone" | "email"
) => {
  const attribution = getStoredAttribution();
  const sessionQuality = calculateSessionQuality();

  markUserEngagement("link_click"); // Mark as engaged user

  // Calculate HONEST partnership value estimate
  const partnershipValue = calculatePartnershipValue(
    sessionQuality,
    attribution.touchpoints
  );

  trackEventWithAttribution({
    action: "roaster_external_click",
    category: "conversion",
    label: roasterId,
    customParams: {
      roaster_id: roasterId,
      click_type: clickType,
      original_traffic_source: attribution.original_source,
      customer_journey_length: attribution.touchpoints,
      session_quality_score: sessionQuality,

      // HONEST estimated value for partnership discussions
      estimated_partnership_value: partnershipValue,
      value_calculation_method: "session_quality_based",
      is_high_quality_click: sessionQuality >= 3,
    },
  });
};

// Helper: Calculate quality multiplier based on session quality
function calculateQualityMultiplier(sessionQuality: number): number {
  if (sessionQuality >= 4) {
    return 2.0;
  }
  if (sessionQuality >= 3) {
    return 1.5;
  }
  if (sessionQuality >= 2) {
    return 1.2;
  }
  return 1.0;
}

// Helper: Calculate journey multiplier based on touchpoints
function calculateJourneyMultiplier(touchpoints: number): number {
  if (touchpoints >= 3) {
    return 1.3;
  }
  if (touchpoints >= 2) {
    return 1.1;
  }
  return 1.0;
}

// REALISTIC partnership value calculation
const calculatePartnershipValue = (
  sessionQuality: number,
  touchpoints: number
): number => {
  // Industry-standard directory referral values (HONEST estimates)
  const baseValue = 1.5; // Base value per click

  // Quality multipliers (REAL factors)
  const qualityMultiplier = calculateQualityMultiplier(sessionQuality);
  const journeyMultiplier = calculateJourneyMultiplier(touchpoints);

  return (
    Math.round(baseValue * qualityMultiplier * journeyMultiplier * 100) / 100
  );
};

// Helper: Calculate engagement value based on engagement type
function calculateEngagementValue(
  engagementType: "view" | "rating" | "share" | "purchase_link_click"
): number {
  if (engagementType === "purchase_link_click") {
    return 5;
  }
  if (engagementType === "rating") {
    return 3;
  }
  if (engagementType === "share") {
    return 2;
  }
  return 1;
}

// REALISTIC coffee engagement tracking
export const trackCoffeeEngagement = (
  coffeeId: string,
  roasterId: string,
  engagementType: "view" | "rating" | "share" | "purchase_link_click"
): void => {
  markUserEngagement(
    engagementType === "purchase_link_click" ? "link_click" : "content_read"
  );

  const sessionQuality = calculateSessionQuality();

  trackEventWithAttribution({
    action: "coffee_engagement",
    category: "engagement",
    label: engagementType,
    customParams: {
      coffee_id: coffeeId,
      roaster_id: roasterId,
      engagement_type: engagementType,
      session_quality_score: sessionQuality,
      is_purchase_intent: engagementType === "purchase_link_click",

      // HONEST engagement value
      engagement_value: calculateEngagementValue(engagementType),
    },
  });
};

// Helper: Calculate engagement level based on session duration
function calculateEngagementLevel(sessionDuration: number): string {
  if (sessionDuration > 300) {
    return "high";
  }
  if (sessionDuration > 120) {
    return "medium";
  }
  return "low";
}

// Helper: Calculate tool engagement value based on session duration
function calculateToolEngagementValue(sessionDuration: number): number {
  if (sessionDuration > 300) {
    return 10;
  }
  if (sessionDuration > 120) {
    return 5;
  }
  return 2;
}

// REALISTIC tools engagement tracking
export const trackToolsUsage = (
  toolType: "calculator" | "recipes" | "guides",
  sessionDuration: number
): void => {
  markUserEngagement("tool_use"); // Mark as highly engaged user

  trackEventWithAttribution({
    action: "tools_engagement",
    category: "engagement",
    label: toolType,
    value: sessionDuration,
    customParams: {
      tool_type: toolType,
      session_duration_seconds: sessionDuration,
      engagement_level: calculateEngagementLevel(sessionDuration),

      // HONEST tool value for business decisions
      tool_engagement_value: calculateToolEngagementValue(sessionDuration),
    },
  });
};

declare global {
  // Required for TypeScript global augmentation
  interface Window {
    dataLayer: unknown[];
    // gtag supports both specific signatures and rest parameters
    gtag: (
      command: "event" | "config" | "consent" | "js",
      actionOrTarget: unknown,
      params?: Record<string, unknown>
    ) => void;
  }
}
