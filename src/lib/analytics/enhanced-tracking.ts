// src/lib/analytics/enhanced-tracking.ts
// Enhanced event structure with custom dimensions for GA4 business intelligence

import {
  calculateSessionQuality,
  getStoredAttribution,
  hasAnalyticsConsent,
  markUserEngagement,
} from "./index";

const isProduction = (): boolean =>
  process.env.NODE_ENV === "production" &&
  typeof window !== "undefined" &&
  !window.location.hostname.includes("localhost") &&
  !window.location.hostname.includes("127.0.0.1") &&
  !window.location.hostname.includes("3000") &&
  !window.location.hostname.includes("dev");

// Regex patterns for device detection (defined at top level for performance)
const TABLET_REGEX = /tablet|ipad/;
const MOBILE_REGEX = /mobile|android|iphone/;

// Enhanced Event Structure (from PRD)
export type EnhancedAnalyticsEvent = {
  // Required
  event_name: string;
  event_category:
    | "discovery"
    | "engagement"
    | "conversion"
    | "performance"
    | "content";

  // Business Intelligence
  roaster_id?: string;
  coffee_id?: string;
  region?: string;
  conversion_value?: number;

  // User Context
  user_segment?: string;
  session_depth?: number;
  device_category?: string;

  // Performance Metrics
  response_time_ms?: number;
  result_count?: number;
  cache_hit?: boolean;

  // Content Context
  content_id?: string;
  content_type?: "coffee" | "roaster" | "article" | "recipe" | "guide";
  source_page?: string;
  destination?: string;

  // Custom Properties
  custom_parameters?: Record<string, unknown>;
};

// Custom Dimensions (GA4 Configuration Required)
export type CustomDimensions = {
  // User-Scoped (1-4)
  user_segment: "anonymous" | "registered" | "returning";
  device_category: "mobile" | "tablet" | "desktop";
  coffee_experience: "beginner" | "enthusiast" | "expert";
  geographic_segment: "metro" | "tier2" | "tier3";

  // Event-Scoped (5-15)
  roaster_id: string;
  coffee_id: string;
  content_series: string;
  tool_type: "calculator" | "recipes" | "guides";
  filter_combination: string;
  conversion_value: number;
  traffic_source_detail: string;
  session_depth: "shallow" | "medium" | "deep";
  performance_grade: "excellent" | "good" | "fair" | "poor";
  roaster_tier: "featured" | "verified" | "standard";
  purchase_intent: "low" | "medium" | "high";
};

// Device/Platform Detection
export function detectDeviceCategory(): CustomDimensions["device_category"] {
  if (typeof window === "undefined") {
    return "desktop";
  }

  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.screen.width;

  if (
    TABLET_REGEX.test(userAgent) ||
    (screenWidth >= 768 && screenWidth <= 1024)
  ) {
    return "tablet";
  }
  if (MOBILE_REGEX.test(userAgent) || screenWidth < 768) {
    return "mobile";
  }
  return "desktop";
}

// User Segment Classification
export function classifyUserSegment(
  sessionQuality: number,
  touchpoints: number
): CustomDimensions["user_segment"] {
  // Check if returning user (has attribution data with multiple touchpoints)
  if (touchpoints > 1) {
    return "returning";
  }

  // Future: Check if registered user when auth is implemented
  // For now, classify based on session quality
  return sessionQuality >= 3 ? "registered" : "anonymous";
}

// Session Depth Classification
export function classifySessionDepth(): CustomDimensions["session_depth"] {
  if (typeof window === "undefined") {
    return "shallow";
  }

  const pageCount = Number.parseInt(
    sessionStorage.getItem("icb_page_count") || "1",
    10
  );
  const timeOnSite = performance.now() / 1000;

  if (pageCount >= 5 && timeOnSite > 300) {
    return "deep";
  }
  if (pageCount >= 3 || timeOnSite > 120) {
    return "medium";
  }
  return "shallow";
}

