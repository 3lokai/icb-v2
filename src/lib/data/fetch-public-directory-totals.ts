import { createServiceRoleClient } from "@/lib/supabase/server";
import { PUBLIC_COFFEE_STATUSES } from "@/lib/utils/coffee-constants";
import type { CoffeeFilterMeta } from "@/types/coffee-types";

export type PublicDirectoryTotals = CoffeeFilterMeta["totals"];

/**
 * Head-count totals for the public coffee directory (same semantics as
 * CoffeeFilterMeta.totals). Lightweight — use on homepage instead of full
 * fetchCoffeeFilterMeta.
 */
export async function fetchPublicDirectoryTotals(): Promise<PublicDirectoryTotals> {
  const supabase = await createServiceRoleClient();

  const [coffeesResult, roastersResult] = await Promise.all([
    supabase
      .from("coffee_summary")
      .select("coffee_id", { count: "exact", head: true })
      .in("status", PUBLIC_COFFEE_STATUSES),
    supabase
      .from("roasters")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  if (coffeesResult.error) {
    throw coffeesResult.error;
  }
  if (roastersResult.error) {
    throw roastersResult.error;
  }

  return {
    coffees: coffeesResult.count ?? 0,
    roasters: roastersResult.count ?? 0,
  };
}
