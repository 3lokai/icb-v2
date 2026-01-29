import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { CoffeeImage } from "@/types/coffee-component-types";
import type {
  CoffeeFilters,
  CoffeeListResponse,
  CoffeeSort,
  CoffeeSummary,
} from "@/types/coffee-types";

// Note: getCoffeeIdsFromJunction and getCoffeeIdsFromFlavorKeys are kept for backward compatibility
// but are no longer used in fetchCoffees - they may be used by filter meta calculations

/**
 * Helper to get coffee IDs from junction table filters
 * Exported for use in filter meta calculations
 */
export async function getCoffeeIdsFromJunction(
  supabase: any,
  tableName: string,
  idColumn: string,
  filterIds: string[]
): Promise<string[] | null> {
  const { data } = await supabase
    .from(tableName)
    .select("coffee_id")
    .in(idColumn, filterIds);

  if (!data || data.length === 0) {
    return null;
  }

  const coffeeIds: string[] = [];
  for (const row of data) {
    const coffeeId = row.coffee_id as string | null | undefined;
    if (coffeeId) {
      coffeeIds.push(coffeeId);
    }
  }
  return [...new Set(coffeeIds)];
}

/**
 * Helper to get coffee IDs from flavor keys filter
 * Exported for use in filter meta calculations
 */
export async function getCoffeeIdsFromFlavorKeys(
  supabase: any,
  flavorKeys: string[]
): Promise<string[] | null> {
  const { data: flavorNotesData } = await supabase
    .from("flavor_notes")
    .select("id")
    .in("key", flavorKeys);

  if (!flavorNotesData || flavorNotesData.length === 0) {
    return null;
  }

  const flavorNoteIds = flavorNotesData.map((fn: any) => fn.id);
  return getCoffeeIdsFromJunction(
    supabase,
    "coffee_flavor_notes",
    "flavor_note_id",
    flavorNoteIds
  );
}

/**
 * Helper to resolve roaster slugs to IDs
 */
async function resolveRoasterSlugsToIds(
  supabase: any,
  slugs: string[]
): Promise<string[]> {
  if (slugs.length === 0) {
    return [];
  }
  const { data } = await supabase
    .from("roasters")
    .select("id")
    .in("slug", slugs);
  return (data || []).map((r: any) => r.id);
}

/**
 * Helper to resolve region slugs to IDs (via canon_regions)
 */
async function resolveRegionSlugsToIds(
  supabase: any,
  slugs: string[]
): Promise<string[]> {
  if (slugs.length === 0) {
    return [];
  }
  // Get canon_region IDs from slugs
  const { data: canonRegions } = await supabase
    .from("canon_regions")
    .select("id")
    .in("slug", slugs);
  if (!canonRegions || canonRegions.length === 0) {
    return [];
  }
  const canonRegionIds = canonRegions.map((r: any) => r.id);
  // Get region IDs that reference these canon_regions
  const { data: regions } = await supabase
    .from("regions")
    .select("id")
    .in("canon_region_id", canonRegionIds);
  return (regions || []).map((r: any) => r.id);
}

/**
 * Helper to resolve estate keys to IDs
 */
async function resolveEstateKeysToIds(
  supabase: any,
  keys: string[]
): Promise<string[]> {
  if (keys.length === 0) {
    return [];
  }
  const { data } = await supabase
    .from("estates")
    .select("id")
    .in("estate_key", keys);
  return (data || []).map((e: any) => e.id);
}

/**
 * Helper to resolve canonical flavor slugs to IDs
 */
async function resolveCanonFlavorSlugsToIds(
  supabase: any,
  slugs: string[]
): Promise<string[]> {
  if (slugs.length === 0) {
    return [];
  }
  const { data } = await supabase
    .from("canon_sensory_nodes")
    .select("id")
    .in("slug", slugs)
    .eq("node_type", "flavor");
  return (data || []).map((n: any) => n.id);
}

/**
 * Helper to apply filters to query
 * Updated to work with coffee_directory_mv materialized view
 * Exported for use in filter meta calculations
 * Note: This function is synchronous but slug resolution is async.
 * For slug-based filters, use applyFiltersToQueryAsync instead.
 */
