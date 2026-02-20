// src/lib/collections/coffee-collections.ts
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";
import { buildCoffeeQueryString } from "@/lib/filters/coffee-url";

// ============================================================================
// COLLECTION TYPES
// ============================================================================

export type CollectionTier = "core" | "secondary" | "premium";

export type CoffeeCollection = {
  id: string; // URL-friendly slug
  name: string;
  tagline: string;
  description: string;
  tier: CollectionTier;

  // Filtering
  filters: CoffeeFilters; // Parsed filter object for programmatic use
  sort?: CoffeeSort; // Optional sort override (defaults to "relevance")
  page?: number; // Optional page override (defaults to 1)
  limit?: number; // Optional limit override (defaults to 15)

  // UI/Visual
  imageUrl: string; // Background image for the card
  icon?: string; // Optional icon name (phosphor icon)
  accentColor?: string; // Optional theme color for the card

  // Meta
  featured?: boolean; // Show as hero on homepage
  sortOrder?: number; // Display order within tier
};

/**
 * Get the filter URL for a collection
 * Generated from filters object to ensure consistency
 */
export function getCollectionFilterUrl(collection: CoffeeCollection): string {
  const queryString = buildCoffeeQueryString(
    collection.filters,
    collection.page ?? 1,
    collection.sort ?? "relevance",
    collection.limit ?? 15
  );
  return `/coffees?${queryString}`;
}

// ============================================================================
// CANON FLAVOR SLUG CONSTANTS
// ============================================================================
// These slugs are from canon_sensory_nodes table (human-readable, URL-safe)

const CANON_FLAVOR_SLUGS = {
  // Sweet & Chocolatey
  chocolate: "chocolate",
  milk_chocolate: "milk-chocolate",
  dark_chocolate: "dark-chocolate",
  caramel: "caramel",
  honey: "honey",
  brown_sugar: "brown-sugar",

  // Nutty
  nuts: "nuts",
  hazelnut: "hazelnut",
  almond: "almond",
  cashew: "cashew",
  peanut: "peanut",
  coconut: "coconut",

  // Fruity - Berries
  berry_fresh: "berry-fresh",
  blueberry: "blueberry",
  strawberry: "strawberry",
  raspberry: "raspberry",
  blackberry: "blackberry",
  cranberry: "cranberry",

  // Fruity - Citrus
  citrus: "citrus",
  orange: "orange",
  lemon: "lemon",
  lime: "lime",
  grapefruit: "grapefruit",
  mandarin: "mandarin",
  bergamot: "bergamot",

  // Fruity - Tropical
  fruity: "fruity",
  tropical: "mango", // tropical maps to mango slug
  pineapple: "pineapple",
  passion_fruit: "passion-fruit",
  guava: "guava",
  papaya: "papaya",

  // Fruity - Stone Fruit
  cherry: "cherry",
  peach: "peach",
  apricot: "apricot",
  plum: "plum",

  // Floral
  floral: "floral",
  jasmine: "jasmine",
  rose: "rose",
  hibiscus: "hibiscus",
  lavender: "lavender",

  // Earthy
  earthy: "soil", // earthy maps to soil slug
  mushroom: "mushroom",
  wet_earth: "wet-earth",

  // Attributes
  balanced_acidity: "balanced-acidity",
  low_acidity: "low-acidity",
  bright_acidity: "bright-acidity",
  medium_body: "medium-body",
  full_body: "full-body",
  creamy_mouthfeel: "creamy-mouthfeel",
} as const;

// ============================================================================
// COLLECTION DEFINITIONS
// ============================================================================

