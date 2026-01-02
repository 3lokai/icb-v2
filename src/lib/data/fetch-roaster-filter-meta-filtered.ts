import { createServiceRoleClient } from "@/lib/supabase/server";
import type { RoasterFilterMeta, RoasterFilters } from "@/types/roaster-types";

/**
 * Apply filters to roaster query
 */
function applyRoasterFilters(query: any, filters: RoasterFilters): any {
  let filteredQuery = query;

  // Text search
  if (filters.q?.trim()) {
    filteredQuery = filteredQuery.ilike("name", `%${filters.q.trim()}%`);
  }

  // Array filters
  if (filters.cities?.length) {
    filteredQuery = filteredQuery.in("hq_city", filters.cities);
  }

  if (filters.states?.length) {
    filteredQuery = filteredQuery.in("hq_state", filters.states);
  }

  if (filters.countries?.length) {
    filteredQuery = filteredQuery.in("hq_country", filters.countries);
  }

  // Boolean filters
  if (filters.active_only === true) {
    filteredQuery = filteredQuery.eq("is_active", true);
  }

  return filteredQuery;
}

/**
 * Fetch roaster filter meta data with counts filtered by active filters
 * Returns filter options with counts that reflect the current filter state
 */
export async function fetchRoasterFilterMetaWithFilters(
  filters: RoasterFilters
): Promise<RoasterFilterMeta> {
  const supabase = await createServiceRoleClient();

  // Helper to sort by count DESC, then label ASC
  const sortByCountAndLabel = <T extends { count: number; label: string }>(
    items: T[]
  ): T[] =>
    items.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.label.localeCompare(b.label);
    });

  // Build base query excluding a specific filter category
  const buildBaseQuery = (excludeFilter?: {
    cities?: boolean;
    states?: boolean;
    countries?: boolean;
  }) => {
    let query = supabase.from("roasters").select("id");

    // Apply filters, excluding the specified filter category
    const filtersToApply: RoasterFilters = { ...filters };
    if (excludeFilter?.cities) {
      delete filtersToApply.cities;
    }
    if (excludeFilter?.states) {
      delete filtersToApply.states;
    }
    if (excludeFilter?.countries) {
      delete filtersToApply.countries;
    }

    query = applyRoasterFilters(query, filtersToApply);
    return query;
  };

  // Get base filtered roaster IDs (for totals)
  const { data: baseFilteredRoasters, error: baseError } =
    await buildBaseQuery();

  if (baseError || !baseFilteredRoasters) {
    throw new Error(`Failed to fetch filtered roasters: ${baseError?.message}`);
  }

  const baseFilteredRoasterIds = (baseFilteredRoasters || [])
    .map((row: any) => row.id)
    .filter(Boolean);

  // If no roasters match base filters, return empty meta
  if (baseFilteredRoasterIds.length === 0) {
    return {
      cities: [],
      states: [],
      countries: [],
      totals: { roasters: 0, active_roasters: 0 },
    };
  }

  // Helper to get filtered roaster IDs excluding a filter
  const getFilteredRoasterIds = async (excludeFilter?: {
    cities?: boolean;
    states?: boolean;
    countries?: boolean;
  }): Promise<string[]> => {
    const { data: filteredRoasters, error } =
      await buildBaseQuery(excludeFilter);
    if (error || !filteredRoasters) {
      return [];
    }
    return (filteredRoasters || []).map((row: any) => row.id).filter(Boolean);
  };

  // Now count each filter option, excluding the filter being counted
  const [citiesResult, statesResult, countriesResult, totalsResult] =
    await Promise.all([
      // Cities - count within filtered set (excluding cities filter)
      (async () => {
        const roasterIds = await getFilteredRoasterIds({ cities: true });
        if (roasterIds.length === 0) return [];
        const result = await supabase
          .from("roasters")
          .select("hq_city")
          .in("id", roasterIds)
          .not("hq_city", "is", null);

        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<string, number>();
        for (const row of data) {
          if (row.hq_city) {
            counts.set(row.hq_city, (counts.get(row.hq_city) || 0) + 1);
          }
        }

        return Array.from(counts.entries())
          .map(([value, count]) => ({
            value,
            label: value,
            count,
          }))
          .filter((item) => item.count > 0);
      })(),

      // States - count within filtered set (excluding states filter)
      (async () => {
        const roasterIds = await getFilteredRoasterIds({ states: true });
        if (roasterIds.length === 0) return [];
        const result = await supabase
          .from("roasters")
          .select("hq_state")
          .in("id", roasterIds)
          .not("hq_state", "is", null);

        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<string, number>();
        for (const row of data) {
          if (row.hq_state) {
            counts.set(row.hq_state, (counts.get(row.hq_state) || 0) + 1);
          }
        }

        return Array.from(counts.entries())
          .map(([value, count]) => ({
            value,
            label: value,
            count,
          }))
          .filter((item) => item.count > 0);
      })(),

      // Countries - count within filtered set (excluding countries filter)
      (async () => {
        const roasterIds = await getFilteredRoasterIds({ countries: true });
        if (roasterIds.length === 0) return [];
        const result = await supabase
          .from("roasters")
          .select("hq_country")
          .in("id", roasterIds)
          .not("hq_country", "is", null);

        if (result.error) {
          throw result.error;
        }
        const data = result.data || [];

        const counts = new Map<string, number>();
        for (const row of data) {
          if (row.hq_country) {
            counts.set(row.hq_country, (counts.get(row.hq_country) || 0) + 1);
          }
        }

        return Array.from(counts.entries())
          .map(([value, count]) => ({
            value,
            label: value,
            count,
          }))
          .filter((item) => item.count > 0);
      })(),

      // Totals - use base filtered set
      Promise.all([
        supabase
          .from("roasters")
          .select("id", { count: "exact", head: true })
          .in("id", baseFilteredRoasterIds)
          .eq("is_active", true),
        supabase
          .from("roasters")
          .select("id", { count: "exact", head: true })
          .in("id", baseFilteredRoasterIds),
      ]).then(([activeResult, totalResult]) => {
        if (activeResult.error) {
          throw activeResult.error;
        }
        if (totalResult.error) {
          throw totalResult.error;
        }
        return {
          roasters: totalResult.count || 0,
          active_roasters: activeResult.count || 0,
        };
      }),
    ]);

  return {
    cities: sortByCountAndLabel(citiesResult),
    states: sortByCountAndLabel(statesResult),
    countries: sortByCountAndLabel(countriesResult),
    totals: totalsResult,
  };
}
