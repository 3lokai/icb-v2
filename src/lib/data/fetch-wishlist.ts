import "server-only";

import { createClient } from "@/lib/supabase/server";

/**
 * Wishlisted coffee IDs for a user, newest first.
 * RLS gates visibility: owner sees own, others see it only on public profiles.
 * Returns [] when the viewer isn't allowed to read (no error leak).
 */
export async function fetchWishlistCoffeeIds(
  userId: string
): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlists")
    .select("coffee_id")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("fetchWishlistCoffeeIds error:", error);
    return [];
  }

  return (data ?? []).map((row) => row.coffee_id);
}
