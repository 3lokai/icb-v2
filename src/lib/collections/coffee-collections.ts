// src/lib/collections/coffee-collections.ts
import type { CoffeeFilters } from "@/types/coffee-types";

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
  filterUrl: string; // Full /coffee?... URL
  filters: CoffeeFilters; // Parsed filter object for programmatic use

  // UI/Visual
  imageUrl: string; // Background image for the card
  icon?: string; // Optional icon name (phosphor icon)
  accentColor?: string; // Optional theme color for the card

  // Meta
  featured?: boolean; // Show as hero on homepage
  sortOrder?: number; // Display order within tier
};

// ============================================================================
// CANON FLAVOR ID CONSTANTS
// ============================================================================
// These IDs are from canon_sensory_nodes table

const CANON_FLAVORS = {
  // Sweet & Chocolatey
  chocolate: "98bf4c2d-ef90-4e6e-9fd6-7e86c9213c9b",
  milk_chocolate: "3a977953-14cb-4d29-a080-768a61f70f7d",
  dark_chocolate: "75bbe726-69ac-4de7-a9f0-124acb96aee8",
  caramel: "288bc54b-c606-4dd4-bcac-1b49f5378575",
  honey: "6e3e1cac-b6bb-4117-8a10-cf6b912cd78d",
  brown_sugar: "7a7ae924-c101-4f71-81c0-bfff28035baf",

  // Nutty
  nuts: "5497743a-9207-4150-a190-4f19b33c67bf",
  hazelnut: "4086f7ee-b207-4b59-8ffd-f88ef059a0eb",
  almond: "89130b2b-9e58-4264-bddd-28da0db5ce9d",
  cashew: "73ea50f9-32fa-4ad1-994b-fd7d68a43309",
  peanut: "60007fbc-6a7e-4b6d-8af7-b972b42b072a",
  coconut: "0cbb5aee-1e80-488a-a112-c49abbb4ea4a",

  // Fruity - Berries
  berry_fresh: "fd50eb7b-3152-46c5-8e24-131455221393",
  blueberry: "e91314ab-1e47-4dff-af61-0a37b5ec082f",
  strawberry: "5fa8268b-c6c9-4222-b7f8-2d6583cfb694",
  raspberry: "1ffce3ab-df55-491c-bec2-98a7710f492c",
  blackberry: "8ca4cb0d-7396-49af-b50f-2bca2be1c457",
  cranberry: "4ba7261a-1887-4acc-8467-7994d9aa16c7",

  // Fruity - Citrus
  citrus: "63e2ef1b-2e4f-4695-b446-73a18fa61019",
  orange: "e1050e92-c1bf-494e-91f1-cd71a9c048c4",
  lemon: "0a2ad3d1-7faf-44a7-a04b-ba52ab6ce543",
  lime: "8097de3c-2bf0-437c-bbc1-098c9ef24fdb",
  grapefruit: "e6cd2866-df1c-4f68-87ab-f645534e4082",
  mandarin: "c9dbfbbe-2a3d-4d47-ab56-d129e25d27d1",
  bergamot: "f1386cc0-2dca-4a2e-be18-c4f65ff6cbcc",

  // Fruity - Tropical
  fruity: "5ccb6abc-47db-46a6-bf4c-d1d88b88128a",
  tropical: "cbc027fc-4dc1-4019-9a12-7ab53e944933", // mango
  pineapple: "d42e1975-494a-402b-801b-4c664a17e4bd",
  passion_fruit: "9decc12b-01b5-4b74-9e10-b6a3766cd767",
  guava: "31b6ed5e-1793-4d1a-8797-aee16cbae7aa",
  papaya: "8e5ec8f0-eef4-43f2-bcad-3e44c40a6b56",

  // Fruity - Stone Fruit
  cherry: "088316c9-be7f-494a-a5be-021847e9964e",
  peach: "e7540c42-0816-47fc-a5bc-d1ab988932b6",
  apricot: "6590e507-39ff-47db-b1ff-97b6f7aff197",
  plum: "db36fc7f-2c83-493a-86b9-1925347d2581",

  // Floral
  floral: "4dc2bb0d-5499-4d1a-8a97-739944fcef03",
  jasmine: "73d7f8d0-8975-437f-bc46-a0c660f32335",
  rose: "cfbf1301-d314-483b-95b8-fedc97a098c7",
  hibiscus: "4cd6dd98-b91b-4bc6-ba1b-97b99dbf9c93",
  lavender: "4c3ece9c-45b6-4618-a3d8-1e1083bd5bd0",

  // Earthy
  earthy: "da7cea69-e156-47f6-afd8-e781b6ee4263", // soil
  mushroom: "da1dd9da-67ae-48d4-a1db-f833919441a5",
  wet_earth: "86caef43-8ce8-4fa7-a2b1-5b0adda0bf92",

  // Attributes
  balanced_acidity: "64639573-2c33-4130-a896-192c9d83caaa",
  low_acidity: "469fbaa0-9ae4-4430-b5b7-0a9d21924df3",
  bright_acidity: "b60c1c0e-88c7-45e6-b425-78b5da090adb",
  medium_body: "5682297a-71cc-405c-bc5c-0200d9bd1d11",
  full_body: "98a987ff-73f4-404b-a8a6-c4d310ebe3ba",
  creamy_mouthfeel: "932953f8-ab8b-40c9-afa8-316c58c8689e",
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
    filterUrl:
      "/coffee?roastLevels=medium&processes=washed&inStockOnly=1&sort=rating_desc",
    filters: {
      roast_levels: ["medium"],
      processes: ["washed"],
      in_stock_only: true,
    },
    imageUrl: "/images/collections/beginner-friendly.jpg",
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
    filterUrl:
      "/coffee?roastLevels=medium,medium_dark&brewMethodIds=espresso,south_indian_filter&inStockOnly=1",
    filters: {
      roast_levels: ["medium", "medium_dark"],
      brew_method_ids: ["espresso", "south_indian_filter"],
      in_stock_only: true,
      canon_flavor_node_ids: [
        CANON_FLAVORS.chocolate,
        CANON_FLAVORS.caramel,
        CANON_FLAVORS.nuts,
      ],
    },
    imageUrl: "/images/collections/milk-friendly.jpg",
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
    filterUrl:
      "/coffee?roastLevels=light,light_medium&processes=natural,honey,anaerobic&brewMethodIds=pour_over&inStockOnly=1",
    filters: {
      roast_levels: ["light", "light_medium"],
      processes: ["natural", "honey", "anaerobic"],
      brew_method_ids: ["pour_over"],
      in_stock_only: true,
      canon_flavor_node_ids: [
        CANON_FLAVORS.berry_fresh,
        CANON_FLAVORS.citrus,
        CANON_FLAVORS.tropical,
        CANON_FLAVORS.fruity,
      ],
    },
    imageUrl: "/images/collections/fruity-filter-coffee.jpg",
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
    filterUrl:
      "/coffee?brewMethodIds=south_indian_filter,channi,coffee_filter&roastLevels=medium,medium_dark&processes=washed,pulped_natural&inStockOnly=1",
    filters: {
      brew_method_ids: ["south_indian_filter", "channi", "coffee_filter"],
      roast_levels: ["medium", "medium_dark"],
      processes: ["washed", "pulped_natural"],
      in_stock_only: true,
    },
    imageUrl: "/images/collections/south-indian-filter.jpg",
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
    filterUrl: "/coffee?roastLevels=medium&inStockOnly=1&sort=rating_desc",
    filters: {
      roast_levels: ["medium"],
      in_stock_only: true,
      canon_flavor_node_ids: [CANON_FLAVORS.balanced_acidity],
    },
    imageUrl: "/images/collections/balanced-medium.jpg",
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
    filterUrl:
      "/coffee?roastLevels=light&processes=washed,natural&brewMethodIds=pour_over,aeropress&inStockOnly=1",
    filters: {
      roast_levels: ["light"],
      processes: ["washed", "natural"],
      brew_method_ids: ["pour_over", "aeropress"],
      in_stock_only: true,
      canon_flavor_node_ids: [CANON_FLAVORS.bright_acidity],
    },
    imageUrl: "/images/collections/light-bright.jpg",
    sortOrder: 6,
  },

  {
    id: "low-acidity",
    name: "Low-Acidity Comfort Cups",
    tagline: "Smooth, forgiving, black-coffee friendly",
    description:
      "Gentle on the stomach. Low-acid coffees with chocolatey, earthy, or nutty profiles.",
    tier: "secondary",
    filterUrl:
      "/coffee?roastLevels=medium,medium_dark,dark&processes=washed,monsooned,pulped_natural&inStockOnly=1",
    filters: {
      roast_levels: ["medium", "medium_dark", "dark"],
      processes: ["washed", "monsooned", "pulped_natural"],
      in_stock_only: true,
      canon_flavor_node_ids: [
        CANON_FLAVORS.low_acidity,
        CANON_FLAVORS.chocolate,
        CANON_FLAVORS.nuts,
        CANON_FLAVORS.earthy,
      ],
    },
    imageUrl: "/images/collections/low-acidity.jpg",
    sortOrder: 7,
  },

  {
    id: "bold-dark",
    name: "Bold & Dark Roasts",
    tagline: "Heavy body, classic intensity",
    description:
      "For those who like it bold. Smoky, robust, and unapologetic. Perfect for strong filter coffee or espresso.",
    tier: "secondary",
    filterUrl:
      "/coffee?roastLevels=dark,medium_dark&inStockOnly=1&sort=rating_desc",
    filters: {
      roast_levels: ["dark", "medium_dark"],
      in_stock_only: true,
      canon_flavor_node_ids: [CANON_FLAVORS.full_body],
    },
    imageUrl: "/images/collections/bold-dark.jpg",
    sortOrder: 8,
  },

  {
    id: "experimental",
    name: "Experimental Processes",
    tagline: "Naturals, anaerobic, weird-but-fun",
    description:
      "Coffees for the adventurous. Funky fermentation, tropical fruit bombs, and unconventional processing.",
    tier: "secondary",
    filterUrl:
      "/coffee?processes=anaerobic,carbonic_maceration,double_fermented,experimental,natural&inStockOnly=1&sort=newest",
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
    imageUrl: "/images/collections/default-filter.jpg",
    sortOrder: 9,
  },

  {
    id: "single-estate",
    name: "Single-Estate Indian Coffees",
    tagline: "Traceable, origin-first",
    description:
      "Know your farmer. Single-estate lots with full transparency—region, altitude, varietal, and story.",
    tier: "secondary",
    filterUrl: "/coffee?inStockOnly=1&sort=rating_desc",
    filters: {
      in_stock_only: true,
      // Note: Requires estate filtering in actual implementation
      // estate_ids: [...], // Add when available
    },
    imageUrl: "/images/collections/default-filter.jpg",
    sortOrder: 10,
  },

  {
    id: "espresso-blends",
    name: "Espresso-Focused Blends",
    tagline: "Dial-in friendly, consistent",
    description:
      "Pre-dialed espresso coffees. Blends and single origins optimized for shot-pulling and milk drinks.",
    tier: "secondary",
    filterUrl:
      "/coffee?brewMethodIds=espresso&roastLevels=medium,medium_dark&inStockOnly=1&sort=rating_desc",
    filters: {
      brew_method_ids: ["espresso"],
      roast_levels: ["medium", "medium_dark"],
      in_stock_only: true,
    },
    imageUrl: "/images/collections/default-filter.jpg",
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
    filterUrl: "/coffee?maxPrice=600&sort=best_value&inStockOnly=1",
    filters: {
      max_price: 600,
      in_stock_only: true,
    },
    imageUrl: "/images/collections/default-filter.jpg",
    sortOrder: 12,
  },

  {
    id: "premium-microlots",
    name: "Premium & Microlots",
    tagline: "Limited, higher price, curiosity-driven",
    description:
      "Rare, competition-grade, or limited-edition coffees. For special occasions and deep exploration.",
    tier: "premium",
    filterUrl: "/coffee?minPrice=1000&limitedOnly=1&inStockOnly=1&sort=newest",
    filters: {
      min_price: 1000,
      limited_only: true,
      in_stock_only: true,
    },
    imageUrl: "/images/collections/default-filter.jpg",
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
