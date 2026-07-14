"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/data/auth";
import { createClient } from "@/lib/supabase/server";
import { getPostHogClient } from "@/lib/posthog-server";
import {
  toggleWishlistSchema,
  type ToggleWishlistFormData,
} from "@/lib/validations/wishlist";

type ActionResult<T = void> = {
  success: boolean;
  error?: string;
  data?: T;
};

/**
 * Current user's wishlisted coffee IDs (for hearts across the page).
 * Returns [] for signed-out users — the UI just shows empty hearts.
 */
export async function getMyWishlistCoffeeIds(): Promise<string[]> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlists")
    .select("coffee_id")
    .eq("user_id", currentUser.id);

  if (error) {
    console.error("getMyWishlistCoffeeIds error:", error);
    return [];
  }
  return (data ?? []).map((row) => row.coffee_id);
}

/**
 * Add or remove a coffee from the current user's wishlist.
 * Delete-then-insert-if-nothing-deleted — no RPC; UNIQUE(user_id, coffee_id) guards races.
 */
export async function toggleWishlist(
  data: ToggleWishlistFormData
): Promise<ActionResult<{ inWishlist: boolean }>> {
  try {
    const validationResult = toggleWishlistSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: validationResult.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "You must be logged in to use your wishlist.",
      };
    }

    const { coffeeId } = validationResult.data;
    const supabase = await createClient();

    const { data: removed, error: deleteError } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("coffee_id", coffeeId)
      .select("id");

    if (deleteError) {
      console.error("toggleWishlist delete error:", deleteError);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? deleteError.message
            : "Failed to update wishlist. Please try again.",
      };
    }

    if (removed && removed.length > 0) {
      getPostHogClient().capture({
        distinctId: currentUser.id,
        event: "wishlist_removed",
        properties: { coffee_id: coffeeId },
      });
      revalidatePath("/", "layout");
      return { success: true, data: { inWishlist: false } };
    }

    const { error: insertError } = await supabase
      .from("wishlists")
      .insert({ user_id: currentUser.id, coffee_id: coffeeId });

    // 23505 = already there (race with another tab); treat as success/added.
    if (insertError && insertError.code !== "23505") {
      console.error("toggleWishlist insert error:", insertError);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? insertError.message
            : "Failed to update wishlist. Please try again.",
      };
    }

    getPostHogClient().capture({
      distinctId: currentUser.id,
      event: "wishlist_added",
      properties: { coffee_id: coffeeId },
    });

    revalidatePath("/", "layout");
    return { success: true, data: { inWishlist: true } };
  } catch (e) {
    console.error("toggleWishlist:", e);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
