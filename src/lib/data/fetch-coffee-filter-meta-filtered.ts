import { createServiceRoleClient } from "@/lib/supabase/server";
import type { CoffeeFilterMeta, CoffeeFilters } from "@/types/coffee-types";
import type { GrindEnum } from "@/types/db-enums";

/**
 * Fetch coffee filter meta data with counts filtered by active filters
 * Returns filter options with counts that reflect the current filter state
 * This allows showing "Light Roast (35)" when "In Stock" is active, vs "Light Roast (50)" when no filters
 *
 * Uses PostgreSQL RPC function to avoid HTTP header overflow errors with large coffee ID arrays
 */
export async function fetchCoffeeFilterMetaWithFilters(
  filters: CoffeeFilters
): Promise<CoffeeFilterMeta> {
  const supabase = await createServiceRoleClient();

  // Call RPC function with filter parameters
  // Note: brew_method_ids in filters are actually canonical_keys (from UI selection)
  // The RPC expects grind_enum[] for canonical_keys
  const brewMethodCanonicalKeys = filters.brew_method_ids?.length
    ? (filters.brew_method_ids as unknown as GrindEnum[])
    : null;

  const { data, error } = await supabase.rpc("get_coffee_filter_meta", {
    p_search_query: filters.q || null,
    p_roast_levels: filters.roast_levels?.length ? filters.roast_levels : null,
    p_processes: filters.processes?.length ? filters.processes : null,
    p_statuses: filters.status?.length ? filters.status : null,
    p_roaster_ids: filters.roaster_ids?.length ? filters.roaster_ids : null,
    p_region_ids: filters.region_ids?.length ? filters.region_ids : null,
    p_estate_ids: filters.estate_ids?.length ? filters.estate_ids : null,
    p_brew_method_canonical_keys: brewMethodCanonicalKeys,
    p_flavor_keys: filters.flavor_keys?.length ? filters.flavor_keys : null,
    p_canon_flavor_node_ids: filters.canon_flavor_node_ids?.length
      ? filters.canon_flavor_node_ids
      : null,
    p_in_stock_only: filters.in_stock_only === true,
    p_has_250g_only: filters.has_250g_only === true,
    p_min_price:
      filters.min_price && filters.min_price > 0 ? filters.min_price : null,
    p_max_price:
      filters.max_price && filters.max_price > 0 ? filters.max_price : null,
  });

  if (error) {
    throw new Error(
      `Failed to fetch filter meta: ${error.message}${error.details ? ` (${error.details})` : ""}${error.hint ? ` - ${error.hint}` : ""}`
    );
  }

  if (!data) {
    return {
      flavorNotes: [],
      canonicalFlavors: [],
      regions: [],
      estates: [],
      brewMethods: [],
      roasters: [],
      roastLevels: [],
      processes: [],
      statuses: [],
      totals: { coffees: 0, roasters: 0 },
    };
  }

  // Normalize the response - ensure all arrays are arrays (json_agg returns null when empty)
  const normalized = data as CoffeeFilterMeta;
  return {
    flavorNotes: normalized.flavorNotes || [],
    canonicalFlavors: normalized.canonicalFlavors || [],
    regions: normalized.regions || [],
    estates: normalized.estates || [],
    brewMethods: normalized.brewMethods || [],
    roasters: normalized.roasters || [],
    roastLevels: normalized.roastLevels || [],
    processes: normalized.processes || [],
    statuses: normalized.statuses || [],
    totals: normalized.totals || { coffees: 0, roasters: 0 },
  };
}
