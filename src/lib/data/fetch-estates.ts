import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import type {
  EstateFilters,
  EstateListResponse,
  EstateSort,
  EstateSummary,
} from "@/types/estate-types";

/** Resolve `canon_regions.slug[]` -> `canon_regions.id[]`. */
async function resolveRegionSlugsToIds(
  supabase: any,
  slugs: string[]
): Promise<string[]> {
  if (slugs.length === 0) {
    return [];
  }
  const { data } = await supabase
    .from("canon_regions")
    .select("id")
    .in("slug", slugs);
  return (data ?? []).map((r: any) => r.id);
}

/**
 * Apply filters to the query
 */
function applyFilters(query: any, filters: EstateFilters) {
  let filteredQuery = query;

  if (filters.q && filters.q.trim().length > 0) {
    filteredQuery = filteredQuery.ilike("name", `%${filters.q.trim()}%`);
  }

  if (filters.region_ids && filters.region_ids.length > 0) {
    filteredQuery = filteredQuery.in("canon_region_id", filters.region_ids);
  }

  return filteredQuery;
}

/**
 * Apply sorting to the query
 */
function applySorting(query: any, sort: EstateSort) {
  switch (sort) {
    case "name_desc":
      return query.order("name", { ascending: false });
    case "newest":
      return query.order("created_at", { ascending: false });
    default:
      return query.order("name", { ascending: true });
  }
}

/**
 * Fetch estates with filters, sorting, and pagination.
 * This is the ONLY place where Supabase query logic for the estate list lives.
 * Both SSR page and API route call this function.
 */
export async function fetchEstates(
  filters: EstateFilters,
  page: number,
  limit: number,
  sort: EstateSort,
  supabaseClient?: SupabaseClient
): Promise<EstateListResponse> {
  const supabase =
    supabaseClient ??
    (process.env.SUPABASE_SECRET_KEY
      ? await createServiceRoleClient()
      : await createClient());

  const resolvedFilters = { ...filters };
  if (filters.region_slugs && filters.region_slugs.length > 0) {
    const regionIds = await resolveRegionSlugsToIds(
      supabase,
      filters.region_slugs
    );
    resolvedFilters.region_ids = [...(filters.region_ids ?? []), ...regionIds];
  }

  let query = supabase
    .from("canon_estates")
    .select(
      "id, slug, name, canon_region_id, hero_image_url, altitude_min_m, altitude_max_m, signature_profile",
      { count: "exact" }
    );

  query = applyFilters(query, resolvedFilters);
  query = applySorting(query, sort);

  const from = (page - 1) * limit;
  const to = page * limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch estates: ${error.message}`);
  }

  const items: EstateSummary[] = (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    canon_region_id: row.canon_region_id,
    hero_image_url: row.hero_image_url ?? null,
    altitude_min_m: row.altitude_min_m ?? null,
    altitude_max_m: row.altitude_max_m ?? null,
    signature_profile: row.signature_profile ?? null,
  }));

  const total = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return { items, page, limit, total, totalPages };
}

export const fetchEstatesCached = unstable_cache(
  (filters: EstateFilters, page: number, limit: number, sort: EstateSort) =>
    fetchEstates(filters, page, limit, sort),
  ["estates-list"],
  { revalidate: 86400, tags: ["estates"] }
);
