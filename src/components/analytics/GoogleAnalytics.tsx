"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { storeAttributionData, getUTMParams } from "@/lib/analytics";

/**
 * UTM Parameter Tracking Component
 *
 * Note: Pageview tracking is handled automatically by Next.js GoogleAnalytics component
 * from @next/third-parties/google. This component only handles UTM parameter storage
 * for attribution tracking.
 */
export function Analytics() {
  const pathname = usePathname();

  // Store attribution data from UTM parameters on route changes
  useEffect(() => {
    if (!pathname || typeof window === "undefined") return;

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