// Geographic Segment Classification (based on common Indian city tiers)
export function classifyGeographicSegment(
  city?: string
): CustomDimensions["geographic_segment"] {
  if (!city) {
    return "tier3";
  }

  const metro = [
    "mumbai",
    "delhi",
    "bangalore",
    "hyderabad",
    "chennai",
    "kolkata",
    "pune",
    "ahmedabad",
  ];
  const tier2 = [
    "coimbatore",
    "kochi",
    "thiruvananthapuram",
    "mysore",
    "madurai",
    "salem",
    "kozhikode",
    "thrissur",
  ];

  const normalizedCity = city.toLowerCase();

  if (metro.some((m) => normalizedCity.includes(m))) {
    return "metro";
  }
  if (tier2.some((t) => normalizedCity.includes(t))) {
    return "tier2";
  }
  return "tier3";
}

// Roaster Tier Classification (based on your roaster data structure)
export function getRoasterTier(
  roasterId?: string
): CustomDimensions["roaster_tier"] {
  if (!roasterId) {
    return "standard";
  }

  // TODO: Replace with actual roaster data lookup
  // For now, return standard - you'll enhance this with your roaster data
  return "standard";
}

// Coffee Price Range Classification
export function getCoffeePriceRange(
  coffeeId?: string
): "budget" | "premium" | "luxury" {
  if (!coffeeId) {
    return "budget";
  }

  // TODO: Replace with actual coffee price lookup
  // For now, return budget - you'll enhance this with your coffee data
  return "budget";
}

// Purchase Intent Classification
export function calculatePurchaseIntent(
  sessionQuality: number,
  engagementType?: string,
  clickType?: string
): CustomDimensions["purchase_intent"] {
  // High intent signals
  if (
    clickType === "purchase_link_click" ||
    engagementType === "roaster_website_clicked"
  ) {
    return "high";
  }

  // Medium intent signals
  if (
    sessionQuality >= 4 ||
    engagementType === "coffee_rating" ||
    clickType === "social_media"
  ) {
    return "medium";
  }

  return "low";
}

// Performance Grade Classification
export function calculatePerformanceGrade(
  responseTimeMs: number
): CustomDimensions["performance_grade"] {
  if (responseTimeMs < 200) {
    return "excellent";
  }
  if (responseTimeMs < 500) {
    return "good";
  }
  if (responseTimeMs < 1000) {
    return "fair";
  }
  return "poor";
}

// Helper: Calculate engagement score based on session duration
function calculateEngagementScore(sessionDuration: number): number {
  if (sessionDuration > 300) {
    return 10;
  }
  if (sessionDuration > 120) {
    return 5;
  }
  return 2;
}

// Helper: Calculate content value based on completion rate
function calculateContentValue(completionRate: number): number {
  if (completionRate > 0.8) {
    return 5;
  }
  if (completionRate > 0.5) {
    return 3;
  }
  return 1;
}

// Helper: Calculate performance impact based on response time
function calculatePerformanceImpact(responseTime: number): string {
  if (responseTime > 1000) {
    return "poor";
  }
  if (responseTime > 500) {
    return "moderate";
  }
  return "good";
}

// Helper: Build user-scoped custom dimensions
function buildUserScopedDimensions(
  sessionQuality: number,
  touchpoints: number
): Record<string, unknown> {
  return {
    user_segment: classifyUserSegment(sessionQuality, touchpoints),
    device_category: detectDeviceCategory(),
    coffee_experience: "beginner", // TODO: Implement user onboarding
    geographic_segment: classifyGeographicSegment(),
  };
}

// Helper: Build event-scoped custom dimensions
function buildEventScopedDimensions(
  event: EnhancedAnalyticsEvent,
  sessionQuality: number,
  trafficSource: string
): Record<string, unknown> {
  return {
    roaster_id: event.roaster_id,
    coffee_id: event.coffee_id,
    content_series: event.content_type,
    tool_type: event.custom_parameters?.tool_type,
    filter_combination: event.custom_parameters?.filter_combination,
    conversion_value: event.conversion_value || 0,
    traffic_source_detail: trafficSource,
    session_depth: classifySessionDepth(),
    performance_grade: event.response_time_ms
      ? calculatePerformanceGrade(event.response_time_ms)
      : "good",
    roaster_tier: getRoasterTier(event.roaster_id),
    purchase_intent: calculatePurchaseIntent(
      sessionQuality,
      event.event_name,
      event.custom_parameters?.click_type as string
    ),
  };
}

