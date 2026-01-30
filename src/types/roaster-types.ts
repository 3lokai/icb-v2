import type { CoffeeSummary } from "./coffee-types";
import type { Json } from "./db-enums";

// ============================================================================
// ROASTER TYPES
// ============================================================================

// ----------------------------------------------------------------------------
// 1. Roaster Page Type - RoasterDetail
// ----------------------------------------------------------------------------

export type RoasterDetail = {
  // From roasters table
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
  is_active: boolean;
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

  // Rating fields from roasters table
  avg_rating: number | null;
  avg_customer_support: number | null;
  avg_delivery_experience: number | null;
  avg_packaging: number | null;
  avg_value_for_money: number | null;
  total_ratings_count: number | null;
  recommend_percentage: number | null;
  ratings_updated_at: string | null;

  // Embedded coffees list
  coffees: CoffeeSummary[];

  // Optional stats
  coffee_count?: number;
  active_coffee_count?: number;
  avg_coffee_rating?: number | null;
};

// ----------------------------------------------------------------------------
// 2. Roaster Filter Types
// ----------------------------------------------------------------------------

export type RoasterFilters = {
  q?: string;
  cities?: string[];
  states?: string[];
  countries?: string[];
  active_only?: boolean;
  roaster_slugs?: string[]; // Slugs from roasters table (human-readable URLs)
  roaster_ids?: string[]; // Internal use, resolved from slugs
};

export type RoasterFilterMeta = {
  cities: Array<{ value: string; label: string; count: number }>;
  states: Array<{ value: string; label: string; count: number }>;
  countries: Array<{ value: string; label: string; count: number }>;
  totals: {
    roasters: number;
    active_roasters: number;
  };
};

// ----------------------------------------------------------------------------
// 3. Roaster UI Types
// ----------------------------------------------------------------------------

export type RoasterSummary = {
  id: string;
  slug: string;
  name: string;
  website: string | null;
  hq_city: string | null;
  hq_state: string | null;
  hq_country: string | null;
  is_active: boolean;
  instagram_handle: string | null;

  // Badge fields
  is_featured: boolean | null;
  is_editors_pick: boolean | null;

  // Aggregate stats
  coffee_count: number;
  avg_coffee_rating: number | null;
  rated_coffee_count: number;

  // Rating fields
  avg_rating: number | null;
  avg_customer_support: number | null;
  avg_delivery_experience: number | null;
  avg_packaging: number | null;
  avg_value_for_money: number | null;
  total_ratings_count: number | null;
  recommend_percentage: number | null;
};

export type RoasterCardData = {
  slug: string;
  name: string;
  city: string | null;
  country: string | null;
  website: string | null;
  coffeeCount: number;
  avgCoffeeRating: number | null;
  ratedCoffeeCount: number;
  badges: string[];

  // Rating fields
  avgRating: number | null;
  avgCustomerSupport: number | null;
  avgDeliveryExperience: number | null;
  avgPackaging: number | null;
  avgValueForMoney: number | null;
  totalRatingsCount: number | null;
  recommendPercentage: number | null;
};

// ----------------------------------------------------------------------------
// 4. Roaster List Response Type
// ----------------------------------------------------------------------------

export type RoasterListResponse = {
  items: RoasterSummary[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// ----------------------------------------------------------------------------
// 5. Roaster Sort Type
// ----------------------------------------------------------------------------

export type RoasterSort =
  | "relevance"
  | "name_asc"
  | "name_desc"
  | "coffee_count_desc"
  | "rating_desc"
  | "newest";
