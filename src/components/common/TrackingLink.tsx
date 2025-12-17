// src/components/common/TrackingLink.tsx
"use client";

import Link from "next/link";
import {
  trackCoffeeDiscovery,
  trackRoasterEngagement,
} from "@/lib/analytics/enhanced-tracking";

type TrackingLinkProps = {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
  // Coffee tracking props
  coffeeId?: string | null;
  roasterId?: string | null;
  // Roaster tracking props
  roasterOnlyId?: string | null;
  coffeeCount?: number | null;
};

export function CoffeeTrackingLink({
  href,
  ariaLabel,
  children,
  coffeeId,
  roasterId,
}: TrackingLinkProps) {
  const handleClick = () => {
    if (coffeeId && roasterId) {
      trackCoffeeDiscovery(coffeeId, roasterId, "browse", {
        resultCount: undefined,
        responseTime: undefined,
      });
    }
  };

  return (
    <Link aria-label={ariaLabel} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}

export function RoasterTrackingLink({
  href,
  ariaLabel,
  children,
  roasterOnlyId,
  coffeeCount,
}: TrackingLinkProps) {
  const handleClick = () => {
    if (roasterOnlyId) {
      trackRoasterEngagement(roasterOnlyId, "profile_view", {
        coffeeCount: coffeeCount || undefined,
        sessionDuration: undefined,
      });
    }
  };

  return (
    <Link aria-label={ariaLabel} href={href} onClick={handleClick}>
      {children}
    </Link>
  );
}
