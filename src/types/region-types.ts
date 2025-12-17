import type { CoffeeSummary } from "./coffee-types";

// ============================================================================
// REGION TYPES
// ============================================================================

// ----------------------------------------------------------------------------
// 1. Region Page Type - RegionDetail
// ----------------------------------------------------------------------------

export type RegionDetail = {
  // From regions table
  id: string;
  display_name: string | null;
  country: string | null;
  state: string | null;
  subregion: string;

  // Computed/derived fields
  slug: string; // Derived from display_name or subregion
  name: string; // display_name or subregion
  description: string | null; // Optional description field
  image_url: string | null; // Optional image for region

  // Embedded estates list
  estates: Array<{
    id: string;
    name: string;
    estate_key: string;
    region_id: string | null;
    altitude_min_m: number | null;
    altitude_max_m: number | null;
    notes: string | null;
    coffee_count?: number; // Count of coffees from this estate
  }>;

  // Embedded coffees list (coffees from this region)
  coffees: CoffeeSummary[];

  // Aggregate stats
  coffee_count?: number;
  active_coffee_count?: number;
  estate_count?: number;
  avg_coffee_rating?: number | null;
  min_price_in_stock?: number | null;
  max_price_in_stock?: number | null;

  // Geographic aggregation (if region spans multiple states/countries)
  states?: string[];
  countries?: string[];
};

// ----------------------------------------------------------------------------
// 2. Region Filter Types
// ----------------------------------------------------------------------------

export type RegionSort =
  | "name_asc"
  | "name_desc"
  | "coffee_count_desc"
  | "coffee_count_asc"
  | "newest";

export type RegionFilters = {
  // Text search
  q?: string;

  // Location filters
  countries?: string[];
  states?: string[];

  // Coffee-related filters (applied to coffees from this region)
  has_coffees?: boolean; // Only regions with coffees
  min_coffee_count?: number;
  in_stock_only?: boolean; // Only regions with coffees in stock
};

export type RegionFilterMeta = {
  countries: Array<{ value: string; count: number }>;
  states: Array<{ value: string; count: number }>;
  total_count: number;
  regions_with_coffees: number;
  regions_with_stock: number;
};

// ----------------------------------------------------------------------------
// 3. Region UI Types
// ----------------------------------------------------------------------------

export type RegionSummary = {
  id: string;
  slug: string;
  name: string;
  display_name: string | null;
  country: string | null;
  state: string | null;
  subregion: string;
  description: string | null;
  image_url: string | null;

  // Aggregate stats
  coffee_count: number;
  active_coffee_count: number;
  estate_count: number;
  avg_coffee_rating: number | null;
  min_price_in_stock: number | null;

  // UI flags
  ribbon?: "featured" | "popular" | null; // For card badges
};

export type RegionCardData = {
  slug: string;
  name: string;
  state: string | null;
  country: string | null;
  imageUrl: string | null;
  description: string | null;
  coffeeCount: number;
  badges: string[]; // Derived badges like "Featured", "Popular"
};
