// src/lib/discovery/landing-pages/index.ts
import { beanTypePages } from "./bean-type-pages";
import { brewMethodPages } from "./brew-method-pages";
import { priceBucketPages } from "./price-bucket-pages";
import { processPages } from "./process-pages";
import { regionPages } from "./region-pages";
import { roastLevelPages } from "./roast-level-pages";
import type { LandingPageConfig } from "./types";

export type {
  BeanTypeProfileConfig,
  BrewMethodProfileConfig,
  FAQItem,
  LandingPageConfig,
  LandingPageType,
  PriceBucketProfileConfig,
  ProcessProfileConfig,
  RegionProfileConfig,
  RoastLevelLandingPageConfig,
  RoastProfileConfig,
  UtilityCardConfig,
  UtilityCardType,
} from "./types";
export { discoveryPagePath, discoverySlugSchema } from "./paths";

/**
 * Landing page configurations (order preserved for sitemap / static params)
 */
export const LANDING_PAGES: LandingPageConfig[] = [
  ...brewMethodPages,
  ...roastLevelPages,
  ...priceBucketPages,
  ...processPages,
  ...regionPages,
  ...beanTypePages,
];

// Dev-only so bundlers can DCE this side effect and tree-shake LANDING_PAGES
// out of client bundles that only import discoveryPagePath from this barrel.
if (process.env.NODE_ENV !== "production") {
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
