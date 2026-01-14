import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type {
  RoasterFilters,
  RoasterListResponse,
  RoasterSort,
  RoasterSummary,
} from "@/types/roaster-types";
import type { Database } from "@/types/supabase-types";

type CoffeeStats = {
  roaster_id: string | null;
  rating_avg: number | null;
  rating_count: number;
};

type RoasterStats = {
  coffee_count: number;
  rated_coffee_count: number;
  avg_coffee_rating: number | null;
};

/**
 * Apply filters to the query
 */
function applyFilters(query: any, filters: RoasterFilters) {
  let filteredQuery = query;

  // Always filter by is_active = true by default (show only active roasters)
  // This is REQUIRED to match the RLS policy "Public can view active roasters"
  filteredQuery = filteredQuery.eq("is_active", true);

  if (
    filters.q &&
    filters.q.trim().length > 0 &&
    !filters.roaster_ids?.length
  ) {
    filteredQuery = filteredQuery.ilike("name", `%${filters.q.trim()}%`);
  }

  if (filters.roaster_ids && filters.roaster_ids.length > 0) {
    filteredQuery = filteredQuery.in("id", filters.roaster_ids);
  }

  // Apply country filter - default to "India" if no countries filter is specified
  if (filters.countries && filters.countries.length > 0) {
    // User-specified countries - use case-insensitive matching
    if (filters.countries.length === 1) {
      filteredQuery = filteredQuery.ilike("hq_country", filters.countries[0]);
    } else {
      // Multiple countries - build OR condition with case-insensitive matching
      const orConditions = filters.countries
        .map((country) => `hq_country.ilike.${country}`)
        .join(",");
      filteredQuery = filteredQuery.or(orConditions);
    }
  } else {
    // Default to India - use case-insensitive matching (matches "India", "india", "INDIA", etc.)
    // Also include NULL countries as they're likely Indian roasters
    filteredQuery = filteredQuery.or(
      "hq_country.ilike.India,hq_country.is.null"
    );
  }

  if (filters.states && filters.states.length > 0) {
    filteredQuery = filteredQuery.in("hq_state", filters.states);
  }

  if (filters.cities && filters.cities.length > 0) {
    filteredQuery = filteredQuery.in("hq_city", filters.cities);
  }

  // Note: active_only filter is now redundant since we always filter by is_active = true
  // Keeping it for API consistency, but it won't change the query

  return filteredQuery;
}

/**
 * Apply sorting to the query
 */
function applySorting(query: any, sort: RoasterSort) {
  switch (sort) {
    case "name_asc":
      return query.order("name", { ascending: true });
    case "name_desc":
      return query.order("name", { ascending: false });
    case "rating_desc":
      return query.order("avg_rating", {
        ascending: false,
        nullsFirst: false,
      });
    case "newest":
      return query.order("created_at", { ascending: false });
    default:
      return query.order("name", { ascending: true });
  }
}

/**
 * Aggregate coffee statistics per roaster
 */
function aggregateCoffeeStats(
  roasterIds: string[],
  coffeeStats: CoffeeStats[] | null
): Map<string, RoasterStats> {
  const statsMap = new Map<string, RoasterStats>();

  for (const roasterId of roasterIds) {
    statsMap.set(roasterId, {
      coffee_count: 0,
      rated_coffee_count: 0,
      avg_coffee_rating: null,
    });
  }

  if (!coffeeStats) {
    return statsMap;
  }

  const ratingSums = new Map<string, { sum: number; count: number }>();

  for (const coffee of coffeeStats) {
    if (!coffee.roaster_id) {
      continue;
    }

    const stats = statsMap.get(coffee.roaster_id);
    if (!stats) {
      continue;
    }

    stats.coffee_count += 1;

    if (coffee.rating_avg && coffee.rating_count > 0) {
      stats.rated_coffee_count += 1;

      const ratingSum = ratingSums.get(coffee.roaster_id) || {
        sum: 0,
        count: 0,
      };
      ratingSum.sum += coffee.rating_avg * coffee.rating_count;
      ratingSum.count += coffee.rating_count;
      ratingSums.set(coffee.roaster_id, ratingSum);
    }
  }

  for (const [roasterId, ratingSum] of ratingSums.entries()) {
    const stats = statsMap.get(roasterId);
    if (stats && ratingSum.count > 0) {
      stats.avg_coffee_rating = ratingSum.sum / ratingSum.count;
    }
  }

  return statsMap;
}

