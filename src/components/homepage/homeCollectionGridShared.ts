import type { IconName } from "@/components/common/Icon";
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

export type FilterOption = {
  label: string;
  icon: IconName;
  href: string;
  description: string;
};

export const filterOptions: FilterOption[] = [
  {
    label: "By Brew Method",
    icon: "Funnel",
    href: "/coffees?groupBy=brew_method",
    description: "Espresso, Pour Over, AeroPress...",
  },
  {
    label: "By Roast Level",
    icon: "Fire",
    href: "/coffees?groupBy=roast_level",
    description: "Light, Medium, Dark roasts...",
  },
  {
    label: "By Flavor",
    icon: "Sparkle",
    href: "/coffees?groupBy=flavor",
    description: "Fruity, Nutty, Chocolatey...",
  },
  {
    label: "By Roaster",
    icon: "Storefront",
    href: "/coffees?groupBy=roaster",
    description: "Explore India's top roasters",
  },
];
