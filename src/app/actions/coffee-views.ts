"use server";

import { cookies } from "next/headers";
import { getCurrentUser } from "@/data/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";

type ActionResult<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Resolve anon id for coffee view writes (same stance as reviews: cookie is source of truth).
 */
async function resolveAnonIdForView(
  clientAnonId?: string | null
): Promise<ActionResult<{ anon_id: string }>> {
  const cookieStore = await cookies();
  const cookieAnonId = cookieStore.get("icb_anon_id")?.value ?? null;
  const effectiveAnonId = cookieAnonId ?? clientAnonId ?? null;

  if (!effectiveAnonId) {
    return { success: false, error: "Anonymous user ID is required." };
  }

  if (!isUuid(effectiveAnonId)) {
    return { success: false, error: "Invalid anonymous user ID format." };
  }

  if (cookieAnonId && clientAnonId && cookieAnonId !== clientAnonId) {
    return {
      success: false,
      error: "Anonymous session mismatch. Please refresh and try again.",
    };
  }

  return { success: true, data: { anon_id: effectiveAnonId } };
}

/**
 * Increment aggregated coffee detail view count (once per page mount; client aligns with analytics).
 */
export async function recordCoffeeView(
  coffeeId: string,
  clientAnonId?: string | null
): Promise<ActionResult> {
  if (!isUuid(coffeeId)) {
    return { success: false, error: "Invalid coffee id." };
  }

  const supabase = await createServiceRoleClient();
  const now = new Date().toISOString();

  const user = await getCurrentUser();
  if (user) {
    const { data: existing, error: selErr } = await supabase
      .from("coffee_views")
      .select("id, view_count")
      .eq("user_id", user.id)
      .eq("coffee_id", coffeeId)
      .maybeSingle();

    if (selErr) {
      console.error("[recordCoffeeView] select user row:", selErr);
      return { success: false, error: "Could not record view." };
    }

    if (existing) {
      const { error: upErr } = await supabase
        .from("coffee_views")
        .update({
          view_count: existing.view_count + 1,
          last_viewed_at: now,
        })
        .eq("id", existing.id);

      if (upErr) {
        console.error("[recordCoffeeView] update user row:", upErr);
        return { success: false, error: "Could not record view." };
      }
    } else {
      const { error: insErr } = await supabase.from("coffee_views").insert({
        user_id: user.id,
        anon_id: null,
        coffee_id: coffeeId,
        view_count: 1,
        first_viewed_at: now,
        last_viewed_at: now,
      });

      if (insErr) {
        console.error("[recordCoffeeView] insert user row:", insErr);
        return { success: false, error: "Could not record view." };
      }
    }

    return { success: true };
  }

  const anon = await resolveAnonIdForView(clientAnonId);
  if (!anon.success || !anon.data) {
    return { success: false, error: anon.error ?? "Anonymous id required." };
  }

  const { anon_id } = anon.data;

  const { data: existing, error: selErr } = await supabase
    .from("coffee_views")
    .select("id, view_count")
    .eq("anon_id", anon_id)
    .eq("coffee_id", coffeeId)
    .maybeSingle();

  if (selErr) {
    console.error("[recordCoffeeView] select anon row:", selErr);
    return { success: false, error: "Could not record view." };
  }

  if (existing) {
    const { error: upErr } = await supabase
      .from("coffee_views")
      .update({
        view_count: existing.view_count + 1,
        last_viewed_at: now,
      })
      .eq("id", existing.id);

    if (upErr) {
      console.error("[recordCoffeeView] update anon row:", upErr);
      return { success: false, error: "Could not record view." };
    }
  } else {
    const { error: insErr } = await supabase.from("coffee_views").insert({
      user_id: null,
      anon_id,
      coffee_id: coffeeId,
      view_count: 1,
      first_viewed_at: now,
      last_viewed_at: now,
    });

    if (insErr) {
      console.error("[recordCoffeeView] insert anon row:", insErr);
      return { success: false, error: "Could not record view." };
    }
  }

  return { success: true };
}

export type MergeCoffeeViewsResult = {
  rows_relinked: number;
  rows_merged: number;
};

/**
 * Attach anonymous coffee_views to the current session user. Idempotent if nothing to merge.
 */
export async function mergeCoffeeViewsFromAnon(
  anonId: string | null | undefined
): Promise<ActionResult<MergeCoffeeViewsResult>> {
  if (!anonId || !isUuid(anonId)) {
    return { success: false, error: "Invalid anonymous id." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "Not authenticated." };
  }

  const supabase = await createServiceRoleClient();
  const { data, error } = await supabase.rpc("merge_coffee_views_for_anon", {
    p_user_id: user.id,
    p_anon_id: anonId,
  });

  if (error) {
    console.error("[mergeCoffeeViewsFromAnon] rpc:", error);
    return { success: false, error: "Merge failed." };
  }

  const row = Array.isArray(data) ? data[0] : data;
  const rowsRelinked =
    row && typeof row === "object" && "rows_relinked" in row
      ? Number((row as { rows_relinked: number }).rows_relinked)
      : 0;
  const rowsMerged =
    row && typeof row === "object" && "rows_merged" in row
      ? Number((row as { rows_merged: number }).rows_merged)
      : 0;

  return {
    success: true,
    data: { rows_relinked: rowsRelinked, rows_merged: rowsMerged },
  };
}