// Helper: Build attribution context
function buildAttributionContext(
  currentUTM: URLSearchParams,
  attribution: ReturnType<typeof getStoredAttribution>,
  sessionQuality: number
): Record<string, unknown> {
  return {
    utm_source: currentUTM.get("utm_source") || attribution.original_source,
    utm_campaign:
      currentUTM.get("utm_campaign") || attribution.original_campaign,
    utm_content: currentUTM.get("utm_content") || attribution.original_content,
    attribution_touchpoints: attribution.touchpoints,
    session_quality_score: sessionQuality,
    time_on_site: Math.floor(performance.now() / 1000),
    page_count: Number.parseInt(
      sessionStorage.getItem("icb_page_count") || "1",
      10
    ),
  };
}

// Helper: Send event to analytics services
function sendAnalyticsEvent(
  eventName: string,
  enhancedParams: Record<string, unknown>
): void {
  // Send to GA4 (using your existing gtag setup)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, enhancedParams);
  }

  // Send to your API endpoint (using your existing pattern)
  fetch("/api/analytics/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event: eventName,
      properties: enhancedParams,
      timestamp: Date.now(),
    }),
  }).catch(console.error);

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("[EnhancedAnalytics]", eventName, enhancedParams);
  }
}

// Enhanced Event Tracking (builds on your existing foundation)
export function trackEnhancedEvent(event: EnhancedAnalyticsEvent): void {
  if (!isProduction()) {
    console.log("[Dev] Analytics disabled:", event.event_name);
    return;
  }

  // Use your existing consent checking
  if (!hasAnalyticsConsent()) {
    return;
  }

  // Use your existing attribution system
  const attribution = getStoredAttribution();
  const sessionQuality = calculateSessionQuality();
  const currentUTM = new URLSearchParams(window.location.search);
  const trafficSource =
    currentUTM.get("utm_source") || attribution.original_source || "";

  // Build enhanced parameters with custom dimensions
  const enhancedParams = {
    // Basic event properties
    event_category: event.event_category,
    event_label: event.roaster_id || event.coffee_id || event.content_id,
    value: event.conversion_value,

    // Custom Dimensions (User-Scoped 1-4)
    ...buildUserScopedDimensions(sessionQuality, attribution.touchpoints),

    // Custom Dimensions (Event-Scoped 5-15)
    ...buildEventScopedDimensions(event, sessionQuality, trafficSource),

    // Performance Metrics
    response_time_ms: event.response_time_ms,
    result_count: event.result_count,
    cache_hit: event.cache_hit,

    // Attribution Context (from your existing system)
    ...buildAttributionContext(currentUTM, attribution, sessionQuality),

    // Custom Properties
    ...event.custom_parameters,
  };

  sendAnalyticsEvent(event.event_name, enhancedParams);
}

// Convenience Functions for Common Events

// Coffee Discovery Events
export function trackCoffeeDiscovery(
  coffeeId: string,
  roasterId: string,
  discoveryMethod: "search" | "filter" | "browse" | "recommendation",
  sourceData?: { resultCount?: number; responseTime?: number }
): void {
  markUserEngagement("content_read");

  trackEnhancedEvent({
    event_name: "coffee_discovered",
    event_category: "discovery",
    coffee_id: coffeeId,
    roaster_id: roasterId,
    response_time_ms: sourceData?.responseTime,
    result_count: sourceData?.resultCount,
    custom_parameters: {
      discovery_method: discoveryMethod,
      is_discovery_event: true,
    },
  });
}

// Roaster Engagement Events
export function trackRoasterEngagement(
  roasterId: string,
  engagementType: "profile_view" | "coffee_browse" | "contact_info_view",
  sourceData?: { coffeeCount?: number; sessionDuration?: number }
): void {
  markUserEngagement("content_read");

  trackEnhancedEvent({
    event_name: "roaster_engagement",
    event_category: "engagement",
    roaster_id: roasterId,
    custom_parameters: {
      engagement_type: engagementType,
      coffee_count: sourceData?.coffeeCount,
      session_duration: sourceData?.sessionDuration,
      is_roaster_engagement: true,
    },
  });
}

