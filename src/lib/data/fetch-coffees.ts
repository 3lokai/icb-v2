import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { CoffeeImage } from "@/types/coffee-component-types";
import type {
  CoffeeFilters,
  CoffeeListResponse,
  CoffeeSort,
  CoffeeSummary,
} from "@/types/coffee-types";

/**
 * Helper to get coffee IDs from junction table filters
 */
async function getCoffeeIdsFromJunction(
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
 */
async function getCoffeeIdsFromFlavorKeys(
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
 * Helper to apply filters to query
 */
function applyFiltersToQuery(query: any, filters: CoffeeFilters): any {
  let filteredQuery = query;

  // Text search
  if (filters.q?.trim()) {
    filteredQuery = filteredQuery.ilike("name", `%${filters.q.trim()}%`);
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

  // Numeric filter
  if (filters.max_price && filters.max_price > 0) {
    filteredQuery = filteredQuery.lte(
      "best_normalized_250g",
      filters.max_price
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
 * Helper to enrich data with coffees, roasters tables, and images
 */
async function enrichCoffeeData(
  supabase: any,
  data: any[]
): Promise<{
  coffeesMap: Map<string, any>;
  roastersMap: Map<string, any>;
  imagesMap: Map<string, string>;
}> {
  const coffeeIds = [
    ...new Set(data.map((row: any) => row.coffee_id).filter(Boolean)),
  ];
  const roasterIds = [
    ...new Set(data.map((row: any) => row.roaster_id).filter(Boolean)),
  ];

  const coffeesMap = new Map();
  if (coffeeIds.length > 0) {
    const { data: coffeesData } = await supabase
      .from("coffees")
      .select(
        "id, decaf, is_limited, bean_species, rating_avg, rating_count, tags"
      )
      .in("id", coffeeIds);

    if (coffeesData) {
      for (const coffee of coffeesData) {
        coffeesMap.set(coffee.id, coffee);
      }
    }
  }

  const roastersMap = new Map();
  if (roasterIds.length > 0) {
    const { data: roastersData } = await supabase
      .from("roasters")
      .select("id, slug, name, hq_city, hq_state, hq_country, website")
      .in("id", roasterIds);

    if (roastersData) {
      for (const roaster of roastersData) {
        roastersMap.set(roaster.id, roaster);
      }
    }
  }

  // Fetch images for all coffees
  const imagesMap = await fetchCoffeeImages(supabase, coffeeIds);

  return { coffeesMap, roastersMap, imagesMap };
}

/**
 * Helper to extract coffee data from map
 */
function getCoffeeData(
  coffeeId: string | null,
  coffeesMap: Map<string, any>
): {
  decaf: boolean;
  is_limited: boolean;
  bean_species: any;
  rating_avg: any;
  rating_count: number;
  tags: any;
} {
  const coffee = coffeeId ? coffeesMap.get(coffeeId) : null;
  return {
    decaf: coffee?.decaf ?? false,
    is_limited: coffee?.is_limited ?? false,
    bean_species: coffee?.bean_species ?? null,
    rating_avg: coffee?.rating_avg ?? null,
    rating_count: coffee?.rating_count ?? 0,
    tags: coffee?.tags ?? null,
  };
}

/**
 * Helper to extract roaster data from map
 */
function getRoasterData(
  roasterId: string | null,
  roastersMap: Map<string, any>
): {
  roaster_slug: string;
  roaster_name: string;
  hq_city: any;
  hq_state: any;
  hq_country: any;
  website: any;
} {
  const roaster = roasterId ? roastersMap.get(roasterId) : null;
  return {
    roaster_slug: roaster?.slug ?? "",
    roaster_name: roaster?.name ?? "",
    hq_city: roaster?.hq_city ?? null,
    hq_state: roaster?.hq_state ?? null,
    hq_country: roaster?.hq_country ?? null,
    website: roaster?.website ?? null,
  };
}

/**
 * Helper to extract basic summary view data
 */
function getBasicSummaryData(row: any): Partial<CoffeeSummary> {
  return {
    coffee_id: row.coffee_id ?? null,
    slug: row.slug ?? null,
    name: row.name ?? null,
    roaster_id: row.roaster_id ?? null,
    status: row.status ?? null,
    process: row.process ?? null,
    process_raw: row.process_raw ?? null,
  };
}

/**
 * Helper to extract roast-related summary data
 */
function getRoastSummaryData(row: any): Partial<CoffeeSummary> {
  return {
    roast_level: row.roast_level ?? null,
    roast_level_raw: row.roast_level_raw ?? null,
    roast_style_raw: row.roast_style_raw ?? null,
  };
}

/**
 * Helper to extract commerce-related summary data
 */
function getCommerceSummaryData(row: any): Partial<CoffeeSummary> {
  return {
    direct_buy_url: row.direct_buy_url ?? null,
    has_250g_bool: row.has_250g_bool ?? null,
    in_stock_count: row.in_stock_count ?? null,
    min_price_in_stock: row.min_price_in_stock ?? null,
    best_variant_id: row.best_variant_id ?? null,
    best_normalized_250g: row.best_normalized_250g ?? null,
    weights_available: row.weights_available ?? null,
  };
}

/**
 * Helper to extract sensory-related summary data
 */
function getSensorySummaryData(
  row: any,
  imagesMap: Map<string, string>
): Partial<CoffeeSummary> {
  const coffeeId = row.coffee_id ?? null;
  const imageUrl = coffeeId ? (imagesMap.get(coffeeId) ?? null) : null;

  return {
    has_sensory: row.has_sensory ?? null,
    sensory_public: row.sensory_public ?? null,
    sensory_updated_at: row.sensory_updated_at ?? null,
    image_url: imageUrl,
  };
}

/**
 * Helper to extract summary view data
 */
function getSummaryViewData(
  row: any,
  imagesMap: Map<string, string>
): Partial<CoffeeSummary> {
  return {
    ...getBasicSummaryData(row),
    ...getRoastSummaryData(row),
    ...getCommerceSummaryData(row),
    ...getSensorySummaryData(row, imagesMap),
  };
}

/**
 * Helper to transform row data to CoffeeSummary
 */
function transformToCoffeeSummary(
  row: any,
  coffeesMap: Map<string, any>,
  roastersMap: Map<string, any>,
  imagesMap: Map<string, string>
): CoffeeSummary {
  const summaryData = getSummaryViewData(row, imagesMap);
  const coffeeData = getCoffeeData(row.coffee_id, coffeesMap);
  const roasterData = getRoasterData(row.roaster_id, roastersMap);

  return {
    ...summaryData,
    ...coffeeData,
    ...roasterData,
  } as CoffeeSummary;
}

/**
 * Empty result helper
 */
function emptyResult(page: number, limit: number): CoffeeListResponse {
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
 * This is the ONLY place where Supabase query logic lives.
 * Both SSR page and API route call this function.
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

  // Handle junction table filters (flavor, region, estate, brew method)
  const junctionFilters: Array<{
    ids: string[] | undefined;
    getter: () => Promise<string[] | null>;
  }> = [];

  if (filters.flavor_keys?.length) {
    junctionFilters.push({
      ids: filters.flavor_keys,
      getter: () => getCoffeeIdsFromFlavorKeys(supabase, filters.flavor_keys!),
    });
  }

  if (filters.region_ids?.length) {
    junctionFilters.push({
      ids: filters.region_ids,
      getter: () =>
        getCoffeeIdsFromJunction(
          supabase,
          "coffee_regions",
          "region_id",
          filters.region_ids!
        ),
    });
  }

  if (filters.estate_ids?.length) {
    junctionFilters.push({
      ids: filters.estate_ids,
      getter: () =>
        getCoffeeIdsFromJunction(
          supabase,
          "coffee_estates",
          "estate_id",
          filters.estate_ids!
        ),
    });
  }

  if (filters.brew_method_ids?.length) {
    junctionFilters.push({
      ids: filters.brew_method_ids,
      getter: () =>
        getCoffeeIdsFromJunction(
          supabase,
          "coffee_brew_methods",
          "brew_method_id",
          filters.brew_method_ids!
        ),
    });
  }

  // Process junction filters and get coffee IDs
  const junctionCoffeeIds = await Promise.all(
    junctionFilters.map((filter) => filter.getter())
  );

  // If any junction filter returns null, return empty result
  if (junctionCoffeeIds.some((ids) => ids === null)) {
    return emptyResult(page, limit);
  }

  // Build query
  let query = supabase.from("coffee_summary").select("*", { count: "exact" });

  // Apply junction filters
  for (const coffeeIds of junctionCoffeeIds) {
    if (coffeeIds && coffeeIds.length > 0) {
      query = query.in("coffee_id", coffeeIds);
    }
  }

  // Apply direct filters
  query = applyFiltersToQuery(query, filters);

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

  // Enrich and transform data
  const { coffeesMap, roastersMap, imagesMap } = await enrichCoffeeData(
    supabase,
    data || []
  );
  const items: CoffeeSummary[] = (data || []).map((row: any) =>
    transformToCoffeeSummary(row, coffeesMap, roastersMap, imagesMap)
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
