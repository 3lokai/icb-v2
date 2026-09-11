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

/**
 * Precision level of a canon region -- how specific the origin claim is, NOT whether the
 * region gets a page. `baba-budangiri` is a `locality` with 183 coffees and its own page;
 * `virajpet` is a `taluk` with India's largest coffee area and no page. Page decisions live
 * in `src/lib/discovery/landing-pages/region-pages.ts`.
 *
 * Added by migration 20260910120000_canon_region_tier_parent_district.
 */
export type RegionTier =
  | "region" // Coffee Board named region -- the consumer-facing unit
  | "district" // NRSC district, when not itself a named region
  | "taluk" // NRSC taluk / mandal / block
  | "locality" // village, estate belt, hill spur -- normalization target
  | "aggregate" // deliberate multi-unit grouping (e.g. North-East India)
  | "non-terroir"; // not a place (e.g. Monsooned Malabar, a curing process)

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

  // Structure: precision tier + hierarchy (migration 20260910120000)
  tier: RegionTier | null;
  /** Containing region. Null at top. Coffee counts roll UP this edge. */
  parent_id: string | null;
  /** NRSC/administrative district. Null for non-Indian rows and aggregates. */
  district: string | null;

  // Enthusiast/terroir fields
  terroir_notes: string | null;
  signature_profile: string | null;
  primary_varieties: string[] | null;
  primary_processing_methods: string[] | null;
  intercrop_species: string[] | null;
  area_hectares: number | null;
  /** Provenance of `area_hectares`, e.g. "NRSC 2024". Never render a figure without it. */
  area_source: string | null;
  /** As-of date for `area_hectares`. The NRSC atlas is 2024-09. */
  area_as_of: string | null;
  annual_production_mt: number | null;

  // Fixed image slots, all ImageKit (migration 20260911180000). One image per role,
  // uploaded by icb-claude/canon/upload_media.py from canon/media/regions/<slug>/.
  // canon_media stays for variable-length galleries; these four are named slots.
  /** Card badge, Coffee Board logo style. Slot: `card`. */
  logo_url: string | null;
  /** Terroir / growing-conditions block. Slot: `terroir`. */
  terroir_image_url: string | null;
  /** Indian specialty context block. Slot: `context`. */
  context_image_url: string | null;

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
  /** e.g. `["region"]` for the /regions hub, which lists only named regions. */
  tiers?: RegionTier[];
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
  /** Card badge for the /regions hub. Slot: `card`. */
  logo_url: string | null;
  signature_profile: string | null;
  /** Elevation band, rendered on the hub card directly under the name. */
  altitude_min_m: number | null;
  altitude_max_m: number | null;

  // Structure + sourced figures, for the /regions hub: group by `state`, nest by
  // `parent_id`, and show `area_hectares` with its `area_source` attribution.
  tier: RegionTier | null;
  parent_id: string | null;
  district: string | null;
  area_hectares: number | null;
  area_source: string | null;
  /** As-of date for `area_hectares`. Render it alongside `area_source`, never alone. */
  area_as_of: string | null;
};

/**
 * Coffee counts per Indian canon region, from the `get_region_coffee_counts` RPC
 * (migration 20260911120000). `rolled` includes every descendant via `parent_id`,
 * deduped on coffee — a parent region filtered on its own slug alone undercounts.
 */
export type RegionCoffeeCount = {
  canon_region_id: string;
  slug: string;
  own_count: number;
  rolled_count: number;
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