export function applyFiltersToQuery(query: any, filters: CoffeeFilters): any {
  let filteredQuery = query;

  // Text search (only if not filtering by specific IDs from Fuse)
  if (filters.q?.trim() && !filters.coffee_ids?.length) {
    filteredQuery = filteredQuery.ilike("name", `%${filters.q.trim()}%`);
  }

  // ID Filter (from Fuse)
  if (filters.coffee_ids?.length) {
    filteredQuery = filteredQuery.in("coffee_id", filters.coffee_ids);
  }

  // Array filters
  if (filters.roast_levels?.length) {
    filteredQuery = filteredQuery.in("roast_level", filters.roast_levels);
  }

  if (filters.processes?.length) {
    filteredQuery = filteredQuery.in("process", filters.processes);
  }

  if (filters.status?.length) {
    filteredQuery = filteredQuery.in("status", filters.status);
  }

  if (filters.bean_species?.length) {
    filteredQuery = filteredQuery.in("bean_species", filters.bean_species);
  }

  // Roasters - use IDs (resolved from slugs in fetchCoffees)
  if (filters.roaster_ids?.length) {
    filteredQuery = filteredQuery.in("roaster_id", filters.roaster_ids);
  }

  // Boolean filters
  if (filters.in_stock_only === true) {
    filteredQuery = filteredQuery.gt("in_stock_count", 0);
  }

  if (filters.has_250g_only === true) {
    filteredQuery = filteredQuery.eq("has_250g_bool", true);
  }

  if (filters.limited_only === true) {
    filteredQuery = filteredQuery.eq("is_limited", true);
  }

  if (filters.decaf_only === true) {
    filteredQuery = filteredQuery.eq("decaf", true);
  }

  if (filters.has_sensory_only === true) {
    filteredQuery = filteredQuery.eq("has_sensory", true);
  }

  // Numeric filters
  if (filters.min_price && filters.min_price > 0) {
    filteredQuery = filteredQuery.gte(
      "best_normalized_250g",
      filters.min_price
    );
  }

  if (filters.max_price && filters.max_price > 0) {
    filteredQuery = filteredQuery.lte(
      "best_normalized_250g",
      filters.max_price
    );
  }

  // Junction table filters using array operators (for coffee_directory_mv)
  // flavor_keys: use contains (@>) - coffee must have ALL selected flavors (legacy)
  if (filters.flavor_keys?.length) {
    filteredQuery = filteredQuery.contains("flavor_keys", filters.flavor_keys);
  }

  // Canonical flavors - prefer slug-based filtering (MV has canon_flavor_slugs array)
  if (filters.canon_flavor_slugs?.length) {
    filteredQuery = filteredQuery.overlaps(
      "canon_flavor_slugs",
      filters.canon_flavor_slugs
    );
  }
  // Backward compatibility: also support ID-based filtering
  if (filters.canon_flavor_node_ids?.length) {
    filteredQuery = filteredQuery.overlaps(
      "canon_flavor_node_ids",
      filters.canon_flavor_node_ids
    );
  }

  // Regions - prefer IDs (resolved from slugs), fallback to direct ID filter
  if (filters.region_ids?.length) {
    filteredQuery = filteredQuery.overlaps("region_ids", filters.region_ids);
  }
  // Note: region_slugs need to be resolved to IDs before calling this function

  // Estates - prefer IDs (resolved from keys), fallback to direct ID filter
  if (filters.estate_ids?.length) {
    filteredQuery = filteredQuery.overlaps("estate_ids", filters.estate_ids);
  }
  // Note: estate_keys need to be resolved to IDs before calling this function

  // brew_method_canonical_keys: use overlaps (&&) - coffee must support ANY selected method
  if (filters.brew_method_ids?.length) {
    filteredQuery = filteredQuery.overlaps(
      "brew_method_canonical_keys",
      filters.brew_method_ids
    );
  }

  return filteredQuery;
}

/**
 * Helper to apply sorting to query
 */
