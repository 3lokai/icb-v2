import type { CoffeeSummary } from "./coffee-types";
import type { CanonMediaItem } from "./region-types";

// ============================================================================
// ESTATE TYPES
// ============================================================================

// ----------------------------------------------------------------------------
// 1. Estate Page Type - EstateDetail
// ----------------------------------------------------------------------------

/** The parent region, for the estate page's breadcrumb/back-link. */
export type EstateRegionSummary = {
  id: string;
  slug: string;
  display_name: string;
  country: string;
  state: string | null;
};

export type EstateDetail = {
  // From canon_estates table
  id: string;
  slug: string;
  name: string;
  canon_region_id: string;
  description: string | null;
  owner: string | null;
  founded_year: number | null;
  certifications: string[] | null;
  notes: string | null;
  altitude_min_m: number | null;
  altitude_max_m: number | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;

  // People/story/terroir fields
  owner_generation: string | null;
  founder_name: string | null;
  family_story: string | null;
  quote: string | null;
  quote_attribution: string | null;
  primary_varieties: string[] | null;
  processing_methods: string[] | null;
  signature_profile: string | null;
  specialty_notes: string | null;

  // Embedded
  region: EstateRegionSummary;
  media: CanonMediaItem[];
  coffees: CoffeeSummary[];
  coffee_count: number;
};

// ----------------------------------------------------------------------------
// 2. Estate Filter Types
// ----------------------------------------------------------------------------

export type EstateFilters = {
  q?: string;
  region_slugs?: string[]; // Slugs from canon_regions (human-readable URLs)
  region_ids?: string[]; // Internal use, resolved from slugs
};

// ----------------------------------------------------------------------------
// 3. Estate UI Types
// ----------------------------------------------------------------------------

export type EstateSummary = {
  id: string;
  slug: string;
  name: string;
  canon_region_id: string;
  hero_image_url: string | null;
  altitude_min_m: number | null;
  altitude_max_m: number | null;
  signature_profile: string | null;
};

// ----------------------------------------------------------------------------
// 4. Estate List Response Type
// ----------------------------------------------------------------------------

export type EstateListResponse = {
  items: EstateSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ----------------------------------------------------------------------------
// 5. Estate Sort Type
// ----------------------------------------------------------------------------

export type EstateSort = "name_asc" | "name_desc" | "newest";
