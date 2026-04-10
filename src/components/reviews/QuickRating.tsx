"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  startTransition,
} from "react";
import { capture } from "@/lib/posthog";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { GRIND_TYPES } from "@/lib/utils/coffee-constants";
import { useSearchContext } from "@/providers/SearchProvider";
import type { LatestReviewPerIdentity } from "@/types/review-types";
import type { GrindEnum } from "@/types/db-enums";

type QuickRatingProps = {
  entityType: "coffee" | "roaster";
  entityId: string;
  slug?: string;
  initialRating?: number;
  onClose?: () => void;
  onSavedStateChange?: (isSaved: boolean) => void;
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
  slug,
  initialRating,
  onClose: _onClose,
  onSavedStateChange,
  variant = "modal",
}: QuickRatingProps) {
  const [isLimitReached, setIsLimitReached] = useState(false);

  const pathname = usePathname();
  const { openSearch } = useSearchContext();

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
  const [worksWithMilk, setWorksWithMilk] = useState<boolean | null>(null);
  const [brewMethod, setBrewMethod] = useState<GrindEnum | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const hasShownSuccessToastRef = useRef(false);
  const formTouchedRef = useRef(false);
  const submitSucceededRef = useRef(false);

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
        setWorksWithMilk(userReview.works_with_milk ?? null);
        setBrewMethod(userReview.brew_method ?? null);
      });
    }
  }, [userReview]);

  // Cleanup debounce + abandon tracking on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (formTouchedRef.current && !submitSucceededRef.current) {
        capture("rating_form_abandoned", {
          entity_type: entityType,
          entity_id: entityId,
          variant,
        });
      }
    };
  }, [cleanup, entityType, entityId, variant]);

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
    formTouchedRef.current = true;
    if (!hasStarted) {
      capture("rating_started", {
        entity_type: entityType,
        entity_id: entityId,
        rating_value: value,
        ...(slug ? { coffee_slug: slug } : {}),
      });
      setHasStarted(true);
    }
    setRating(value);
  };

  // Submit handler - saves rating and comment together
  const handleSubmit = () => {
    if (rating === 0) return; // Require rating
    if (checkLimitBeforeCreate()) return;
    submitSucceededRef.current = false;
    createReview(
      {
        entity_type: entityType,
        entity_id: entityId,
        rating: rating,
        works_with_milk: worksWithMilk,
        brew_method: brewMethod,
        comment: comment || null,
      },
      {
        onSuccess: (data) => {
          submitSucceededRef.current = true;
          capture("rating_form_submitted", {
            entity_type: entityType,
            entity_id: entityId,
            is_first_rating: data.is_first_rating,
            variant,
          });
        },
      }
    );
  };

  // Delete handler
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
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
          setWorksWithMilk(null);
          setBrewMethod(null);
          cleanup();
          setShowDeleteConfirm(false);
        },
      }
    );
  };

  // Determine if saved
  const isSaved = userReview !== null || (isSuccess && rating > 0);
  const isSaving = isLoading || isDebouncing;

  useEffect(() => {
    onSavedStateChange?.(isSaved);
  }, [isSaved, onSavedStateChange]);

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
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent
          className={cn(
            "surface-2 overflow-hidden rounded-[2.5rem] p-0 gap-0 sm:max-w-md"
          )}
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-destructive/60 via-destructive to-destructive/60 opacity-60 z-10" />
          <DialogHeader className="p-8 pb-6 border-b border-border/10 pt-10">
            <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-1 text-left">
              Confirm Action
            </p>
            <DialogTitle className="font-serif italic text-title text-primary leading-tight text-left">
              Remove your rating?
            </DialogTitle>
            <DialogDescription className="text-body text-muted-foreground mt-2 text-left">
              Your rating and review will be removed. You can always rate this{" "}
              {entityType} again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-8 pt-6 flex-row gap-3 justify-end sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              continue rating coffees, track your tasting journey, and share
              your reviews as well!
            </p>
          </div>
          <div
            className={cn(
              isInline ? "pt-6" : "p-8 md:p-10 pt-6",
              "flex flex-col gap-4"
            )}
          >
            <Button asChild className="w-full" size="lg">
              <Link
                href={`/auth?from=${encodeURIComponent(pathname)}`}
                onClick={() =>
                  capture("anon_review_limit_cta_clicked", {
                    entity_type: entityType,
                    entity_id: entityId,
                  })
                }
              >
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
                    {isSaved ? "Thank you" : `Rate this ${entityType}`}
                  </span>
                  <span className="h-px w-6 bg-accent/60" />
                </div>
                <h3 className="text-title text-balance leading-tight">
                  {isSaved ? (
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
                  {isSaved
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
            <Stack gap="2">
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
                      aria-label={`Rate ${star} out of 5`}
                      aria-pressed={rating === star}
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      disabled={isSaving || isDeleting}
                      className="transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Icon
                        name="Star"
                        size={36}
                        aria-hidden
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
              <p
                className={cn(
                  "text-micro",
                  isInline ? "text-left" : "text-center"
                )}
              >
                {entityType === "coffee"
                  ? "Ratings of 4+ will add it to Your Selections."
                  : "Ratings of 4+ count as recommending this roaster."}
              </p>
            </Stack>

            {/* Comment - always visible */}
            <Stack gap="3">
              <Textarea
                placeholder={`Any notes to share about this ${entityType}?`}
                value={comment}
                onChange={(e) => {
                  formTouchedRef.current = true;
                  setComment(e.target.value);
                }}
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

            {entityType === "coffee" && (
              <Stack gap="6" className="pt-6 border-t border-border/30">
                <p
                  className={cn(
                    "text-body italic text-muted-foreground/80",
                    isInline ? "text-left" : "text-center"
                  )}
                >
                  Help the community brew this better (optional)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Stack gap="3">
                    <label className="text-label uppercase tracking-widest">
                      Brew method
                    </label>
                    <Select
                      value={brewMethod ?? "none"}
                      onValueChange={(value) => {
                        formTouchedRef.current = true;
                        setBrewMethod(
                          value === "none" ? null : (value as GrindEnum)
                        );
                      }}
                      disabled={isSaving || isDeleting}
                    >
                      <SelectTrigger className="w-full h-9 border-border/60 focus:border-primary/50 bg-muted/5">
                        <SelectValue placeholder="How did you brew this coffee?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No brew method</SelectItem>
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
                  <Stack gap="3">
                    <label className="text-label uppercase tracking-widest">
                      Black / Milk
                    </label>
                    <Cluster gap="2" className="flex-wrap">
                      <Button
                        type="button"
                        variant={
                          worksWithMilk === false ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          formTouchedRef.current = true;
                          setWorksWithMilk(false);
                        }}
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
                        variant={worksWithMilk === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          formTouchedRef.current = true;
                          setWorksWithMilk(true);
                        }}
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
                          onClick={() => {
                            formTouchedRef.current = true;
                            setWorksWithMilk(null);
                          }}
                          disabled={isSaving || isDeleting}
                          className="h-9 px-3 text-muted-foreground hover:text-foreground"
                        >
                          Clear
                        </Button>
                      )}
                    </Cluster>
                  </Stack>
                </div>
              </Stack>
            )}

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

            {/* Post-save continuation — signed-in only (anon flow keeps limit / sign-up prompts) */}
            {isSaved && identityKey?.startsWith("user:") && !isSaving && (
              <Stack gap="4" className="pt-4 border-t border-border/20">
                <p
                  className={cn(
                    "text-caption text-muted-foreground",
                    isInline ? "text-left" : "text-center"
                  )}
                >
                  {entityType === "coffee"
                    ? "More ratings = better recommendations for you"
                    : "Help others discover great roasters"}
                </p>
                <Button
                  type="button"
                  onClick={() => openSearch(undefined, true)}
                  className={isInline ? "w-full sm:w-auto" : "w-full"}
                  size="lg"
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  {entityType === "coffee"
                    ? "Rate another coffee"
                    : "Rate another"}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className={isInline ? "w-full sm:w-auto" : "w-full"}
                  size="lg"
                >
                  <Link href="/profile">
                    <Icon name="User" size={16} className="mr-2" />
                    View my profile
                  </Link>
                </Button>
              </Stack>
            )}

            {/* Actions - show after save */}
            {isSaved && (
              <Cluster
                gap="2"
                className={cn(
                  identityKey?.startsWith("user:")
                    ? "pt-4"
                    : "pt-2 border-t border-border/20"
                )}
              >
                {entityType === "coffee" && rating > 0 && rating < 4 && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/tools/coffee-compass?coffeeId=${encodeURIComponent(entityId)}`}
                    >
                      <Icon name="Compass" size={14} className="mr-1.5" />
                      Fix Your Brew
                    </Link>
                  </Button>
                )}
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
