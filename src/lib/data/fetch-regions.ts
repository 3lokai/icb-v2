import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type {
  RegionFilters,
  RegionListResponse,
  RegionSort,
  RegionSummary,
} from "@/types/region-types";

/**
 * Apply filters to the query
 */
function applyFilters(query: any, filters: RegionFilters) {
  let filteredQuery = query;

  if (filters.q && filters.q.trim().length > 0) {
    filteredQuery = filteredQuery.ilike(
      "display_name",
      `%${filters.q.trim()}%`
    );
  }

  if (filters.countries && filters.countries.length > 0) {
    filteredQuery = filteredQuery.in("country", filters.countries);
  }

  if (filters.states && filters.states.length > 0) {
    filteredQuery = filteredQuery.in("state", filters.states);
  }

  return filteredQuery;
}

/**
 * Apply sorting to the query
 */
function applySorting(query: any, sort: RegionSort) {
  switch (sort) {
    case "name_desc":
      return query.order("display_name", { ascending: false });
    case "newest":
      return query.order("created_at", { ascending: false });
    default:
      return query.order("display_name", { ascending: true });
  }
}

/**
 * Fetch regions with filters, sorting, and pagination.
 * This is the ONLY place where Supabase query logic for the region list lives.
 * Both SSR page and API route call this function.
 */
export async function fetchRegions(
  filters: RegionFilters,
  page: number,
  limit: number,
  sort: RegionSort,
  supabaseClient?: SupabaseClient
): Promise<RegionListResponse> {
  const supabase =
    supabaseClient ??
    (process.env.SUPABASE_SECRET_KEY
      ? await createServiceRoleClient()
      : await createClient());

  let query = supabase
    .from("canon_regions")
    .select(
      "id, slug, display_name, country, state, subregion, hero_image_url, signature_profile",
      { count: "exact" }
    );

  query = applyFilters(query, filters);
  query = applySorting(query, sort);

  const from = (page - 1) * limit;
  const to = page * limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch regions: ${error.message}`);
  }

  const items: RegionSummary[] = (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    display_name: row.display_name,
    country: row.country,
    state: row.state ?? null,
    subregion: row.subregion ?? null,
    hero_image_url: row.hero_image_url ?? null,
    signature_profile: row.signature_profile ?? null,
  }));

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return { items, page, limit, total, totalPages };
}

export const fetchRegionsCached = unstable_cache(
  (filters: RegionFilters, page: number, limit: number, sort: RegionSort) =>
    fetchRegions(filters, page, limit, sort),
  ["regions-list"],
  { revalidate: 86400, tags: ["regions"] }
);
