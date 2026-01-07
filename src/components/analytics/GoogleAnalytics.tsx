"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  initGA,
  pageview,
  storeAttributionData,
  getUTMParams,
} from "@/lib/analytics";

/**
 * Google Analytics component that:
 * 1. Initializes GA on mount
 * 2. Tracks pageviews on route changes
 * 3. Stores attribution data from UTM parameters
 */
export function GoogleAnalytics() {
  const pathname = usePathname();

  // Initialize GA on mount
  useEffect(() => {
    initGA();
  }, []);

  // Track pageviews and attribution on route changes
  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;

    // Get current URL with search params from window.location
    // This avoids the need for useSearchParams() which requires Suspense
    const url = window.location.pathname + window.location.search;

    // Track pageview
    pageview(url);

    // Store attribution data if UTM parameters are present
    const utmParams = getUTMParams();
    if (
      utmParams.utm_source ||
      utmParams.utm_campaign ||
      utmParams.utm_content
    ) {
      storeAttributionData(utmParams);
    }
  }, [pathname]);

  return null;
}
