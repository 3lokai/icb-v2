import type { CoffeeSummary } from "./coffee-types";

// ============================================================================
// REGION TYPES
// ============================================================================

/** A gallery image from `canon_media` (shared by regions and estates). */
export type CanonMediaItem = {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  is_hero: boolean;
};

// ----------------------------------------------------------------------------
// 1. Region Page Type - RegionDetail
// ----------------------------------------------------------------------------

/** An estate belonging to this region, for the region page's estate list. */
export type RegionEstateSummary = {
  id: string;
  slug: string;
  name: string;
  hero_image_url: string | null;
  altitude_min_m: number | null;
  altitude_max_m: number | null;
};

export type RegionDetail = {
  // From canon_regions table
  id: string;
  slug: string;
  display_name: string;
  country: string;
  state: string | null;
  subregion: string | null;
  description: string | null;
  climate: string | null;
  soil: string | null;
  harvest_season: string | null;
  notes: string | null;
  altitude_min_m: number | null;
  altitude_max_m: number | null;
  rainfall_mm: number | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;

  // Enthusiast/terroir fields
  terroir_notes: string | null;
  signature_profile: string | null;
  primary_varieties: string[] | null;
  primary_processing_methods: string[] | null;
  intercrop_species: string[] | null;
  area_hectares: number | null;
  annual_production_mt: number | null;
  logo_url: string | null;

  // Embedded
  media: CanonMediaItem[];
  estates: RegionEstateSummary[];
  coffees: CoffeeSummary[];
  coffee_count: number;
};

// ----------------------------------------------------------------------------
// 2. Region Filter Types
// ----------------------------------------------------------------------------

export type RegionFilters = {
  q?: string;
  countries?: string[];
  states?: string[];
};

// ----------------------------------------------------------------------------
// 3. Region UI Types
// ----------------------------------------------------------------------------

export type RegionSummary = {
  id: string;
  slug: string;
  display_name: string;
  country: string;
  state: string | null;
  subregion: string | null;
  hero_image_url: string | null;
  signature_profile: string | null;
};

// ----------------------------------------------------------------------------
// 4. Region List Response Type
// ----------------------------------------------------------------------------

export type RegionListResponse = {
  items: RegionSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ----------------------------------------------------------------------------
// 5. Region Sort Type
// ----------------------------------------------------------------------------

export type RegionSort = "name_asc" | "name_desc" | "newest";