export const COFFEE_COLLECTIONS: CoffeeCollection[] = [
  // -------------------------------------------------------------------------
  // CORE / HIGH-SIGNAL COLLECTIONS
  // -------------------------------------------------------------------------
  {
    id: "beginner-friendly",
    name: "Beginner-Friendly Indian Coffees",
    tagline: "Easy, balanced, zero anxiety",
    description:
      "Perfect first specialty coffee. Smooth, forgiving, and approachable profiles from trusted Indian roasters.",
    tier: "core",
    filters: {
      roast_levels: ["medium"],
      processes: ["washed"],
      in_stock_only: true,
    },
    sort: "rating_desc",
    imageUrl: "/images/collections/beginner-friendly.webp",
    featured: false,
    sortOrder: 1,
  },

  {
    id: "milk-friendly",
    name: "Milk-Friendly Daily Drivers",
    tagline: "Chocolatey, nutty, works every morning",
    description:
      "Coffees that shine in milk. Rich, sweet, and built for your daily ritual—cappuccino, latte, or filter coffee.",
    tier: "core",
    filters: {
      roast_levels: ["medium", "medium_dark"],
      brew_method_ids: ["espresso", "south_indian_filter"],
      in_stock_only: true,
      canon_flavor_slugs: [
        CANON_FLAVOR_SLUGS.chocolate,
        CANON_FLAVOR_SLUGS.caramel,
        CANON_FLAVOR_SLUGS.nuts,
      ],
    },
    imageUrl: "/images/collections/milk-friendly.webp",
    featured: true, // Hero collection
    sortOrder: 2,
  },

  {
    id: "fruity-filter",
    name: "Fruity Filter Bangers",
    tagline: "Bright, juicy, pour-over favourites",
    description:
      "Light roasts bursting with berry, citrus, and tropical notes. Best enjoyed black in a V60 or Chemex.",
    tier: "core",
    filters: {
      roast_levels: ["light", "light_medium"],
      processes: ["natural", "honey", "anaerobic"],
      brew_method_ids: ["pour_over"],
      in_stock_only: true,
      canon_flavor_slugs: [
        CANON_FLAVOR_SLUGS.berry_fresh,
        CANON_FLAVOR_SLUGS.citrus,
        CANON_FLAVOR_SLUGS.tropical,
        CANON_FLAVOR_SLUGS.fruity,
      ],
    },
    imageUrl: "/images/collections/fruity-filter.webp",
    featured: false,
    sortOrder: 3,
  },

  {
    id: "south-indian-filter",
    name: "South Indian Filter Upgrades",
    tagline: "Heritage profiles, cleaner & sweeter",
    description:
      "Specialty takes on the classic South Indian filter coffee. Chicory-free, traceable, and roasted for depth without bitterness.",
    tier: "core",
    filters: {
      brew_method_ids: ["south_indian_filter", "channi", "coffee_filter"],
      roast_levels: ["medium", "medium_dark"],
      processes: ["washed", "pulped_natural"],
      in_stock_only: true,
    },
    imageUrl: "/images/collections/south-indian-filter.webp",
    featured: false,
    sortOrder: 4,
  },

  {
    id: "balanced-medium",
    name: "Balanced Medium Roasts",
    tagline: "The 'safe but good' middle",
    description:
      "Versatile, approachable, and reliable. Works black or with milk, suitable for any brew method.",
    tier: "core",
    filters: {
      roast_levels: ["medium"],
      in_stock_only: true,
      canon_flavor_slugs: [CANON_FLAVOR_SLUGS.balanced_acidity],
    },
    sort: "rating_desc",
    imageUrl: "/images/collections/balanced-medium.webp",
    featured: false,
    sortOrder: 5,
  },

  // -------------------------------------------------------------------------
  // SECONDARY / ENTHUSIAST COLLECTIONS
  // -------------------------------------------------------------------------
  {
    id: "light-bright",
    name: "Light & Bright Coffees",
    tagline: "High acidity, clarity-forward",
    description:
      "Ultra-light roasts for the clarity-obsessed. Tea-like body, explosive aromatics, delicate extraction required.",
    tier: "secondary",
    filters: {
      roast_levels: ["light"],
      processes: ["washed", "natural"],
      brew_method_ids: ["pour_over", "aeropress"],
      in_stock_only: true,
      canon_flavor_slugs: [CANON_FLAVOR_SLUGS.bright_acidity],
    },
    imageUrl: "/images/collections/light-bright.webp",
    sortOrder: 6,
  },

  {
    id: "low-acidity",
    name: "Low-Acidity Comfort Cups",
    tagline: "Smooth, forgiving, black-coffee friendly",
    description:
      "Gentle on the stomach. Low-acid coffees with chocolatey, earthy, or nutty profiles.",
    tier: "secondary",
    filters: {
      roast_levels: ["medium", "medium_dark", "dark"],
      processes: ["washed", "monsooned", "pulped_natural"],
      in_stock_only: true,
      canon_flavor_slugs: [
        CANON_FLAVOR_SLUGS.low_acidity,
        CANON_FLAVOR_SLUGS.chocolate,
        CANON_FLAVOR_SLUGS.nuts,
        CANON_FLAVOR_SLUGS.earthy,
      ],
    },
    imageUrl: "/images/collections/low-acidity.webp",
    sortOrder: 7,
  },

  {
    id: "bold-dark",
    name: "Bold & Dark Roasts",
    tagline: "Heavy body, classic intensity",
    description:
      "For those who like it bold. Smoky, robust, and unapologetic. Perfect for strong filter coffee or espresso.",
    tier: "secondary",
    filters: {
      roast_levels: ["dark", "medium_dark"],
      in_stock_only: true,
      canon_flavor_slugs: [CANON_FLAVOR_SLUGS.full_body],
    },
    sort: "rating_desc",
    imageUrl: "/images/collections/bold-dark.webp",
    sortOrder: 8,
  },

  {
    id: "experimental",
    name: "Experimental Processes",
    tagline: "Naturals, anaerobic, weird-but-fun",
    description:
      "Coffees for the adventurous. Funky fermentation, tropical fruit bombs, and unconventional processing.",
    tier: "secondary",
    filters: {
      processes: [
        "anaerobic",
        "carbonic_maceration",
        "double_fermented",
        "experimental",
        "natural",
      ],
      in_stock_only: true,
    },
    sort: "newest",
    imageUrl: "/images/collections/default-filter.webp",
    sortOrder: 9,
  },

  {
    id: "single-estate",
    name: "Single-Estate Indian Coffees",
    tagline: "Traceable, origin-first",
    description:
      "Know your farmer. Single-estate lots with full transparency—region, altitude, varietal, and story.",
    tier: "secondary",
    filters: {
      in_stock_only: true,
      // Note: Requires estate filtering in actual implementation
      // estate_ids: [...], // Add when available
    },
    sort: "rating_desc",
    imageUrl: "/images/collections/default-filter.webp",
    sortOrder: 10,
  },

  {
    id: "espresso-blends",
    name: "Espresso-Focused Blends",
    tagline: "Dial-in friendly, consistent",
    description:
      "Pre-dialed espresso coffees. Blends and single origins optimized for shot-pulling and milk drinks.",
    tier: "secondary",
    filters: {
      brew_method_ids: ["espresso"],
      roast_levels: ["medium", "medium_dark"],
      in_stock_only: true,
    },
    sort: "rating_desc",
    imageUrl: "/images/collections/default-filter.webp",
    sortOrder: 11,
  },

  // -------------------------------------------------------------------------
  // PREMIUM / VALUE COLLECTIONS
  // -------------------------------------------------------------------------
  {
    id: "great-value",
    name: "Great Value Picks",
    tagline: "Affordable without tasting cheap",
    description:
      "Best bang-for-buck coffees. High ratings, low prices, and proven crowd-pleasers.",
    tier: "premium",
    filters: {
      max_price: 600,
      in_stock_only: true,
    },
    sort: "best_value",
    imageUrl: "/images/collections/default-filter.webp",
    sortOrder: 12,
  },

  {
    id: "premium-microlots",
    name: "Premium & Microlots",
    tagline: "Limited, higher price, curiosity-driven",
    description:
      "Rare, competition-grade, or limited-edition coffees. For special occasions and deep exploration.",
    tier: "premium",
    filters: {
      min_price: 1000,
      limited_only: true,
      in_stock_only: true,
    },
    sort: "newest",
    imageUrl: "/images/collections/default-filter.webp",
    sortOrder: 13,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get collection by ID
 */
export function getCollectionById(id: string): CoffeeCollection | undefined {
  return COFFEE_COLLECTIONS.find((c) => c.id === id);
}

/**
 * Filter collections by tier
 */
export function getCollectionsByTier(tier: CollectionTier): CoffeeCollection[] {
  return COFFEE_COLLECTIONS.filter((c) => c.tier === tier).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
}

/**
 * Get featured/hero collection for homepage
 */
export function getFeaturedCollection(): CoffeeCollection | undefined {
  return COFFEE_COLLECTIONS.find((c) => c.featured === true);
}

/**
 * Get all core collections for homepage
 */
export function getCoreCollections(): CoffeeCollection[] {
  return getCollectionsByTier("core");
}

/**
 * Get collection count for a specific tier
 */
export function getCollectionCountByTier(tier: CollectionTier): number {
  return getCollectionsByTier(tier).length;
}