function applySortingToQuery(query: any, sort: CoffeeSort): any {
  switch (sort) {
    case "price_asc":
      return query.order("best_normalized_250g", {
        ascending: true,
        nullsFirst: false,
      });
    case "price_desc":
      return query.order("best_normalized_250g", {
        ascending: false,
        nullsFirst: false,
      });
    case "newest":
      return query.order("coffee_id", { ascending: false });
    case "relevance":
      return query.order("name", { ascending: true });
    default:
      return query.order("name", { ascending: true });
  }
}

/**
 * Helper to fetch coffee images (first image per coffee based on sort_order)
 * Used for list/card views where only the first image is needed
 */
export async function fetchCoffeeImages(
  supabase: any,
  coffeeIds: string[]
): Promise<Map<string, string>> {
  if (coffeeIds.length === 0) {
    return new Map();
  }

  const { data: imagesData } = await supabase
    .from("coffee_images")
    .select("coffee_id, imagekit_url")
    .in("coffee_id", coffeeIds)
    .order("sort_order", { ascending: true });

  const imagesMap = new Map<string, string>();
  for (const img of imagesData || []) {
    if (img.coffee_id && img.imagekit_url && !imagesMap.has(img.coffee_id)) {
      imagesMap.set(img.coffee_id, img.imagekit_url);
    }
  }
  return imagesMap;
}

/**
 * Fetch all images for a coffee (or multiple coffees) ordered by sort_order
 * Returns a Map of coffee_id -> CoffeeImage[] array
 * Used for detail pages where all images are needed
 */
export async function fetchAllCoffeeImages(
  supabase: any,
  coffeeIds: string[]
): Promise<Map<string, CoffeeImage[]>> {
  if (coffeeIds.length === 0) {
    return new Map();
  }

  const { data: imagesData } = await supabase
    .from("coffee_images")
    .select("id, coffee_id, imagekit_url, alt, width, height, sort_order")
    .in("coffee_id", coffeeIds)
    .order("sort_order", { ascending: true });

  const imagesMap = new Map<string, CoffeeImage[]>();

  for (const img of imagesData || []) {
    if (img.coffee_id) {
      const coffeeImage: CoffeeImage = {
        id: img.id,
        coffee_id: img.coffee_id,
        imagekit_url: img.imagekit_url,
        alt: img.alt,
        width: img.width,
        height: img.height,
        sort_order: img.sort_order,
      };

      const existing = imagesMap.get(img.coffee_id);
      if (existing) {
        existing.push(coffeeImage);
      } else {
        imagesMap.set(img.coffee_id, [coffeeImage]);
      }
    }
  }

  return imagesMap;
}

/**
 * Helper to transform row from coffee_directory_mv to CoffeeSummary
 * All data is already in the materialized view, so this is just direct mapping
 */
function transformToCoffeeSummary(row: any): CoffeeSummary {
  return {
    // From coffee_summary view fields
    coffee_id: row.coffee_id ?? null,
    slug: row.slug ?? null,
    name: row.name ?? null,
    roaster_id: row.roaster_id ?? null,
    status: row.status ?? null,
    process: row.process ?? null,
    process_raw: row.process_raw ?? null,
    roast_level: row.roast_level ?? null,
    roast_level_raw: row.roast_level_raw ?? null,
    roast_style_raw: row.roast_style_raw ?? null,
    direct_buy_url: row.direct_buy_url ?? null,
    has_250g_bool: row.has_250g_bool ?? null,
    has_sensory: row.has_sensory ?? null,
    in_stock_count: row.in_stock_count ?? null,
    min_price_in_stock: row.min_price_in_stock ?? null,
    best_variant_id: row.best_variant_id ?? null,
    best_normalized_250g: row.best_normalized_250g ?? null,
    weights_available: row.weights_available ?? null,
    sensory_public: row.sensory_public ?? null,
    sensory_updated_at: row.sensory_updated_at ?? null,

    // From coffees table (now in MV)
    decaf: row.decaf ?? false,
    is_limited: row.is_limited ?? false,
    bean_species: row.bean_species ?? null,
    rating_avg: row.rating_avg ?? null,
    rating_count: row.rating_count ?? 0,
    tags: row.tags ?? null,

    // From roasters table (now in MV)
    roaster_slug: row.roaster_slug ?? "",
    roaster_name: row.roaster_name ?? "",
    hq_city: row.hq_city ?? null,
    hq_state: row.hq_state ?? null,
    hq_country: row.hq_country ?? null,
    website: row.website ?? null,

    // From coffee_images table (now in MV)
    image_url: row.image_url ?? null,

    // Junction table arrays (now in MV)
    flavor_keys: row.flavor_keys ?? null,
    brew_method_canonical_keys: row.brew_method_canonical_keys ?? null,
  } as CoffeeSummary;
}

