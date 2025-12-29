"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import { createReview, deleteReview } from "@/app/actions/reviews";
import { ensureAnonId } from "@/lib/reviews/anon-id";
import type {
  CreateReviewInput,
  DeleteReviewInput,
  LatestReviewPerIdentity,
  EntityReviewStats,
} from "@/types/review-types";

/**
 * Fetch latest reviews per identity for an entity
 * Uses the latest_reviews_per_identity view
 */
export function useReviews(entityType: "coffee" | "roaster", entityId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.byEntity(entityType, entityId),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("latest_reviews_per_identity")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as LatestReviewPerIdentity[];
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Fetch review statistics for an entity
 * Uses the entity_review_stats view
 */
export function useReviewStats(
  entityType: "coffee" | "roaster",
  entityId: string
) {
  return useQuery({
    queryKey: queryKeys.reviews.stats(entityType, entityId),
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("entity_review_stats")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .single();

      if (error) {
        // If no stats exist yet, return null (not an error)
        if (error.code === "PGRST116") {
          return null;
        }
        throw error;
      }

      return data as EntityReviewStats | null;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for creating reviews with debouncing
 *
 * Implements 500-800ms debounce to prevent spam.
 * All edits create new reviews (immutable history pattern).
 */
export function useCreateReview() {
  const queryClient = useQueryClient();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingMutationRef = useRef<{
    input: CreateReviewInput;
    anonId: string | null;
  } | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [lastSuccess, setLastSuccess] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      input,
      anonId,
    }: {
      input: CreateReviewInput;
      anonId: string | null;
    }) => {
      const result = await createReview(input, anonId);
      if (!result.success) {
        throw new Error(result.error || "Failed to create review");
      }
      return result.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byEntity(
          variables.input.entity_type,
          variables.input.entity_id
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.stats(
          variables.input.entity_type,
          variables.input.entity_id
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.latest(
          variables.input.entity_type,
          variables.input.entity_id
        ),
      });
      // Set success flag (will be reset when user makes new changes)
      setLastSuccess(true);
    },
    onError: () => {
      setLastSuccess(false);
    },
  });

  const createReviewDebounced = useCallback(
    (input: CreateReviewInput) => {
      // Reset success state when user makes new changes
      setLastSuccess(false);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Get or ensure anon ID (client-side only)
      const anonId = ensureAnonId();

      // Store pending mutation
      pendingMutationRef.current = { input, anonId };

      // Set debouncing state
      setIsDebouncing(true);

      // Set new debounce timer (600ms - middle of 500-800ms range)
      debounceTimerRef.current = setTimeout(() => {
        if (pendingMutationRef.current) {
          setIsDebouncing(false);
          mutation.mutate(pendingMutationRef.current);
          pendingMutationRef.current = null;
        } else {
          setIsDebouncing(false);
        }
      }, 600);
    },
    [mutation]
  );

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  return {
    createReview: createReviewDebounced,
    isLoading: mutation.isPending, // Only true during actual mutation, not debouncing
    isDebouncing, // Separate flag for debouncing state
    isSuccess: lastSuccess && !isDebouncing && !mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    cleanup,
  };
}

/**
 * Hook for deleting reviews (soft delete)
 *
 * Finds and soft deletes the latest active review for the identity+entity.
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      input,
      anonId,
    }: {
      input: DeleteReviewInput;
      anonId: string | null;
    }) => {
      const result = await deleteReview(input, anonId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete review");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.byEntity(
          variables.input.entity_type,
          variables.input.entity_id
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.stats(
          variables.input.entity_type,
          variables.input.entity_id
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.latest(
          variables.input.entity_type,
          variables.input.entity_id
        ),
      });
    },
  });
}
