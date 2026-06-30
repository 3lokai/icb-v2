"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { createClient } from "@/lib/supabase/client";
import type { SearchableItem } from "@/types/search";

// Minimum characters before we hit the server (matches old Fuse minMatchCharLength).
export const SEARCH_MIN_CHARS = 2;
const RESULT_LIMIT = 25;

/**
 * Global directory search across coffees + roasters.
 * Calls the `search_directory` Postgres RPC, which returns ready-to-render
 * SearchableItem rows (FTS relevance + pg_trgm typo tolerance). Replaces the
 * old client-side Fuse.js index download.
 */
export function useSearchDirectory(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: queryKeys.search.directory(trimmed),
    enabled: trimmed.length >= SEARCH_MIN_CHARS,
    staleTime: 60 * 1000, // dedupe repeated queries within a session
    // Keep the prior results on screen while the next query loads, so the modal
    // doesn't flash empty/skeleton between keystrokes.
    placeholderData: keepPreviousData,
    queryFn: async (): Promise<SearchableItem[]> => {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("search_directory", {
        q: trimmed,
        lim: RESULT_LIMIT,
      });

      if (error) {
        throw new Error(error.message);
      }

      // RPC returns SETOF jsonb, each row already shaped as a SearchableItem.
      return (data ?? []) as unknown as SearchableItem[];
    },
  });
}
