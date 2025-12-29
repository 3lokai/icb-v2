"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/data/auth";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type {
  CreateReviewInput,
  DeleteReviewInput,
} from "@/types/review-types";
import { isValidRating, isValidComment } from "@/types/review-types";

type ActionResult<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};

// Generic UUID (accepts v1-v8-ish variants, not just v4)
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

/**
 * Ensure request has at least one meaningful signal.
 * Prevents empty rows that pollute stats and UI.
 */
function hasAnySignal(input: CreateReviewInput): boolean {
  return (
    (input.recommend !== undefined && input.recommend !== null) ||
    (input.rating !== undefined && input.rating !== null) ||
    (input.value_for_money !== undefined && input.value_for_money !== null) ||
    (input.works_with_milk !== undefined && input.works_with_milk !== null) ||
    (input.brew_method !== undefined && input.brew_method !== null) ||
    (input.comment !== undefined &&
      input.comment !== null &&
      input.comment.trim().length > 0)
  );
}

function devErrorMessage(err: unknown): string {
  if (!err || typeof err !== "object") return "Unknown error";
  const anyErr = err as any;
  const msg = anyErr?.message ? String(anyErr.message) : "Unknown error";
  const details = anyErr?.details ? ` (${String(anyErr.details)})` : "";
  const hint = anyErr?.hint ? ` - ${String(anyErr.hint)}` : "";
  return `${msg}${details}${hint}`;
}

function revalidateEntityPaths(
  entityType: "coffee" | "roaster",
  entityId: string
) {
  if (entityType === "coffee") {
    revalidatePath(`/coffees/${entityId}`);
    revalidatePath("/coffees");
  } else {
    revalidatePath(`/roasters/${entityId}`);
    revalidatePath("/roasters");
  }
}

/**
 * Resolve identity for write operations.
 * - If logged in: use user_id
 * - Else: use anon_id (must come from cookie/localStorage)
 *
 * Security stance:
 * - If cookie anon_id exists, it is the source of truth.
 * - If cookie is missing, accept client-provided anonId (and you should set cookie client-side).
 */
async function resolveIdentity(
  anonId?: string | null
): Promise<ActionResult<{ user_id: string | null; anon_id: string | null }>> {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    return { success: true, data: { user_id: currentUser.id, anon_id: null } };
  }

  // Anonymous: prefer cookie if present
  const cookieStore = await cookies();
  const cookieAnonId = cookieStore.get("icb_anon_id")?.value ?? null;

  const effectiveAnonId = cookieAnonId ?? anonId ?? null;

  if (!effectiveAnonId) {
    return { success: false, error: "Anonymous user ID is required." };
  }

  if (!isUuid(effectiveAnonId)) {
    return { success: false, error: "Invalid anonymous user ID format." };
  }

  // If both exist and mismatch, we treat as suspicious and fail hard.
  // This avoids "client spoofed anonId" scenarios.
  if (cookieAnonId && anonId && cookieAnonId !== anonId) {
    console.warn("Anon ID mismatch between client and cookie. Rejecting.", {
      client: anonId,
      cookie: cookieAnonId,
    });
    return {
      success: false,
      error: "Anonymous session mismatch. Please refresh and try again.",
    };
  }

  return { success: true, data: { user_id: null, anon_id: effectiveAnonId } };
}

/**
 * Create a new review (handles both new reviews and edits)
 *
 * Uses immutable history pattern - all edits create new INSERTs.
 * The latest_reviews_per_identity view automatically picks the latest by created_at DESC.
 */
export async function createReview(
  input: CreateReviewInput,
  anonId?: string | null
): Promise<ActionResult<{ id: string }>> {
  try {
    // Basic validation
    if (!input.entity_id || !isUuid(input.entity_id)) {
      return { success: false, error: "Invalid entity_id." };
    }

    if (!hasAnySignal(input)) {
      return {
        success: false,
        error:
          "Please provide at least one rating/recommendation/detail/comment.",
      };
    }

    if (!isValidRating(input.rating ?? null)) {
      return { success: false, error: "Rating must be between 1 and 5." };
    }

    if (!isValidComment(input.comment ?? null)) {
      return {
        success: false,
        error: "Comment must be 5000 characters or less.",
      };
    }

    const identity = await resolveIdentity(anonId);
    if (!identity.success || !identity.data) {
      return {
        success: false,
        error: identity.error || "Failed to resolve identity.",
      };
    }

    const { user_id, anon_id } = identity.data;

    const supabase = await createServiceRoleClient();

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        entity_type: input.entity_type,
        entity_id: input.entity_id,
        user_id,
        anon_id,
        recommend: input.recommend ?? null,
        rating: input.rating ?? null,
        value_for_money: input.value_for_money ?? null,
        works_with_milk: input.works_with_milk ?? null,
        brew_method: input.brew_method ?? null,
        comment: input.comment?.trim() ? input.comment.trim() : null,
        status: "active",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Review creation error:", error);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? devErrorMessage(error)
            : "Failed to create review. Please try again.",
      };
    }

    revalidateEntityPaths(input.entity_type, input.entity_id);

    return { success: true, data: { id: data.id } };
  } catch (error) {
    console.error("Unexpected error creating review:", error);
    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? devErrorMessage(error)
          : "An unexpected error occurred. Please try again.",
    };
  }
}

/**
 * Soft delete the latest active review for an identity+entity
 *
 * Finds the latest active review for the given identity (user_id or anon_id)
 * and entity, then sets its status to 'deleted'.
 */
export async function deleteReview(
  input: DeleteReviewInput,
  anonId?: string | null
): Promise<ActionResult> {
  try {
    if (!input.entity_id || !isUuid(input.entity_id)) {
      return { success: false, error: "Invalid entity_id." };
    }

    const identity = await resolveIdentity(anonId);
    if (!identity.success || !identity.data) {
      return {
        success: false,
        error: identity.error || "Failed to resolve identity.",
      };
    }

    const { user_id, anon_id } = identity.data;

    const supabase = await createServiceRoleClient();

    let query = supabase
      .from("reviews")
      .select("id")
      .eq("entity_type", input.entity_type)
      .eq("entity_id", input.entity_id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);

    if (user_id) {
      query = query.eq("user_id", user_id);
    } else {
      query = query.eq("anon_id", anon_id);
    }

    const { data: rows, error: findError } = await query;

    if (findError) {
      console.error("Error finding review to delete:", findError);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? devErrorMessage(findError)
            : "Failed to find review. Please try again.",
      };
    }

    const reviewId = rows?.[0]?.id;
    if (!reviewId) {
      return { success: false, error: "No active review found to delete." };
    }

    const { error: updateError } = await supabase
      .from("reviews")
      .update({ status: "deleted" })
      .eq("id", reviewId);

    if (updateError) {
      console.error("Error deleting review:", updateError);
      return {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? devErrorMessage(updateError)
            : "Failed to delete review. Please try again.",
      };
    }

    revalidateEntityPaths(input.entity_type, input.entity_id);

    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting review:", error);
    return {
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? devErrorMessage(error)
          : "An unexpected error occurred. Please try again.",
    };
  }
}