/**
 * Transform database row to RoasterSummary
 */
function transformToRoasterSummary(
  row: Database["public"]["Tables"]["roasters"]["Row"],
  stats: RoasterStats
): RoasterSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    website: row.website ?? null,
    hq_city: row.hq_city ?? null,
    hq_state: row.hq_state ?? null,
    hq_country: row.hq_country ?? null,
    is_active: row.is_active,
    instagram_handle: row.instagram_handle ?? null,
    is_featured: row.is_featured ?? null,
    is_editors_pick: row.is_editors_pick ?? null,
    coffee_count: stats.coffee_count,
    avg_coffee_rating: stats.avg_coffee_rating,
    rated_coffee_count: stats.rated_coffee_count,
    avg_rating: row.avg_rating ?? null,
    avg_customer_support: row.avg_customer_support ?? null,
    avg_delivery_experience: row.avg_delivery_experience ?? null,
    avg_packaging: row.avg_packaging ?? null,
    avg_value_for_money: row.avg_value_for_money ?? null,
    total_ratings_count: row.total_ratings_count ?? null,
    recommend_percentage: row.recommend_percentage ?? null,
  };
}

/**
 * Fetch roasters with filters, sorting, and pagination
 * This is the ONLY place where Supabase query logic lives.
 * Both SSR page and API route call this function.
 */
export async function fetchRoasters(
  filters: RoasterFilters,
  page: number,
  limit: number,
  sort: RoasterSort
): Promise<RoasterListResponse> {
  // Try to use service role client if available (bypasses RLS for server-side queries)
  // Fallback to regular client if service role key is not set
  // Both clients have compatible query interfaces, so we can use them interchangeably
  const supabase = process.env.SUPABASE_SECRET_KEY
    ? await createServiceRoleClient()
    : await createClient();

  let query = supabase
    .from("roasters")
    .select(
      "id, slug, name, website, hq_city, hq_state, hq_country, is_active, instagram_handle, is_featured, is_editors_pick, avg_rating, avg_customer_support, avg_delivery_experience, avg_packaging, avg_value_for_money, total_ratings_count, recommend_percentage, created_at",
      { count: "exact" }
    );

  // Apply filters - is_active filter is critical for RLS policy matching
  query = applyFilters(query, filters);
  query = applySorting(query, sort);

  const from = (page - 1) * limit;
  const to = page * limit - 1;
  query = query.range(from, to);

  const { data: roastersData, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch roasters: ${error.message}`);
  }

  if (!roastersData || roastersData.length === 0) {
    return {
      items: [],
      page,
      limit,
      total: 0,
      totalPages: 0,
    };
  }

  const roasterIds = roastersData.map((r: { id: string }) => r.id);

  const { data: coffeeStats } = await supabase
    .from("coffees")
    .select("roaster_id, rating_avg, rating_count")
    .in("roaster_id", roasterIds);

  const statsMap = aggregateCoffeeStats(roasterIds, coffeeStats);

  let items: RoasterSummary[] = roastersData.map((row: any) => {
    const stats =
      statsMap.get(row.id) ||
      ({
        coffee_count: 0,
        rated_coffee_count: 0,
        avg_coffee_rating: null,
      } satisfies RoasterStats);
    return transformToRoasterSummary(row, stats);
  });

  if (sort === "coffee_count_desc") {
    items = items.sort((a, b) => b.coffee_count - a.coffee_count);
  }

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
