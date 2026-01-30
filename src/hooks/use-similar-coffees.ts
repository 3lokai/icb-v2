"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { CoffeeDetail, SimilarCoffeeMatch } from "@/types/coffee-types";
import type { CoffeeSummary } from "@/types/coffee-types";

type SimilarCoffeeRPCResult = {
  coffee_id: string;
  match_type: "flavor" | "style" | "origin" | "fallback";
  overlap_flavor_ids: string[];
  roast_match: boolean;
  process_match: boolean;
  origin_match: boolean;
};

/**
 * Hook to fetch similar coffees for a given coffee
 */
export function useSimilarCoffees(coffee: CoffeeDetail) {
  return useQuery({
    queryKey: ["similar-coffees", coffee.id],
    queryFn: async (): Promise<SimilarCoffeeMatch[]> => {
      const supabase = createClient();

      // Prepare parameters for RPC
      const canonFlavorNodeIds =
        coffee.canon_flavor_node_ids && coffee.canon_flavor_node_ids.length > 0
          ? coffee.canon_flavor_node_ids
          : null;

      const regionIds =
        coffee.regions && coffee.regions.length > 0
          ? coffee.regions.map((r) => r.id)
          : null;

      const estateIds =
        coffee.estates && coffee.estates.length > 0
          ? coffee.estates.map((e) => e.id)
          : null;

      // Call RPC function
      const { data, error } = await supabase.rpc("get_similar_coffees", {
        p_coffee_id: coffee.id,
        p_canon_flavor_node_ids: canonFlavorNodeIds,
        p_roast_level: coffee.roast_level,
        p_process: coffee.process,
        p_region_ids: regionIds,
        p_estate_ids: estateIds,
        p_roaster_id: coffee.roaster_id,
        p_limit: 4,
      });

      if (error) {
        console.error("Error fetching similar coffees:", error);
        return [];
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        return [];
      }

      // Fetch full coffee summaries for each match
      const coffeeIds = data.map(
        (item: SimilarCoffeeRPCResult) => item.coffee_id
      );
      const { data: coffeesData, error: coffeesError } = await supabase
        .from("coffee_directory_mv")
        .select("*")
        .in("coffee_id", coffeeIds);

      if (coffeesError || !coffeesData) {
        console.error("Error fetching coffee summaries:", coffeesError);
        return [];
      }

      // Create a map of coffee_id -> coffee summary
      const coffeeMap = new Map<string, CoffeeSummary>();
      for (const coffeeRow of coffeesData) {
        coffeeMap.set(coffeeRow.coffee_id, coffeeRow as CoffeeSummary);
      }

      // Fetch canonical flavor labels for overlap_flavor_ids
      const allOverlapIds = new Set<string>();
      for (const item of data) {
        for (const id of item.overlap_flavor_ids || []) {
          allOverlapIds.add(id);
        }
      }

      const flavorLabelsMap = new Map<string, string>();
      if (allOverlapIds.size > 0) {
        const { data: flavorNodes } = await supabase
          .from("canon_sensory_nodes")
          .select("id, descriptor")
          .in("id", Array.from(allOverlapIds));

        if (flavorNodes) {
          for (const node of flavorNodes) {
            flavorLabelsMap.set(node.id, node.descriptor);
          }
        }
      }

      // Build result array
      const results: SimilarCoffeeMatch[] = [];
      for (const item of data) {
        const coffeeSummary = coffeeMap.get(item.coffee_id);
        if (!coffeeSummary) continue;

        // Resolve flavor labels
        const overlapFlavorLabels = (item.overlap_flavor_ids || [])
          .map((id: string) => flavorLabelsMap.get(id))
          .filter((label: string | undefined): label is string =>
            Boolean(label)
          );

        results.push({
          coffee: coffeeSummary,
          match_type: item.match_type,
          overlap_flavor_ids: item.overlap_flavor_ids || [],
          overlap_flavor_labels: overlapFlavorLabels,
          roast_match: item.roast_match,
          process_match: item.process_match,
          origin_match: item.origin_match,
        });
      }

      return results;
    },
    enabled: Boolean(coffee?.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
