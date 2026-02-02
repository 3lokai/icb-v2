// src/lib/analytics/filter-tracking.ts
// Analytics utilities for filter usage and cache metrics

import { hasAnalyticsConsent } from "./index";

export type FilterAnalyticsEvent =
  | "filter_applied"
  | "filter_cleared"
  | "filter_abandoned"
  | "search_performed"
  | "query_cache_hit";

export type FilterAnalyticsPayload = {
  event: FilterAnalyticsEvent;
  entity?: "coffees" | "roasters" | "regions";
  filters?: Record<string, unknown>;
  searchQuery?: string;
  resultCount?: number;
  cacheHit?: boolean;
  responseTimeMs?: number;
  timestamp?: number;
  [key: string]: unknown;
};

export function trackFilterEvent(payload: FilterAnalyticsPayload) {
  if (!hasAnalyticsConsent()) return;
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", payload.event, payload);

  if (process.env.NODE_ENV === "development") {
    console.log("[FilterAnalytics]", payload);
  }
}

// Example usage:
// trackFilterEvent({ event: 'filter_applied', entity: 'coffees', filters, resultCount, responseTimeMs });
