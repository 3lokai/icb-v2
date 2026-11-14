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
import {
  CheckIcon,
  CircleNotchIcon,
  CompassIcon,
  PlusIcon,
  StarIcon,
  TrashSimpleIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
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

  useEffect(() => {
    formTouchedRef.current = false;
    submitSucceededRef.current = false;
    startTransition(() => {
      setHasStarted(false);
    });
  }, [entityId, entityType]);

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
        <DialogContent className="gap-0 p-0 sm:max-w-md">
          <DialogHeader className="p-6">
            <DialogTitle className="text-left">Remove your rating?</DialogTitle>
            <DialogDescription className="mt-2 text-left">
              Your rating and review will be removed. You can always rate this{" "}
              {entityType} again later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row justify-end gap-3 p-6 pt-0 sm:justify-end">
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
              {isDeleting ? "Deleting..." : "Delete rating"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Limit Content - Show in parent modal when limit reached */}
      {isLimitReached ? (
        <div className={paddingClass}>
          <div>
            <h3 className="text-heading text-left">Sign in to keep rating</h3>
            <p className="mt-2 text-copy-compact text-left text-muted-foreground">
              You&apos;ve reached the limit for anonymous reviews. Sign in to
              continue rating coffees, track your tasting journey, and share
              your reviews as well!
            </p>
          </div>
          <div className="flex flex-col gap-4 pt-6">
            {/* 44px by composition: primary action on mobile. */}
            <Button asChild className="min-h-11 w-full" size="lg">
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
                <h3 className="text-heading text-balance">
                  {isSaved
                    ? "Rating submitted"
                    : entityType === "coffee"
                      ? "How was your brew?"
                      : "How was your experience?"}
                </h3>
                <p className="text-copy-compact text-muted-foreground">
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
                  "flex items-center gap-1",
                  isInline ? "-ml-1 justify-start" : "justify-center"
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
                      // 36px star + 4px padding each side: a 44px target.
                      className="rounded-md p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Icon
                        aria-hidden
                        // Fill weight marks the on state; outline stars are muted.
                        color={isFilled ? "rating" : "muted"}
                        icon={StarIcon}
                        size={36}
                        weight={isFilled ? "fill" : "regular"}
                      />
                    </button>
                  );
                })}
                {rating > 0 && (
                  <span className="ml-2 text-ui-meta">{rating}/5</span>
                )}
              </div>
              <p
                className={cn(
                  "text-ui-meta",
                  isInline ? "text-left" : "text-center"
                )}
              >
                {entityType === "coffee"
                  ? "Ratings of 4+ will add it to Your Selections."
                  : "Ratings of 4+ count as recommending this roaster."}
              </p>
            </Stack>

            {entityType === "coffee" && (
              <Stack gap="6" className="border-t border-border pt-6">
                <p
                  className={cn(
                    "text-ui-meta",
                    isInline ? "text-left" : "text-center"
                  )}
                >
                  Optional. Helps the next drinker.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Stack gap="3">
                    <label
                      className="text-ui-label"
                      htmlFor="quick-rating-brew-method"
                    >
                      How did you brew it?
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
                      <SelectTrigger
                        id="quick-rating-brew-method"
                        aria-label="Brew method"
                        className="w-full"
                      >
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
                    <p className="text-ui-label" id="quick-rating-milk">
                      With milk?
                    </p>
                    <div
                      aria-labelledby="quick-rating-milk"
                      className="flex flex-wrap gap-2"
                      role="group"
                    >
                      {/* Selected is ink fill; pressing the selected chip again clears it. */}
                      {(
                        [
                          ["Yes", true],
                          ["No", false],
                        ] as const
                      ).map(([label, value]) => (
                        <Button
                          aria-pressed={worksWithMilk === value}
                          disabled={isSaving || isDeleting}
                          key={label}
                          onClick={() => {
                            formTouchedRef.current = true;
                            setWorksWithMilk(
                              worksWithMilk === value ? null : value
                            );
                          }}
                          size="sm"
                          type="button"
                          variant={
                            worksWithMilk === value ? "default" : "outline"
                          }
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </Stack>
                </div>
              </Stack>
            )}

            {/* Notes: last of the optional fields, as in the design */}
            <Stack gap="3">
              <label className="text-ui-label" htmlFor="quick-rating-notes">
                Anything to add?
              </label>
              <Textarea
                id="quick-rating-notes"
                placeholder="What did it taste like to you?"
                value={comment}
                onChange={(e) => {
                  formTouchedRef.current = true;
                  setComment(e.target.value);
                }}
                disabled={isSaving || isDeleting}
                className="min-h-24 resize-none"
                maxLength={500}
              />
              {comment && comment.length > 0 && (
                <p className="text-right text-ui-meta">{comment.length}/500</p>
              )}
            </Stack>

            {/* Status indicator */}
            {isSaving && (
              <div className="flex items-center justify-center gap-2 text-ui-meta">
                <Icon
                  icon={CircleNotchIcon}
                  size={14}
                  className="animate-spin"
                />
                Saving...
              </div>
            )}

            {isSaved && !isSaving && (
              <div className="flex items-center justify-center">
                <Badge variant="outline">
                  <Icon icon={CheckIcon} size={12} className="mr-2" />
                  Saved
                </Badge>
              </div>
            )}

            {/* Submit button */}
            {!isSaved && (
              <Button
                onClick={handleSubmit}
                disabled={rating === 0 || isSaving}
                // 44px by composition: primary action on mobile.
                className={cn(
                  "min-h-11",
                  isInline ? "w-full sm:w-auto" : "w-full"
                )}
                size="lg"
              >
                {isSaving ? (
                  <>
                    <Icon
                      icon={CircleNotchIcon}
                      size={16}
                      className="mr-2 animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  "Submit rating"
                )}
              </Button>
            )}

            {identityKey?.startsWith("anon:") && (
              <p
                className={cn(
                  "text-ui-meta",
                  isInline ? "text-left" : "text-center"
                )}
              >
                {getReviewCount() ?? 0} of 3 ratings without an account ·{" "}
                <Link
                  className="underline underline-offset-4 hover:text-foreground"
                  href={`/auth?from=${encodeURIComponent(pathname)}`}
                >
                  sign in to keep them
                </Link>
              </p>
            )}

            {/* Post-save continuation — signed-in only (anon flow keeps limit / sign-up prompts) */}
            {isSaved && identityKey?.startsWith("user:") && !isSaving && (
              <Stack gap="4" className="border-t border-border pt-4">
                <p
                  className={cn(
                    "text-copy-compact text-muted-foreground",
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
                  <Icon icon={PlusIcon} size={16} className="mr-2" />
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
                    <Icon icon={UserIcon} size={16} className="mr-2" />
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
                    : "border-t border-border pt-2"
                )}
              >
                {entityType === "coffee" && rating > 0 && rating < 4 && (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={`/tools/coffee-compass?coffeeId=${encodeURIComponent(entityId)}`}
                    >
                      <Icon icon={CompassIcon} size={14} className="mr-2" />
                      Fix your brew
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
                  <Icon icon={TrashSimpleIcon} size={14} className="mr-2" />
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
