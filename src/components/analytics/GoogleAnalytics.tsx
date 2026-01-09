"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  initGA,
  pageview,
  storeAttributionData,
  getUTMParams,
  hasAnalyticsConsent,
} from "@/lib/analytics";

/**
 *  Analytics component that:
 * 1. Initializes GA on mount
 * 2. Tracks pageviews on route changes
 * 3. Tracks pageview when consent is granted (if not already tracked)
 * 4. Stores attribution data from UTM parameters
 */
export function Analytics() {
  const pathname = usePathname();
  const trackedPages = useRef<Set<string>>(new Set());

  // Initialize GA on mount - ensure consent is up-to-date
  // Note: Core initialization (dataLayer, gtag) is done via inline script in layout.tsx
  // This ensures it runs before hydration and before the external GA script loads
  useEffect(() => {
    // Update consent status (core initialization already done by inline script)
    initGA();

    // Mark initial page as tracked (inline script already called gtag('config') for it)
    // This prevents double-firing the initial pageview when component mounts
    // Use the same key format as the pageview tracking logic
    if (typeof window !== "undefined" && pathname) {
      const initialPageKey = `${pathname}${window.location.search}`;
      trackedPages.current.add(initialPageKey);
    }
  }, [pathname]);

  // Track pageviews and attribution on route changes
  // This works for all routes including dynamic routes like /coffees/[slug] and /roasters/[slug]
  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;

    // Get current URL with search params from window.location
    // This avoids the need for useSearchParams() which requires Suspense
    // For dynamic routes, pathname will be the actual path (e.g., "/coffees/coffee-slug")
    const url = window.location.pathname + window.location.search;
    const pageKey = `${pathname}${window.location.search}`;

    // Track pageview if consent is given
    if (hasAnalyticsConsent()) {
      // Only track if we haven't tracked this exact page yet
      // This prevents duplicate tracking when the component re-renders
      if (!trackedPages.current.has(pageKey)) {
        pageview(url);
        trackedPages.current.add(pageKey);
      }
    }

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

  // Track pageview when consent is granted (if not already tracked for current page)
  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;

    const trackCurrentPageIfConsented = () => {
      if (hasAnalyticsConsent()) {
        const url = window.location.pathname + window.location.search;
        const pageKey = `${pathname}${window.location.search}`;

        // Track if we haven't tracked this page yet
        if (!trackedPages.current.has(pageKey)) {
          pageview(url);
          trackedPages.current.add(pageKey);
        }
      }
    };

    // Check immediately in case consent was already given
    trackCurrentPageIfConsented();

    // Listen for consent changes (when user accepts cookies via storage event)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "icb-cookie-consent") {
        // Small delay to ensure consent state is updated
        setTimeout(trackCurrentPageIfConsented, 100);
      }
    };

    // Listen for storage events (cross-tab consent changes)
    window.addEventListener("storage", handleStorageChange);

    // Also listen for custom events that might be dispatched when consent changes
    const handleCustomEvent = () => {
      setTimeout(trackCurrentPageIfConsented, 100);
    };
    window.addEventListener("icb-consent-updated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("icb-consent-updated", handleCustomEvent);
    };
  }, [pathname]);

  return null;
}
