import { useQuery } from "@tanstack/react-query";
import { searchGearCatalog, type GearCatalogItem } from "@/app/actions/gear";

/**
 * Hook for searching gear catalog
 * Only searches after 2+ characters entered
 */
export function useGearSearch(
  query: string,
  category?: "grinder" | "brewer" | "accessory"
) {
  return useQuery<GearCatalogItem[]>({
    queryKey: ["gear-search", query, category],
    queryFn: async () => {
      const result = await searchGearCatalog(query, category);
      if (!result.success) {
        throw new Error(result.error || "Failed to search gear");
      }
      return result.data || [];
    },
    enabled: query.length >= 2, // Only search after 2+ chars
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
