import type {
  CoffeeStatusEnum,
  GrindEnum,
  Json,
  ProcessEnum,
  RoastLevelEnum,
  SensoryConfidenceEnum,
  SensorySourceEnum,
} from "./db-enums";

// ============================================================================
// COFFEE COMPONENT TYPES
// Reusable types for coffee-related entities
// ============================================================================

// ----------------------------------------------------------------------------
// Variant Types
// ----------------------------------------------------------------------------

export type CoffeeVariant = {
  id: string;
  coffee_id: string;
  platform_variant_id: string | null;
  sku: string | null;
  barcode: string | null;
  weight_g: number;
  grind: GrindEnum | null;
  pack_count: number;
  currency: string;
  price_current: number | null;
  compare_at_price: number | null;
  in_stock: boolean;
  stock_qty: number | null;
  subscription_available: boolean;
  status: string | null;
  created_at: string;
  updated_at: string;
  last_seen_at: string | null;
  price_last_checked_at: string | null;
};

// ----------------------------------------------------------------------------
// Image Types
// ----------------------------------------------------------------------------

export type CoffeeImage = {
  id: string;
  coffee_id: string;
  imagekit_url: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
};

// ----------------------------------------------------------------------------
// Sensory Types
// ----------------------------------------------------------------------------

export type CoffeeSensory = {
  acidity: number | null;
  sweetness: number | null;
  bitterness: number | null;
  body: number | null;
  aftertaste: number | null;
  clarity: number | null;
  confidence: SensoryConfidenceEnum | null;
  source: SensorySourceEnum | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// ----------------------------------------------------------------------------
// Flavor Note Types
// ----------------------------------------------------------------------------

export type FlavorNote = {
  id: string;
  key: string;
  label: string;
  group_key: string | null;
};

// ----------------------------------------------------------------------------
// Brew Method Types
// ----------------------------------------------------------------------------

export type BrewMethod = {
  id: string;
  key: string;
  label: string;
};

// ----------------------------------------------------------------------------
// Origin Types (Regions & Estates)
// ----------------------------------------------------------------------------

export type CoffeeRegion = {
  id: string;
  display_name: string | null;
  country: string | null;
  state: string | null;
  subregion: string;
  pct: number | null;
};

export type CoffeeEstate = {
  id: string;
  name: string;
  region_id: string | null;
  altitude_min_m: number | null;
  altitude_max_m: number | null;
  notes: string | null;
  pct: number | null;
};

// ----------------------------------------------------------------------------
// Region Base Type (from regions table)
// ----------------------------------------------------------------------------

export type RegionBase = {
  id: string;
  display_name: string | null;
  country: string | null;
  state: string | null;
  subregion: string;
};

// ----------------------------------------------------------------------------
// Estate Base Type (from estates table)
// ----------------------------------------------------------------------------

export type EstateBase = {
  id: string;
  name: string;
  estate_key: string;
  region_id: string | null;
  altitude_min_m: number | null;
  altitude_max_m: number | null;
  notes: string | null;
};

// ----------------------------------------------------------------------------
// Roaster Embedded Type (for use in CoffeeDetail)
// ----------------------------------------------------------------------------

export type CoffeeRoasterEmbedded = {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  hq_city: string | null;
  hq_state: string | null;
  hq_country: string | null;
  lat: number | null;
  lon: number | null;
  phone: string | null;
  support_email: string | null;
  instagram_handle: string | null;
  social_json: Json;
  created_at: string;
  updated_at: string;
  default_concurrency: number | null;
};

// ----------------------------------------------------------------------------
// Coffee Summary Type (from coffee_summary view)
// ----------------------------------------------------------------------------

export type CoffeeSummaryData = {
  coffee_id: string | null;
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
};
