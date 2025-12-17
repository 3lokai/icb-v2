import { createServiceRoleClient } from "@/lib/supabase/server";
import type { RoasterFilterMeta } from "@/types/roaster-types";

/**
 * Fetch roaster filter meta data with counts
 * Returns all available filter options with their usage counts
 * Uses service role client to bypass RLS for server-side queries
 * Uses SQL aggregations for efficient counting
 */
export async function fetchRoasterFilterMeta(): Promise<RoasterFilterMeta> {
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

  // Run all queries in parallel for better performance
  const [citiesResult, statesResult, countriesResult, totalsResult] =
    await Promise.all([
      // Cities - aggregate from roasters table
      supabase
        .from("roasters")
        .select("hq_city")
        .not("hq_city", "is", null)
        .eq("is_active", true)
        .then((result) => {
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
        }),

      // States - aggregate from roasters table
      supabase
        .from("roasters")
        .select("hq_state")
        .not("hq_state", "is", null)
        .eq("is_active", true)
        .then((result) => {
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
        }),

      // Countries - aggregate from roasters table
      supabase
        .from("roasters")
        .select("hq_country")
        .not("hq_country", "is", null)
        .eq("is_active", true)
        .then((result) => {
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
        }),

      // Totals
      Promise.all([
        supabase
          .from("roasters")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase.from("roasters").select("id", { count: "exact", head: true }),
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
