// src/lib/discovery/landing-pages/index.ts
import { brewMethodPages } from "./brew-method-pages";
import { priceBucketPages } from "./price-bucket-pages";
import { processPages } from "./process-pages";
import { regionPages } from "./region-pages";
import { roastLevelPages } from "./roast-level-pages";
import type { LandingPageConfig } from "./types";

export type {
  FAQItem,
  LandingPageConfig,
  LandingPageType,
  RoastLevelLandingPageConfig,
  RoastProfileConfig,
  UtilityCardConfig,
  UtilityCardType,
} from "./types";
export { discoveryPagePath } from "./paths";

/**
 * Landing page configurations (order preserved for sitemap / static params)
 */
export const LANDING_PAGES: LandingPageConfig[] = [
  ...brewMethodPages,
  ...roastLevelPages,
  ...priceBucketPages,
  ...processPages,
  ...regionPages,
];

if (process.env.NODE_ENV === "development") {
  const slugs = LANDING_PAGES.map((page) => page.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Duplicate discovery landing page slug in LANDING_PAGES");
  }
}

/**
 * Get landing page config by slug
 */
export function getLandingPageConfig(
  slug: string
): LandingPageConfig | undefined {
  return LANDING_PAGES.find((page) => page.slug === slug);
}

/**
 * Get all landing page slugs
 */
export function getAllLandingPageSlugs(): string[] {
  return LANDING_PAGES.map((page) => page.slug);
}
