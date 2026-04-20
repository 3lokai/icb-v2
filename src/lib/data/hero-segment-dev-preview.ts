import "server-only";

import type { RecentlyViewedCoffeeItem } from "@/lib/data/fetch-recently-viewed-coffees";
import type {
  HeroRatedCoffee,
  HeroSegment,
  HeroSegmentPayload,
} from "@/types/hero-segment";

const MOCK_VIEWED: RecentlyViewedCoffeeItem[] = [
  {
    coffeeId: "00000000-0000-4000-8000-000000000001",
    name: "Preview coffee (dev)",
    coffeeSlug: "preview-coffee",
    roasterId: "00000000-0000-4000-8000-0000000000a1",
    roasterSlug: "preview-roaster",
    roasterName: "Preview Roaster",
    lastViewedAt: new Date().toISOString(),
    imageUrl: null,
  },
  {
    coffeeId: "00000000-0000-4000-8000-000000000002",
    name: "Another preview",
    coffeeSlug: "preview-coffee-2",
    roasterId: "00000000-0000-4000-8000-0000000000a1",
    roasterSlug: "preview-roaster",
    roasterName: "Preview Roaster",
    lastViewedAt: new Date().toISOString(),
    imageUrl: null,
  },
];

const MOCK_RATED: HeroRatedCoffee[] = [
  {
    coffeeId: "00000000-0000-4000-8000-000000000011",
    name: "Rated preview A",
    coffeeSlug: "rated-a",
    roasterSlug: "preview-roaster",
    roasterName: "Preview Roaster",
    imageUrl: null,
    rating: 4,
  },
  {
    coffeeId: "00000000-0000-4000-8000-000000000012",
    name: "Rated preview B",
    coffeeSlug: "rated-b",
    roasterSlug: "preview-roaster",
    roasterName: "Preview Roaster",
    imageUrl: null,
    rating: 5,
  },
  {
    coffeeId: "00000000-0000-4000-8000-000000000013",
    name: "Rated preview C",
    coffeeSlug: "rated-c",
    roasterSlug: "preview-roaster",
    roasterName: "Preview Roaster",
    imageUrl: null,
    rating: 3,
  },
];

/**
 * Development-only: force hero segment + plausible counts/lists for UI testing.
 * Ignored outside `NODE_ENV === "development"`.
 */
export function applyDevHeroSegmentPreview(
  base: HeroSegmentPayload,
  target: HeroSegment
): HeroSegmentPayload {
  const viewed =
    base.recentlyViewed.length > 0 ? base.recentlyViewed : MOCK_VIEWED;

  switch (target) {
    case "discovery":
      return {
        ...base,
        segment: "discovery",
        ratingCount: 0,
        recentlyViewed: [],
        ratedCoffees: [],
        isAuthenticated: false,
        displayNameShort: null,
        devSegmentPreview: target,
      };
    case "returning_browser":
      return {
        ...base,
        segment: "returning_browser",
        ratingCount: 0,
        recentlyViewed: viewed.slice(0, 3),
        ratedCoffees: [],
        isAuthenticated: false,
        devSegmentPreview: target,
      };
    case "rating_progress":
      return {
        ...base,
        segment: "rating_progress",
        ratingCount: 2,
        ratedCoffees:
          base.ratedCoffees.length >= 1
            ? base.ratedCoffees.slice(0, 2)
            : MOCK_RATED.slice(0, 2),
        recentlyViewed: base.recentlyViewed,
        isAuthenticated: base.isAuthenticated,
        devSegmentPreview: target,
      };
    case "anon_conversion":
      return {
        ...base,
        segment: "anon_conversion",
        ratingCount: 3,
        isAuthenticated: false,
        ratedCoffees:
          base.ratedCoffees.length >= 3
            ? base.ratedCoffees.slice(0, 3)
            : MOCK_RATED.slice(0, 3),
        recentlyViewed: base.recentlyViewed,
        devSegmentPreview: target,
      };
    case "authenticated_profile":
      return {
        ...base,
        segment: "authenticated_profile",
        ratingCount: Math.max(8, base.ratingCount),
        isAuthenticated: true,
        ratedCoffees:
          base.ratedCoffees.length >= 2
            ? base.ratedCoffees.slice(0, 3)
            : MOCK_RATED.slice(0, 2),
        recentlyViewed: base.recentlyViewed,
        devSegmentPreview: target,
      };
  }
}

export function parseDevHeroSegmentParam(
  raw: string | undefined | null
): HeroSegment | null {
  if (!raw || typeof raw !== "string") return null;
  const v = raw.trim();
  const allowed: HeroSegment[] = [
    "discovery",
    "returning_browser",
    "rating_progress",
    "anon_conversion",
    "authenticated_profile",
  ];
  return allowed.includes(v as HeroSegment) ? (v as HeroSegment) : null;
}
