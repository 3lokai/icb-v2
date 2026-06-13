import type { CollectionTier } from "@/lib/collections/coffee-collections";

export type HomeCollectionGridProps = {
  tier?: CollectionTier;
  showFeatured?: boolean;
  maxItems?: number;
  coffeeCountMap?: Record<string, number>;
  className?: string;
  overline?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  mobileDecorativeText?: string;
};
