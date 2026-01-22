import type {
  BrewMethod,
  CoffeeEstate,
  CoffeeImage,
  CoffeeRegion,
  CoffeeRoasterEmbedded,
  CoffeeSensory,
  CoffeeSummaryData,
  CoffeeVariant,
  FlavorNote,
} from "./coffee-component-types";
import type {
  CoffeeStatusEnum,
  GrindEnum,
  Json,
  ProcessEnum,
  RoastLevelEnum,
  SpeciesEnum,
} from "./db-enums";

// ============================================================================
// COFFEE TYPES
// ============================================================================

// ----------------------------------------------------------------------------
// 1. Coffee Page Type - CoffeeDetail
// ----------------------------------------------------------------------------

export type CoffeeDetail = {
  // From coffees table
  id: string;
  slug: string;
  name: string;
  roaster_id: string;
  description_md: string | null;
  direct_buy_url: string | null;
  status: CoffeeStatusEnum;
  is_coffee: boolean | null;
  is_limited: boolean;
  decaf: boolean;
  crop_year: number | null;
  harvest_window: string | null;
  roast_level: RoastLevelEnum | null;
  roast_level_raw: string | null;
  roast_style_raw: string | null;
  process: ProcessEnum | null;
  process_raw: string | null;
  bean_species: SpeciesEnum | null;
  default_grind: GrindEnum | null;
  varieties: string[] | null;
  tags: string[] | null;
  rating_avg: number | null;
  rating_count: number;

  // Embedded roaster block
  roaster: CoffeeRoasterEmbedded;

  // Variants array
  variants: CoffeeVariant[];

  // Images array
  images: CoffeeImage[];

  // Sensory params (one-to-one, nullable)
  sensory: CoffeeSensory | null;

  // Flavor notes array
  flavor_notes: FlavorNote[];

  // Brew methods array
  brew_methods: BrewMethod[];

  // Regions array (with pct from junction)
  regions: CoffeeRegion[];

  // Estates array (with pct from junction)
  estates: CoffeeEstate[];

  // Summary from coffee_summary view
  summary: CoffeeSummaryData;

  // Reviews array
  reviews?: CoffeeReview[];
};

// ----------------------------------------------------------------------------
// 2. Coffee Filter Types
// ----------------------------------------------------------------------------

export type CoffeeSort =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "newest"
  | "best_value"
  | "rating_desc"
  | "name_asc";

export type CoffeeFilters = {
  // Text search
  q?: string;

  // Enum filters
  status?: CoffeeStatusEnum[];
  roast_levels?: RoastLevelEnum[];
  processes?: ProcessEnum[];
  bean_species?: SpeciesEnum[];

  // Boolean flags
  decaf_only?: boolean;
  limited_only?: boolean;
  in_stock_only?: boolean;
  has_250g_only?: boolean;
  has_sensory_only?: boolean;

  // Numeric
  min_price?: number;
  max_price?: number;

  // Origin
  region_ids?: string[];
  estate_ids?: string[];

  // Flavor & brew
  flavor_keys?: string[]; // Legacy - kept for backward compatibility
  canon_flavor_node_ids?: string[]; // UUIDs from canon_sensory_nodes
  brew_method_ids?: string[];

  // Roasters
  roaster_ids?: string[];

  // IDs (from Fuse search)
  coffee_ids?: string[];
};

export type CoffeeFilterMeta = {
  flavorNotes: Array<{ id: string; label: string; count: number }>; // Legacy
  canonicalFlavors: Array<{
    id: string; // UUID from canon_sensory_nodes
    slug: string;
    descriptor: string; // Display label
    subcategory: string;
    family: string;
    count: number;
  }>;
  regions: Array<{ id: string; label: string; count: number }>;
  estates: Array<{ id: string; label: string; count: number }>;
  brewMethods: Array<{ id: string; label: string; count: number }>;
  roasters: Array<{ id: string; label: string; count: number }>;
  roastLevels: Array<{ value: RoastLevelEnum; label: string; count: number }>;
  processes: Array<{ value: ProcessEnum; label: string; count: number }>;
  statuses: Array<{ value: CoffeeStatusEnum; label: string; count: number }>;
  totals: {
    coffees: number;
    roasters: number;
  };
};

// ----------------------------------------------------------------------------
// 3. Coffee UI Types
// ----------------------------------------------------------------------------

export type CoffeeSummary = {
  // From coffee_summary view
  coffee_id: string | null;
  slug: string | null;
  name: string | null;
  roaster_id: string | null;
  status: CoffeeStatusEnum | null;
  process: ProcessEnum | null;
  process_raw: string | null;
  roast_level: RoastLevelEnum | null;
  roast_level_raw: string | null;
  roast_style_raw: string | null;
  direct_buy_url: string | null;
  has_250g_bool: boolean | null;
  has_sensory: boolean | null;
  in_stock_count: number | null;
  min_price_in_stock: number | null;
  best_variant_id: string | null;
  best_normalized_250g: number | null;
  weights_available: number[] | null;
  sensory_public: Json | null;
  sensory_updated_at: string | null;

  // From coffees table
  decaf: boolean;
  is_limited: boolean;
  bean_species: SpeciesEnum | null;
  rating_avg: number | null;
  rating_count: number;
  tags: string[] | null;

  // From roasters table
  roaster_slug: string;
  roaster_name: string;
  hq_city: string | null;
  hq_state: string | null;
  hq_country: string | null;
  website: string | null;

  // Optional first image
  image_url?: string | null;

  // Junction table arrays (from coffee_directory_mv)
  flavor_keys?: string[] | null;
  brew_method_canonical_keys?: string[] | null;
};

export type CoffeeCardData = {
  // Identity
  slug: string;
  name: string;
  roasterSlug: string;
  roasterName: string;

  // Location
  roasterCity: string | null;
  roasterCountry: string | null;

  // Display
  imageUrl: string | null;
  roastLevel: RoastLevelEnum | null;
  process: ProcessEnum | null;

  // Commerce
  minPriceInStock: number | null;
  bestNormalized250g: number | null;
  has250g: boolean | null;
  inStockCount: number | null;
  directBuyUrl: string | null;

  // Flags / badges
  decaf: boolean;
  isLimited: boolean;
  hasSensory: boolean | null;

  // Social proof
  ratingAvg: number | null;
  ratingCount: number;
};

// ----------------------------------------------------------------------------
// 4. Coffee List Response Type
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// 5. Coffee Review Types
// ----------------------------------------------------------------------------

export type CoffeeReview = {
  id: string;
  coffee_id: string;
  user_id: string;
  rating: number;
  content: string | null;
  brew_method_id: string | null;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;

  // Optional expanded data
  user_profile?: {
    full_name: string;
    avatar_url: string | null;
    username: string | null;
  };
  brew_method?: {
    label: string;
    key: string;
  };
};

export type CoffeeListResponse = {
  items: CoffeeSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
