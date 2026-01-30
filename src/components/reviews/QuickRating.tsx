"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  startTransition,
} from "react";
import { toast } from "sonner";
import {
  useCreateReview,
  useDeleteReview,
  useReviews,
} from "@/hooks/use-reviews";
import {
  ensureAnonId,
  getReviewCount,
  setReviewCount,
} from "@/lib/reviews/anon-id";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/common/Icon";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { GRIND_TYPES } from "@/lib/utils/coffee-constants";
import type { LatestReviewPerIdentity } from "@/types/review-types";
import type { GrindEnum } from "@/types/db-enums";

type QuickRatingProps = {
  entityType: "coffee" | "roaster";
  entityId: string;
  initialRating?: number;
  onClose?: () => void;
  variant?: "modal" | "inline";
};

/**
 * QuickRating - Lightweight rating component for modal or inline flow
 *
 * Modal variant: Used when user clicks a star on CoffeeCard. Shows full form with rating
 * and comment, saves only on explicit submit.
 *
 * Inline variant: Embedded directly in page, no dialog chrome, simpler layout.
 */
export function QuickRating({
  entityType,
  entityId,
  initialRating,
  onClose: _onClose,
  variant = "modal",
}: QuickRatingProps) {
  const [isLimitReached, setIsLimitReached] = useState(false);

  const pathname = usePathname();

  const { data: reviews } = useReviews(entityType, entityId);
  const {
    createReview,
    isLoading,
    isSuccess,
    cleanup,
    isError,
    error,
    isDebouncing,
  } = useCreateReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  // Form state
  const [rating, setRating] = useState<number>(initialRating ?? 0);
  const [comment, setComment] = useState<string>("");
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [valueForMoney, setValueForMoney] = useState<boolean | null>(null);
  const [worksWithMilk, setWorksWithMilk] = useState<boolean | null>(null);
  const [brewMethod, setBrewMethod] = useState<GrindEnum | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const hasAutoSavedRef = useRef(false);
  const hasShownSuccessToastRef = useRef(false);

  // Resolve identity
  const [identityKey, setIdentityKey] = useState<string | null>(null);

  useEffect(() => {
    async function resolveIdentity() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setIdentityKey(`user:${user.id}`);
          setIsLimitReached(false);
        } else {
          const anonId = ensureAnonId();
          if (anonId) {
            setIdentityKey(`anon:${anonId}`);
            // Check limit immediately when identity is resolved
            const currentCount = getReviewCount();
            if (currentCount !== null && currentCount >= 3) {
              setIsLimitReached(true);
            } else {
              setIsLimitReached(false);
            }
          }
        }
      } catch {
        const anonId = ensureAnonId();
        if (anonId) {
          setIdentityKey(`anon:${anonId}`);
          // Check limit immediately when identity is resolved
          const currentCount = getReviewCount();
          if (currentCount !== null && currentCount >= 3) {
            setIsLimitReached(true);
          } else {
            setIsLimitReached(false);
          }
        }
      }
    }
    resolveIdentity();
  }, []);

  // Find user's existing review
  const userReview = useMemo<LatestReviewPerIdentity | null>(() => {
    if (!reviews || !identityKey) return null;
    return reviews.find((r) => r.identity_key === identityKey) || null;
  }, [reviews, identityKey]);

  // Sync from existing review if present
  useEffect(() => {
    if (userReview) {
      startTransition(() => {
        setRating(userReview.rating ?? 0);
        setComment(userReview.comment ?? "");
        setRecommend(userReview.recommend ?? null);
        setValueForMoney(userReview.value_for_money ?? null);
        setWorksWithMilk(userReview.works_with_milk ?? null);
        setBrewMethod(userReview.brew_method ?? null);
      });
    }
  }, [userReview]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Check limit for anon users
  const checkLimitBeforeCreate = useCallback(() => {
    if (isLimitReached) {
      return true;
    }
    if (identityKey && identityKey.startsWith("anon:")) {
      const currentCount = getReviewCount();
      if (currentCount !== null && currentCount >= 3) {
        setIsLimitReached(true);
        return true;
      }
    }
    return false;
  }, [identityKey, isLimitReached]);

  // Auto-save initial rating when modal opens with initialRating
  useEffect(() => {
    if (
      initialRating &&
      !hasAutoSavedRef.current &&
      !userReview &&
      identityKey &&
      !isLimitReached
    ) {
      hasAutoSavedRef.current = true;
      createReview({
        entity_type: entityType,
        entity_id: entityId,
        recommend: null,
        rating: initialRating,
        value_for_money: null,
        works_with_milk: null,
        brew_method: null,
        comment: null,
      });
    }
  }, [
    initialRating,
    userReview,
    identityKey,
    entityType,
    entityId,
    createReview,
    isLimitReached,
  ]);

  // Handle limit error from API
  useEffect(() => {
    if (!identityKey || !identityKey.startsWith("anon:")) return;

    if (isError && error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("ANON_LIMIT_REACHED") ||
        errorMessage.includes("limit")
      ) {
        // Use startTransition to avoid cascading renders
        startTransition(() => {
          setIsLimitReached(true);
        });
      }
    }
  }, [isError, error, identityKey]);

  // Rating click handler - only updates local state
  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  // Submit handler - saves rating and comment together
  const handleSubmit = () => {
    if (rating === 0) return; // Require rating
    if (checkLimitBeforeCreate()) return;
    createReview({
      entity_type: entityType,
      entity_id: entityId,
      recommend: recommend,
      rating: rating,
      value_for_money: valueForMoney,
      works_with_milk: worksWithMilk,
      brew_method: brewMethod,
      comment: comment || null,
    });
  };

  // Delete handler
  const handleDelete = () => {
    const anonId = ensureAnonId();
    deleteReview(
      {
        input: { entity_type: entityType, entity_id: entityId },
        anonId,
      },
      {
        onSuccess: () => {
          if (identityKey && identityKey.startsWith("anon:")) {
            const currentCount = getReviewCount();
            if (currentCount !== null && currentCount > 0) {
              setReviewCount(currentCount - 1);
            }
          }
          setRating(0);
          setComment("");
          setRecommend(null);
          setValueForMoney(null);
          setWorksWithMilk(null);
          setBrewMethod(null);
        },
      }
    );
  };

  // Determine if saved
  const isSaved = isSuccess || userReview !== null;
  const isSaving = isLoading || isDebouncing;

  // Show success toast on successful submission
  useEffect(() => {
    if (isSuccess && !hasShownSuccessToastRef.current) {
      hasShownSuccessToastRef.current = true;
      toast.success("Your rating has been submitted and added to your profile");
    }
    // Reset toast flag when submission state changes
    if (!isSuccess && !isSaving) {
      hasShownSuccessToastRef.current = false;
    }
  }, [isSuccess, isSaving]);

  const isInline = variant === "inline";
  const paddingClass = isInline ? "p-0" : "p-6 md:p-8";
  const headerAlignment = isInline ? "text-left" : "text-center";

  return (
    <>
      {/* Limit Content - Show in parent modal when limit reached */}
      {isLimitReached ? (
        <div className={paddingClass}>
          {!isInline && (
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary/60 opacity-60 z-10" />
          )}
          <div
            className={cn(
              isInline
                ? "pb-6"
                : "p-8 md:p-10 pb-6 border-b border-border/10 pt-10"
            )}
          >
            <p className="text-overline tracking-[0.1em] text-muted-foreground/60 mb-1 text-left">
              Limit Reached
            </p>
            <h3 className="text-title text-primary leading-none text-left">
              Unlock Unlimited Reviews
            </h3>
            <p className="text-body text-muted-foreground mt-2 text-left">
              You&apos;ve reached the limit for anonymous reviews. Sign in to
              continue rating coffees and track your tasting journey.
            </p>
          </div>
          <div
            className={cn(
              isInline ? "pt-6" : "p-8 md:p-10 pt-6",
              "flex flex-col gap-4"
            )}
          >
            <Button asChild className="w-full" size="lg">
              <Link href={`/auth?from=${encodeURIComponent(pathname)}`}>
                Sign in / Sign up
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Main Content - Rating form */
        <div className={paddingClass}>
          <Stack gap="6">
            {/* Header */}
            {!isInline && (
              <Stack gap="2" className={headerAlignment}>
                <div
                  className={cn(
                    "inline-flex items-center gap-3",
                    isInline ? "" : "justify-center mx-auto"
                  )}
                >
                  <span className="h-px w-6 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.1em]">
                    {initialRating ? "Thank you" : `Rate this ${entityType}`}
                  </span>
                  <span className="h-px w-6 bg-accent/60" />
                </div>
                <h3 className="text-title text-balance leading-tight">
                  {initialRating ? (
                    "Rating has been submitted"
                  ) : (
                    <>
                      How was your{" "}
                      <span className="text-accent italic">
                        {entityType === "coffee" ? "Brew?" : "Experience?"}
                      </span>
                    </>
                  )}
                </h3>
                <p className="text-body text-muted-foreground">
                  {initialRating
                    ? entityType === "coffee"
                      ? "Share your thoughts to help others find their perfect cup."
                      : "Share your thoughts to help others discover great roasters."
                    : entityType === "coffee"
                      ? "Share your experience to help others discover great coffee"
                      : "Share your experience to help others discover great roasters"}
                </p>
              </Stack>
            )}

            {/* Rating Stars */}
            <div
              className={cn(
                "flex items-center gap-3",
                isInline ? "justify-start" : "justify-center"
              )}
              onMouseLeave={() => setHoveredStar(null)}
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = hoveredStar
                  ? star <= hoveredStar
                  : rating >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    disabled={isSaving || isDeleting}
                    className="transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Icon
                      name="Star"
                      size={36}
                      className={cn(
                        "transition-all duration-200",
                        isFilled
                          ? "text-amber-500 fill-amber-500 drop-shadow-sm"
                          : "text-muted-foreground/30"
                      )}
                    />
                  </button>
                );
              })}
              {rating > 0 && (
                <span className="text-body font-medium text-muted-foreground ml-2">
                  {rating}/5
                </span>
              )}
            </div>

            {/* Comment - always visible */}
            <Stack gap="3">
              <Textarea
                placeholder={`Any notes to share about this ${entityType}?`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSaving || isDeleting}
                className="min-h-[80px] resize-none border-border/60 focus:border-primary/50 transition-colors bg-muted/5"
                maxLength={500}
              />
              {comment && comment.length > 0 && (
                <p className="text-caption text-muted-foreground text-right">
                  {comment.length}/500
                </p>
              )}
            </Stack>

            {/* Additional Details */}
            <Stack gap="6" className="pt-2 border-t border-border/40">
              {/* 2 Column Layout for Non-Mobile */}
              <div className="flex flex-col md:flex-row md:flex-wrap gap-6">
                {/* First Row, Column 1: Brew method */}
                {entityType === "coffee" && (
                  <div className="flex-1 min-w-0 md:min-w-[calc(50%-0.75rem)]">
                    <Stack gap="3">
                      <label className="text-label uppercase tracking-widest">
                        Brew method used
                      </label>
                      <Select
                        value={brewMethod ?? "none"}
                        onValueChange={(value) =>
                          setBrewMethod(
                            value === "none" ? null : (value as GrindEnum)
                          )
                        }
                        disabled={isSaving || isDeleting}
                      >
                        <SelectTrigger className="w-full h-9 border-border/60 focus:border-primary/50 bg-muted/5">
                          <SelectValue placeholder="How did you brew this coffee?" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRIND_TYPES.filter(
                            (grind) => grind.value !== "whole"
                          ).map((grind) => (
                            <SelectItem key={grind.value} value={grind.value}>
                              {grind.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Stack>
                  </div>
                )}

                {/* First Row, Column 2: Add to Recommendations */}
                <div className="flex-1 min-w-0 md:min-w-[calc(50%-0.75rem)]">
                  <Stack gap="3">
                    <label className="text-label uppercase tracking-widest">
                      Recommendations
                    </label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="recommend"
                        checked={recommend === true}
                        onCheckedChange={(checked) => {
                          setRecommend(checked === true ? true : null);
                        }}
                        disabled={isSaving || isDeleting}
                      />
                      <label
                        htmlFor="recommend"
                        className="text-caption text-foreground cursor-pointer select-none"
                      >
                        Add to &quot;My Selections&quot;
                      </label>
                    </div>
                  </Stack>
                </div>

                {/* Second Row, Column 1: Value for Money */}
                <div className="flex-1 min-w-0 md:min-w-[calc(50%-0.75rem)]">
                  <Stack gap="3">
                    <label className="text-label uppercase tracking-widest">
                      Value for money
                    </label>
                    <Cluster gap="2" className="flex-wrap">
                      <Button
                        type="button"
                        variant={valueForMoney === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => setValueForMoney(true)}
                        disabled={isSaving || isDeleting}
                        className={cn(
                          "h-9 px-4",
                          valueForMoney === true && "shadow-sm"
                        )}
                      >
                        <Icon name="ThumbsUp" size={14} className="mr-1.5" />
                        Good
                      </Button>
                      <Button
                        type="button"
                        variant={
                          valueForMoney === false ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setValueForMoney(false)}
                        disabled={isSaving || isDeleting}
                        className={cn(
                          "h-9 px-4",
                          valueForMoney === false && "shadow-sm"
                        )}
                      >
                        <Icon name="ThumbsDown" size={14} className="mr-1.5" />
                        Poor
                      </Button>
                      {valueForMoney !== null && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setValueForMoney(null)}
                          disabled={isSaving || isDeleting}
                          className="h-9 px-3 text-muted-foreground hover:text-foreground"
                        >
                          Clear
                        </Button>
                      )}
                    </Cluster>
                  </Stack>
                </div>

                {/* Second Row, Column 2: Profile suitability - coffee only */}
                {entityType === "coffee" && (
                  <div className="flex-1 min-w-0 md:min-w-[calc(50%-0.75rem)]">
                    <Stack gap="3">
                      <label className="text-label uppercase tracking-widest">
                        Profile suitability
                      </label>
                      <Cluster gap="2" className="flex-wrap">
                        <Button
                          type="button"
                          variant={
                            worksWithMilk === false ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setWorksWithMilk(false)}
                          disabled={isSaving || isDeleting}
                          className={cn(
                            "h-9 px-4",
                            worksWithMilk === false && "shadow-sm"
                          )}
                        >
                          Black
                        </Button>
                        <Button
                          type="button"
                          variant={
                            worksWithMilk === true ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setWorksWithMilk(true)}
                          disabled={isSaving || isDeleting}
                          className={cn(
                            "h-9 px-4",
                            worksWithMilk === true && "shadow-sm"
                          )}
                        >
                          Milk
                        </Button>
                        {worksWithMilk !== null && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setWorksWithMilk(null)}
                            disabled={isSaving || isDeleting}
                            className="h-9 px-3 text-muted-foreground hover:text-foreground"
                          >
                            Clear
                          </Button>
                        )}
                      </Cluster>
                    </Stack>
                  </div>
                )}
              </div>
            </Stack>

            {/* Status indicator */}
            {isSaving && (
              <div className="flex items-center justify-center gap-2 text-caption text-muted-foreground">
                <Icon name="CircleNotch" size={14} className="animate-spin" />
                Saving...
              </div>
            )}

            {isSaved && !isSaving && (
              <div className="flex items-center justify-center">
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1"
                >
                  <Icon name="Check" size={12} className="mr-1.5" />
                  Saved
                </Badge>
              </div>
            )}

            {/* Submit button */}
            {!isSaved && (
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSaving}
                className={isInline ? "w-full sm:w-auto" : "w-full"}
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Icon
                      name="CircleNotch"
                      size={16}
                      className="mr-2 animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  "Submit Rating"
                )}
              </Button>
            )}

            {/* Actions - show after save */}
            {isSaved && (
              <Cluster gap="2" className="pt-2 border-t border-border/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Icon name="TrashSimple" size={14} className="mr-1.5" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </Cluster>
            )}
          </Stack>
        </div>
      )}
    </>
  );
}
