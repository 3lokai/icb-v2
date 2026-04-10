// src/components/common/TrackingLink.tsx
"use client";

import Link from "next/link";
import {
  trackCoffeeDiscovery,
  trackCuratorEngagement,
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
  // Curator tracking props
  curatorId?: string | null;
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

export function CuratorTrackingLink({
  href,
  ariaLabel,
  children,
  curatorId,
}: Pick<TrackingLinkProps, "href" | "ariaLabel" | "children" | "curatorId">) {
  const handleClick = () => {
    if (curatorId) {
      trackCuratorEngagement(curatorId, "listing_click");
    }
  };

  return (
    <Link
      aria-label={ariaLabel}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      href={href}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
