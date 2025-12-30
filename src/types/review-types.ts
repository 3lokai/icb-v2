import type { Database } from "./supabase-types";
import type {
  ReviewEntityTypeEnum,
  ReviewStatusEnum,
  GrindEnum,
} from "./db-enums";

// ============================================================================
// REVIEW TABLE TYPES
// ============================================================================

/**
 * Review row from the reviews table
 */
export type Review = Database["public"]["Tables"]["reviews"]["Row"];

/**
 * Review insert type (for creating new reviews)
 */
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

/**
 * Review update type (for updating reviews - mainly for soft delete)
 */
export type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];

// ============================================================================
// REVIEW VIEW TYPES
// ============================================================================

/**
 * Latest review per identity (from latest_reviews_per_identity view)
 * This is the "public truth" - only the latest active review per identity is shown
 */
export type LatestReviewPerIdentity =
  Database["public"]["Views"]["latest_reviews_per_identity"]["Row"];

/**
 * Entity review statistics (from entity_review_stats view)
 * Aggregated stats computed from latest active reviews per entity
 */
export type EntityReviewStats =
  Database["public"]["Views"]["entity_review_stats"]["Row"];

// ============================================================================
// REVIEW INPUT TYPES
// ============================================================================

/**
 * Input for creating a new review
 * All edits create new reviews (immutable history pattern)
 */
export interface CreateReviewInput {
  entity_type: ReviewEntityTypeEnum;
  entity_id: string;
  recommend?: boolean | null;
  rating?: number | null; // 1-5
  value_for_money?: boolean | null;
  works_with_milk?: boolean | null; // null = unknown, true = works with milk, false = better black
  brew_method?: GrindEnum | null;
  comment?: string | null;
}

/**
 * Input for soft deleting a review
 */
export interface DeleteReviewInput {
  entity_type: ReviewEntityTypeEnum;
  entity_id: string;
}

// ============================================================================
// REVIEW DISPLAY TYPES
// ============================================================================

/**
 * Review with computed identity key for display
 */
export interface ReviewWithIdentity extends LatestReviewPerIdentity {
  identity_key: string; // 'user:<uuid>' or 'anon:<uuid>'
}

/**
 * Review stats for display
 */
export interface ReviewStatsDisplay {
  review_count: number;
  rating_count: number;
  avg_rating: number | null;
  recommend_pct: number | null;
  last_review_at: string | null;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check if a review is for a coffee
 */
export function isCoffeeReview(
  review: Review | LatestReviewPerIdentity
): review is Review & { entity_type: "coffee" } {
  return review.entity_type === "coffee";
}

/**
 * Check if a review is for a roaster
 */
export function isRoasterReview(
  review: Review | LatestReviewPerIdentity
): review is Review & { entity_type: "roaster" } {
  return review.entity_type === "roaster";
}

/**
 * Check if a review is active
 */
export function isActiveReview(
  review: Review | LatestReviewPerIdentity
): boolean {
  return review.status === "active";
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate rating value (1-5)
 */
export function isValidRating(rating: number | null | undefined): boolean {
  if (rating === null || rating === undefined) {
    return true; // null is valid (optional field)
  }
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Validate comment length (optional, max 1000 chars)
 */
export function isValidComment(comment: string | null | undefined): boolean {
  if (comment === null || comment === undefined || comment === "") {
    return true; // null/empty is valid (optional field)
  }
  return comment.length <= 1000;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract entity type from review
 */
export type ReviewEntityType<T extends Review | LatestReviewPerIdentity> =
  T["entity_type"];

/**
 * Review fields that can be updated (mainly for soft delete)
 */
export type ReviewUpdatableFields = Pick<ReviewUpdate, "status">;
