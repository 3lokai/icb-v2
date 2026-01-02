import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  COFFEE_STATUS,
  PROCESSING_METHODS,
  ROAST_LEVELS,
} from "@/lib/utils/coffee-constants";
import type { CoffeeFilterMeta, CoffeeFilters } from "@/types/coffee-types";
import type {
  CoffeeStatusEnum,
  ProcessEnum,
  RoastLevelEnum,
} from "@/types/db-enums";
import {
  applyFiltersToQuery,
  getCoffeeIdsFromFlavorKeys,
  getCoffeeIdsFromJunction,
} from "./fetch-coffees";

/**
 * Fetch coffee filter meta data with counts filtered by active filters
 * Returns filter options with counts that reflect the current filter state
 * This allows showing "Light Roast (35)" when "In Stock" is active, vs "Light Roast (50)" when no filters
 */
export async function fetchCoffeeFilterMetaWithFilters(
  filters: CoffeeFilters
): Promise<CoffeeFilterMeta> {
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
  // This allows counting filter options while excluding the filter being counted
  // Example: When counting roast levels, exclude roast_levels filter so we see all roast levels
  const buildBaseQuery = (excludeFilter?: {
    roast_levels?: boolean;
    processes?: boolean;
    status?: boolean;
    roaster_ids?: boolean;
    region_ids?: boolean;
    estate_ids?: boolean;
    brew_method_ids?: boolean;
    flavor_keys?: boolean;
  }) => {
    let query = supabase.from("coffee_summary").select("coffee_id");

    // Apply filters, excluding the specified filter category
    const filtersToApply: CoffeeFilters = { ...filters };
    if (excludeFilter?.roast_levels) {
      delete filtersToApply.roast_levels;
    }
    if (excludeFilter?.processes) {
      delete filtersToApply.processes;
    }
    if (excludeFilter?.status) {
      delete filtersToApply.status;
    }
    if (excludeFilter?.roaster_ids) {
      delete filtersToApply.roaster_ids;
    }
    if (excludeFilter?.region_ids) {
      delete filtersToApply.region_ids;
    }
    if (excludeFilter?.estate_ids) {
      delete filtersToApply.estate_ids;
    }
    if (excludeFilter?.brew_method_ids) {
      delete filtersToApply.brew_method_ids;
    }
    if (excludeFilter?.flavor_keys) {
      delete filtersToApply.flavor_keys;
    }

    query = applyFiltersToQuery(query, filtersToApply);

    // Handle junction table filters
    // Build junction filters based on excludeFilter parameter
    const junctionFilters: Array<{
      ids: string[] | undefined;
      getter: () => Promise<string[] | null>;
      type: "flavor_keys" | "region_ids" | "estate_ids" | "brew_method_ids";
    }> = [];

    if (filters.flavor_keys?.length && !excludeFilter?.flavor_keys) {
      junctionFilters.push({
        ids: filters.flavor_keys,
        type: "flavor_keys",
        getter: () =>
          getCoffeeIdsFromFlavorKeys(supabase, filters.flavor_keys!),
      });
    }

    if (filters.region_ids?.length && !excludeFilter?.region_ids) {
      junctionFilters.push({
        ids: filters.region_ids,
        type: "region_ids",
        getter: () =>
          getCoffeeIdsFromJunction(
            supabase,
            "coffee_regions",
            "region_id",
            filters.region_ids!
          ),
      });
    }

    if (filters.estate_ids?.length && !excludeFilter?.estate_ids) {
      junctionFilters.push({
        ids: filters.estate_ids,
        type: "estate_ids",
        getter: () =>
          getCoffeeIdsFromJunction(
            supabase,
            "coffee_estates",
            "estate_id",
            filters.estate_ids!
          ),
      });
    }

    if (filters.brew_method_ids?.length && !excludeFilter?.brew_method_ids) {
      junctionFilters.push({
        ids: filters.brew_method_ids,
        type: "brew_method_ids",
        getter: () =>
          getCoffeeIdsFromJunction(
            supabase,
            "coffee_brew_methods",
            "brew_method_id",
            filters.brew_method_ids!
          ),
      });
    }

    return { query, junctionFilters };
  };

  // Helper to get filtered coffee IDs with optional filter exclusion
  const getFilteredCoffeeIds = async (excludeFilter?: {
    roast_levels?: boolean;
    processes?: boolean;
    status?: boolean;
    roaster_ids?: boolean;
    region_ids?: boolean;
    estate_ids?: boolean;
    brew_method_ids?: boolean;
    flavor_keys?: boolean;
  }): Promise<string[]> => {
    const { query: baseQuery, junctionFilters } = buildBaseQuery(excludeFilter);

    // Process junction filters (already filtered by excludeFilter in buildBaseQuery)
    const junctionCoffeeIds = await Promise.all(
      junctionFilters.map((filter) => filter.getter())
    );

    // If any junction filter returns null, return empty array
    if (junctionCoffeeIds.some((ids) => ids === null)) {
      return [];
    }

    // Apply junction filters to base query
    let filteredQuery = baseQuery;
    for (const coffeeIds of junctionCoffeeIds) {
      if (coffeeIds && coffeeIds.length > 0) {
        filteredQuery = filteredQuery.in("coffee_id", coffeeIds);
      }
    }

    // Get filtered coffee IDs
    const { data: filteredCoffees, error: baseError } = await filteredQuery;

    if (baseError || !filteredCoffees) {
      throw new Error(
        `Failed to fetch filtered coffees: ${baseError?.message}`
      );
    }

    return (filteredCoffees || [])
      .map((row: any) => row.coffee_id)
      .filter(Boolean);
  };

  // Get base filtered coffee IDs (for totals and filters that don't need exclusion)
  const baseFilteredCoffeeIds = await getFilteredCoffeeIds();

  // If no coffees match base filters, return empty meta
  if (baseFilteredCoffeeIds.length === 0) {
    return {
      flavorNotes: [],
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

  // Now count each filter option, excluding the filter being counted
  const [
    flavorNotesResult,
    regionsResult,
    estatesResult,
    brewMethodsResult,
    roastersResult,
    roastLevelsResult,
    processesResult,
    statusesResult,
    totalsResult,
  ] = await Promise.all([
    // Flavor Notes - count within filtered set (excluding flavor_keys filter)
    (async () => {
      const coffeeIds = await getFilteredCoffeeIds({ flavor_keys: true });
      if (coffeeIds.length === 0) return [];
      const result = await supabase
        .from("coffee_flavor_notes")
        .select("flavor_note_id, flavor_notes(id, key, label)")
        .in("coffee_id", coffeeIds);

      if (result.error) {
        throw result.error;
      }
      const data = result.data || [];

      const counts = new Map<
        string,
        { id: string; label: string; count: number }
      >();

      for (const row of data) {
        const fn = row.flavor_notes as unknown as {
          id: string;
          key: string;
          label: string;
        } | null;
        if (!fn) {
          continue;
        }

        const existing = counts.get(fn.id);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(fn.id, { id: fn.key, label: fn.label, count: 1 });
        }
      }

      return Array.from(counts.values()).filter((item) => item.count > 0);
    })(),

    // Regions - count within filtered set (excluding region_ids filter)
    (async () => {
      const coffeeIds = await getFilteredCoffeeIds({ region_ids: true });
      if (coffeeIds.length === 0) return [];
      const result = await supabase
        .from("coffee_regions")
        .select("region_id, regions(id, display_name)")
        .in("coffee_id", coffeeIds);

      if (result.error) {
        throw result.error;
      }
      const data = result.data || [];

      const counts = new Map<
        string,
        { id: string; label: string; count: number }
      >();

      for (const row of data) {
        const r = row.regions as unknown as {
          id: string;
          display_name: string | null;
        } | null;
        if (!r) {
          continue;
        }

        const existing = counts.get(r.id);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(r.id, {
            id: r.id,
            label: r.display_name || r.id,
            count: 1,
          });
        }
      }

      return Array.from(counts.values()).filter((item) => item.count > 0);
    })(),

    // Estates - count within filtered set (excluding estate_ids filter)
    (async () => {
      const coffeeIds = await getFilteredCoffeeIds({ estate_ids: true });
      if (coffeeIds.length === 0) return [];
      const result = await supabase
        .from("coffee_estates")
        .select("estate_id, estates(id, name)")
        .in("coffee_id", coffeeIds);

      if (result.error) {
        throw result.error;
      }
      const data = result.data || [];

      const counts = new Map<
        string,
        { id: string; label: string; count: number }
      >();

      for (const row of data) {
        const e = row.estates as unknown as {
          id: string;
          name: string;
        } | null;
        if (!e) {
          continue;
        }

        const existing = counts.get(e.id);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(e.id, { id: e.id, label: e.name, count: 1 });
        }
      }

      return Array.from(counts.values()).filter((item) => item.count > 0);
    })(),

    // Brew Methods - count within filtered set (excluding brew_method_ids filter)
    (async () => {
      const coffeeIds = await getFilteredCoffeeIds({ brew_method_ids: true });
      if (coffeeIds.length === 0) return [];
      const result = await supabase
        .from("coffee_brew_methods")
        .select("brew_method_id, brew_methods(id, label)")
        .in("coffee_id", coffeeIds);

      if (result.error) {
        throw result.error;
      }
      const data = result.data || [];

      const counts = new Map<
        string,
        { id: string; label: string; count: number }
      >();

      for (const row of data) {
        const bm = row.brew_methods as unknown as {
          id: string;
          label: string;
        } | null;
        if (!bm) {
          continue;
        }

        const existing = counts.get(bm.id);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(bm.id, { id: bm.id, label: bm.label, count: 1 });
        }
      }

      return Array.from(counts.values()).filter((item) => item.count > 0);
    })(),

    // Roasters - count within filtered set (excluding roaster_ids filter)
    (async () => {
      const coffeeIds = await getFilteredCoffeeIds({ roaster_ids: true });
      if (coffeeIds.length === 0) return [];
      const result = await supabase
        .from("coffee_summary")
        .select("roaster_id, roasters(id, name)")
        .in("coffee_id", coffeeIds)
        .not("roaster_id", "is", null);

      if (result.error) {
        throw result.error;
      }
      const data = result.data || [];

      const counts = new Map<
        string,
        { id: string; label: string; count: number }
      >();

      for (const row of data) {
        const r = row.roasters as unknown as {
          id: string;
          name: string;
        } | null;
        if (!r) {
          continue;
        }

        const existing = counts.get(r.id);
        if (existing) {
          existing.count += 1;
        } else {
          counts.set(r.id, { id: r.id, label: r.name, count: 1 });
        }
      }

      return Array.from(counts.values()).filter((item) => item.count > 0);
    })(),

    // Roast Levels - count within filtered set (excluding roast_levels filter)
    (async () => {
      const coffeeIds = await getFilteredCoffeeIds({ roast_levels: true });
      if (coffeeIds.length === 0) return [];
      const result = await supabase
        .from("coffee_summary")
        .select("roast_level")
        .in("coffee_id", coffeeIds)
        .not("roast_level", "is", null);

      if (result.error) {
        throw result.error;
      }
      const data = result.data || [];

      const counts = new Map<RoastLevelEnum, number>();
      for (const row of data) {
        if (row.roast_level) {
          counts.set(
            row.roast_level as RoastLevelEnum,
            (counts.get(row.roast_level as RoastLevelEnum) || 0) + 1
          );
        }
      }

      return Array.from(counts.entries())
        .map(([value, count]) => {
          const option = ROAST_LEVELS.find((r) => r.value === value);
          return {
            value,
            label: option?.label || value,
            count,
          };
        })
        .filter((item) => item.count > 0)
        .sort((a, b) => {
          if (b.count !== a.count) {
            return b.count - a.count;
          }
          return a.label.localeCompare(b.label);
        });
    })(),

    // Processes - count within filtered set (excluding processes filter)
    (async () => {
      const coffeeIds = await getFilteredCoffeeIds({ processes: true });
      if (coffeeIds.length === 0) return [];
      const result = await supabase
        .from("coffee_summary")
        .select("process")
        .in("coffee_id", coffeeIds)
        .not("process", "is", null);

      if (result.error) {
        throw result.error;
      }
      const data = result.data || [];

      const counts = new Map<ProcessEnum, number>();
      for (const row of data) {
        if (row.process) {
          counts.set(
            row.process as ProcessEnum,
            (counts.get(row.process as ProcessEnum) || 0) + 1
          );
        }
      }

      return Array.from(counts.entries())
        .map(([value, count]) => {
          const option = PROCESSING_METHODS.find((p) => p.value === value);
          return {
            value,
            label: option?.label || value,
            count,
          };
        })
        .filter((item) => item.count > 0)
        .sort((a, b) => {
          if (b.count !== a.count) {
            return b.count - a.count;
          }
          return a.label.localeCompare(b.label);
        });
    })(),

    // Statuses - count within filtered set (excluding status filter)
    (async () => {
      const coffeeIds = await getFilteredCoffeeIds({ status: true });
      if (coffeeIds.length === 0) return [];
      const result = await supabase
        .from("coffee_summary")
        .select("status")
        .in("coffee_id", coffeeIds)
        .not("status", "is", null);

      if (result.error) {
        throw result.error;
      }
      const data = result.data || [];

      const counts = new Map<CoffeeStatusEnum, number>();
      for (const row of data) {
        if (row.status) {
          counts.set(
            row.status as CoffeeStatusEnum,
            (counts.get(row.status as CoffeeStatusEnum) || 0) + 1
          );
        }
      }

      return Array.from(counts.entries())
        .map(([value, count]) => {
          const option = COFFEE_STATUS.find((s) => s.value === value);
          return {
            value,
            label: option?.label || value,
            count,
          };
        })
        .filter((item) => item.count > 0)
        .sort((a, b) => {
          if (b.count !== a.count) {
            return b.count - a.count;
          }
          return a.label.localeCompare(b.label);
        });
    })(),

    // Totals - use base filtered set
    Promise.all([
      supabase
        .from("coffee_summary")
        .select("coffee_id", { count: "exact", head: true })
        .in("coffee_id", baseFilteredCoffeeIds),
      supabase
        .from("roasters")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),
    ]).then(([coffeesResult, roastersResult]) => {
      if (coffeesResult.error) {
        throw coffeesResult.error;
      }
      if (roastersResult.error) {
        throw roastersResult.error;
      }
      return {
        coffees: coffeesResult.count || 0,
        roasters: roastersResult.count || 0,
      };
    }),
  ]);

  return {
    flavorNotes: sortByCountAndLabel(flavorNotesResult),
    regions: sortByCountAndLabel(regionsResult),
    estates: sortByCountAndLabel(estatesResult),
    brewMethods: sortByCountAndLabel(brewMethodsResult),
    roasters: sortByCountAndLabel(roastersResult),
    roastLevels: roastLevelsResult,
    processes: processesResult,
    statuses: statusesResult,
    totals: totalsResult,
  };
}
