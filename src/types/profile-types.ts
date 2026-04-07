/**
 * Profile-related TypeScript types
 * Used for profile page components and data fetching
 */

// User coffee status (tried/tasted list)
export type UserCoffeeStatus = "logged" | "brewing" | "finished" | "rated";

// One entry in the user's tried/tasted coffee list (from user_coffees + joins)
export interface UserCoffee {
  id: string;
  coffee_id: string;
  status: UserCoffeeStatus;
  added_at: string;
  photo: string | null;
  coffee_name: string;
  coffee_slug: string;
  roaster_name: string;
  roaster_slug: string;
  image_url: string | null; // first coffee image for display
}

// Profile data structure returned from RPC
export interface UserProfileFull {
  profile: UserProfileData | null;
  ratings: ProfileRating[];
  selections: ProfileSelection[];
  taste_profile: TasteProfileData;
  gear: ProfileGear[];
  station_photos: StationPhoto[];
  user_coffees: UserCoffee[];
  coffee_preferences?: CoffeePreferences | null;
}

// Basic user profile info
export interface UserProfileData {
  id: string;
  username: string | null;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  is_public_profile: boolean | null;
  show_location: boolean | null;
  created_at: string | null;
}

// Rating/review data for profile
export interface ProfileRating {
  id: string;
  coffee_id: string;
  coffee_name: string;
  coffee_slug: string;
  roaster_name: string;
  roaster_slug: string;
  rating: number;
  comment: string | null;
  created_at: string;
  image_url: string | null;
}

// Selection (recommended coffee) data
export interface ProfileSelection {
  review_id: string;
  coffee_id: string;
  coffee_name: string;
  coffee_slug: string;
  roaster_name: string;
  roaster_slug: string;
  rating: number;
  comment: string | null;
  reviewed_at: string;
  image_url: string | null;
}

// Taste profile data from cache
export interface TasteProfileData {
  // Existing — raw cache fields
  top_roast_levels: string[];
  top_brew_methods: string[];
  /** Canon flavor sensory node UUIDs from cache (canon_sensory_nodes.id); see coffee_directory_mv.canon_flavor_node_ids */
  top_flavor_note_ids: string[];
  total_reviews: number;
  last_computed_at: string | null;

  // Resolved display data (strings resolved server-side)
  /** Canonical flavor descriptors (canon_sensory_nodes.descriptor; slug fallback in RPC) */
  top_flavor_labels: string[];
  top_roasters: { name: string; slug: string }[]; // roasters.name + roasters.slug
  top_region_names: string[]; // canon_region_names from MV
  top_processes: string[]; // process enum values
  top_species: string[]; // bean_species enum values

  // Scalar stats
  avg_rating: number | null;
  recommend_rate: number | null; // 0.0–1.0 ratio
  single_origin_pct: number | null; // 0.0–1.0 ratio
  distinct_roaster_count: number;
  rating_distribution: Record<string, number>; // {"1": n, "2": n, ..., "5": n}
}

// User coffee preferences (from user_coffee_preferences table)
export interface CoffeePreferences {
  roast_levels: string[] | null;
  flavor_profiles: string[] | null;
  processing_methods: string[] | null;
  regions: string[] | null;
  with_milk_preference: boolean | null;
  decaf_only: boolean;
  organic_only: boolean;
}

// Gear item with catalog details
export interface ProfileGear {
  id: string;
  gear_id: string;
  name: string;
  category: "grinder" | "brewer" | "accessory";
  brand: string | null;
  model: string | null;
  image_url: string | null;
  notes: string | null;
  sort_order: number;
}

// Station photo
export interface StationPhoto {
  id: string;
  image_url: string;
  width: number | null;
  height: number | null;
  sort_order: number;
}
