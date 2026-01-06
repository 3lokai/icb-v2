"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import { createReview, deleteReview } from "@/app/actions/reviews";
import { ensureAnonId, setReviewCount } from "@/lib/reviews/anon-id";
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

      // Fetch reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from("latest_reviews_per_identity")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: false });

      if (reviewsError) {
        throw reviewsError;
      }

      if (!reviews || reviews.length === 0) {
        return [];
      }

      // Get unique user IDs from reviews
      const userIds = reviews
        .map((r) => r.user_id)
        .filter((id): id is string => id !== null);

      // Fetch user profiles for authenticated users
      const userProfilesMap = new Map<
        string,
        {
          id: string;
          username: string | null;
          full_name: string;
          avatar_url: string | null;
        }
      >();

      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("user_profiles")
          .select("id, username, full_name, avatar_url")
          .in("id", userIds);

        if (!profilesError && profiles) {
          profiles.forEach((profile) => {
            userProfilesMap.set(profile.id, profile);
          });
        }
      }

      // Merge reviews with user profiles
      return reviews.map((review) => ({
        ...review,
        user_profiles: review.user_id
          ? userProfilesMap.get(review.user_id) || null
          : null,
      })) as (LatestReviewPerIdentity & {
        user_profiles: {
          id: string;
          username: string | null;
          full_name: string;
          avatar_url: string | null;
        } | null;
      })[];
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
        // Check if it's the limit error
        if (result.error === "ANON_LIMIT_REACHED") {
          const error = new Error(result.error);
          (error as any).data = result.data;
          throw error;
        }
        throw new Error(result.error || "Failed to create review");
      }
      return result.data;
    },
    onSuccess: (data, variables) => {
      // Sync review count from server (server is source of truth)
      if (data && data.review_count !== undefined) {
        setReviewCount(data.review_count);
      }
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
    reviewCount: mutation.data?.review_count,
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
