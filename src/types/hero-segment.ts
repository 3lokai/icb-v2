/**
 * Homepage hero personalization (segment + v1 payload).
 */

import type { RecentlyViewedCoffeeItem } from "@/lib/data/fetch-recently-viewed-coffees";

export type HeroSegment =
  | "discovery"
  | "returning_browser"
  | "rating_progress"
  | "anon_conversion"
  | "authenticated_profile";

/** All segments (e.g. dev preview toggle labels) */
export const HERO_SEGMENT_OPTIONS: {
  value: HeroSegment;
  label: string;
}[] = [
  { value: "discovery", label: "Discovery" },
  { value: "returning_browser", label: "Returning" },
  { value: "rating_progress", label: "Progress 1–2" },
  { value: "anon_conversion", label: "Anon cap" },
  { value: "authenticated_profile", label: "Profile 3+" },
];

export type HeroRatedCoffee = {
  coffeeId: string;
  name: string;
  coffeeSlug: string;
  roasterSlug: string;
  roasterName: string;
  imageUrl: string | null;
  rating: number | null;
};

export type HeroSegmentPayload = {
  segment: HeroSegment;
  ratingCount: number;
  recentlyViewed: RecentlyViewedCoffeeItem[];
  ratedCoffees: HeroRatedCoffee[];
  isAuthenticated: boolean;
  /** First name from profile, or username — for personalized eyebrow when signed in */
  displayNameShort: string | null;
  /** Set in development when `?heroSegment=` preview is active */
  devSegmentPreview?: HeroSegment;
};