// Conversion Events (the money makers!)
export function trackRoasterConversion(
  roasterId: string,
  conversionType:
    | "website_click"
    | "social_click"
    | "phone_click"
    | "email_click",
  estimatedValue?: number
): void {
  markUserEngagement("link_click");

  trackEnhancedEvent({
    event_name: "roaster_conversion",
    event_category: "conversion",
    roaster_id: roasterId,
    conversion_value: estimatedValue,
    custom_parameters: {
      conversion_type: conversionType,
      is_conversion_event: true,
      is_high_value: estimatedValue && estimatedValue > 2,
    },
  });
}

// GA4 E-commerce: view_item (product detail page view)
export function trackCoffeeViewItem(params: {
  coffeeId: string;
  coffeeName: string;
  roasterName?: string;
  price?: number;
  currency?: string;
  inStock: boolean;
  rating?: number;
  ratingCount?: number;
}): void {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === "undefined" || !window.gtag) return;

  markUserEngagement("content_read");

  const item = {
    item_id: params.coffeeId,
    item_name: params.coffeeName,
    item_brand: params.roasterName || undefined,
    price: params.price ?? 0,
    quantity: 1,
  };

  window.gtag("event", "view_item", {
    currency: params.currency ?? "INR",
    value: params.price ?? 0,
    items: [item],
    // Custom params for reports (optional)
    coffee_id: params.coffeeId,
    in_stock: params.inStock,
    rating: params.rating,
    rating_count: params.ratingCount,
  });
}

// Coffee Purchase Intent Events
export function trackCoffeePurchaseIntent(
  coffeeId: string,
  roasterId: string,
  intentType: "purchase_link_click" | "price_check" | "rating_submission",
  coffeePrice?: number
): void {
  markUserEngagement("link_click");

  trackEnhancedEvent({
    event_name: "coffee_purchase_intent",
    event_category: "conversion",
    coffee_id: coffeeId,
    roaster_id: roasterId,
    conversion_value: coffeePrice ? coffeePrice * 0.05 : 2, // 5% estimated affiliate value
    custom_parameters: {
      intent_type: intentType,
      coffee_price: coffeePrice,
      is_purchase_intent: true,
      intent_strength: intentType === "purchase_link_click" ? "high" : "medium",
    },
  });
}

// Tools Engagement Events
export function trackToolsEngagement(
  toolType: "calculator" | "recipes" | "guides",
  engagementData: {
    sessionDuration: number;
    interactionCount: number;
    completionStatus: "started" | "partial" | "completed";
  }
): void {
  markUserEngagement("tool_use");

  trackEnhancedEvent({
    event_name: "tools_engagement",
    event_category: "engagement",
    custom_parameters: {
      tool_type: toolType,
      session_duration: engagementData.sessionDuration,
      interaction_count: engagementData.interactionCount,
      completion_status: engagementData.completionStatus,
      engagement_score: calculateEngagementScore(
        engagementData.sessionDuration
      ),
      is_tools_engagement: true,
    },
  });
}

// Content Engagement Events
export function trackContentEngagement(
  contentId: string,
  contentType: "article" | "recipe" | "guide",
  engagementData: {
    timeSpent: number;
    scrollDepth: number;
    completionRate: number;
  }
): void {
  markUserEngagement("content_read");

  trackEnhancedEvent({
    event_name: "content_engagement",
    event_category: "content",
    content_id: contentId,
    content_type: contentType,
    custom_parameters: {
      time_spent: engagementData.timeSpent,
      scroll_depth: engagementData.scrollDepth,
      completion_rate: engagementData.completionRate,
      content_value: calculateContentValue(engagementData.completionRate),
      is_content_engagement: true,
    },
  });
}

// Performance Monitoring Events
export function trackPerformanceEvent(
  performanceType: "search" | "filter" | "page_load",
  performanceData: {
    responseTime: number;
    resultCount?: number;
    cacheHit?: boolean;
    queryComplexity?: "simple" | "moderate" | "complex";
  }
): void {
  trackEnhancedEvent({
    event_name: "performance_metric",
    event_category: "performance",
    response_time_ms: performanceData.responseTime,
    result_count: performanceData.resultCount,
    cache_hit: performanceData.cacheHit,
    custom_parameters: {
      performance_type: performanceType,
      query_complexity: performanceData.queryComplexity,
      performance_impact: calculatePerformanceImpact(
        performanceData.responseTime
      ),
      is_performance_metric: true,
    },
  });
}