/**
 * Empty result helper
 */
function _emptyResult(page: number, limit: number): CoffeeListResponse {
  return {
    items: [],
    page,
    limit,
    total: 0,
    totalPages: 0,
  };
}

/**
 * Fetch coffees with filters, sorting, and pagination
 * Uses coffee_directory_mv materialized view for optimal performance
 * This is the ONLY place where Supabase query logic lives.
 * Both SSR page and API route call this function.
 * Handles slug-to-ID resolution for regions, estates, and roasters.
 */
export async function fetchCoffees(
  filters: CoffeeFilters,
  page: number,
  limit: number,
  sort: CoffeeSort
): Promise<CoffeeListResponse> {
  // Try to use service role client if available (bypasses RLS for server-side queries)
  // Fallback to regular client if service role key is not set
  const supabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : await createClient();

  // Resolve slugs to IDs for filtering (if slugs are provided)
  const resolvedFilters: CoffeeFilters = { ...filters };

  // Resolve roaster slugs to IDs (if provided)
  if (filters.roaster_slugs?.length && !filters.roaster_ids?.length) {
    const roasterIds = await resolveRoasterSlugsToIds(
      supabase,
      filters.roaster_slugs
    );
    if (roasterIds.length > 0) {
      resolvedFilters.roaster_ids = roasterIds;
    }
  }

  // Resolve region slugs to IDs (if provided)
  if (filters.region_slugs?.length && !filters.region_ids?.length) {
    const regionIds = await resolveRegionSlugsToIds(
      supabase,
      filters.region_slugs
    );
    if (regionIds.length > 0) {
      resolvedFilters.region_ids = regionIds;
    }
  }

  // Resolve estate keys to IDs (if provided)
  if (filters.estate_keys?.length && !filters.estate_ids?.length) {
    const estateIds = await resolveEstateKeysToIds(
      supabase,
      filters.estate_keys
    );
    if (estateIds.length > 0) {
      resolvedFilters.estate_ids = estateIds;
    }
  }

  // Resolve canonical flavor slugs to IDs (if provided, for backward compatibility)
  // Note: We prefer filtering by canon_flavor_slugs directly since MV has that array
  // But we can also resolve to IDs if needed
  if (
    filters.canon_flavor_slugs?.length &&
    !filters.canon_flavor_node_ids?.length
  ) {
    // We'll filter by slugs directly, but also resolve for any code that needs IDs
    const flavorIds = await resolveCanonFlavorSlugsToIds(
      supabase,
      filters.canon_flavor_slugs
    );
    if (flavorIds.length > 0) {
      resolvedFilters.canon_flavor_node_ids = flavorIds;
    }
  }

  // Build query using coffee_directory_mv materialized view
  // All data (coffees, roasters, images, junction arrays) is already included
  let query = supabase
    .from("coffee_directory_mv")
    .select("*", { count: "exact" });

  // Apply all filters (including junction table filters using array operators)
  query = applyFiltersToQuery(query, resolvedFilters);

  // Apply sorting
  query = applySortingToQuery(query, sort);

  // Apply pagination
  const from = (page - 1) * limit;
  const to = page * limit - 1;
  query = query.range(from, to);

  // Execute query
  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch coffees: ${error.message}`);
  }

  // Transform data (all fields already in MV, just map directly)
  const items: CoffeeSummary[] = (data || []).map((row: any) =>
    transformToCoffeeSummary(row)
  );

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    page,
    limit,
    total,
    totalPages,
  };
}
