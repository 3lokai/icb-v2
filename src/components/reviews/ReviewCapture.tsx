"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  startTransition,
  useCallback,
} from "react";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
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
import type {
  CreateReviewInput,
  LatestReviewPerIdentity,
} from "@/types/review-types";

type ReviewCaptureProps = {
  entityType: "coffee" | "roaster";
  entityId: string;
  initialRating?: number;
};

export function ReviewCapture({
  entityType,
  entityId,
  initialRating,
}: ReviewCaptureProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const pathname = usePathname();

  const { data: reviews } = useReviews(entityType, entityId);
  const {
    createReview,
    isLoading,
    isSuccess,
    cleanup,
    isError,
    error,
    reviewCount,
  } = useCreateReview();
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteReview();

  // Initialize form data - will be synced from userReview if exists
  const defaultFormData: CreateReviewInput = {
    entity_type: entityType,
    entity_id: entityId,
    recommend: null,
    rating: initialRating ?? null,
    value_for_money: null,
    works_with_milk: null,
    brew_method: null,
    comment: null,
  };

  const [formData, setFormData] = useState<CreateReviewInput>(defaultFormData);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // Resolve identity (user or anon)
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
        } else {
          const anonId = ensureAnonId();
          if (anonId) {
            setIdentityKey(`anon:${anonId}`);
          }
        }
      } catch {
        const anonId = ensureAnonId();
        if (anonId) {
          setIdentityKey(`anon:${anonId}`);
        }
      }
    }
    resolveIdentity();
  }, []);

  // Find user's existing review (useMemo to avoid setState in effect)
  const userReview = useMemo<LatestReviewPerIdentity | null>(() => {
    if (!reviews || !identityKey) return null;
    return reviews.find((r) => r.identity_key === identityKey) || null;
  }, [reviews, identityKey]);

  // Sync form data from userReview when it changes (only when not editing and not in active session)
  // Using startTransition to defer state updates and avoid linter warnings
  const hasSyncedRef = useRef(false);
  const hasShownLimitModalRef = useRef(false);

  useEffect(() => {
    if (userReview && !isEditMode && !hasSyncedRef.current) {
      startTransition(() => {
        setFormData({
          entity_type: entityType,
          entity_id: entityId,
          recommend: userReview.recommend,
          rating: userReview.rating,
          value_for_money: userReview.value_for_money,
          works_with_milk: userReview.works_with_milk,
          brew_method: userReview.brew_method,
          comment: userReview.comment,
        });
        hasSyncedRef.current = true;
      });
    } else if (!userReview) {
      hasSyncedRef.current = false;
    }
  }, [userReview, isEditMode, entityType, entityId]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  // Handle review count and errors
  useEffect(() => {
    // Only apply limits to anonymous users
    if (!identityKey || !identityKey.startsWith("anon:")) {
      return;
    }

    // Check for limit reached error
    if (isError && error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage > "ANON_LIMIT_REACHED") {
        // Only show modal if it hasn't been shown yet in this session
        if (!hasShownLimitModalRef.current) {
          // Use setTimeout to avoid synchronous setState in effect
          setTimeout(() => {
            setShowLimitModal(true);
            hasShownLimitModalRef.current = true;
          }, 0);
        }
      }
    }

    // Show warning alert after 2nd review
    if (reviewCount === 2 && isSuccess) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setShowWarningAlert(true);
      }, 0);
    }
  }, [isError, error, reviewCount, isSuccess, identityKey]);

  // Check if limit is reached before creating review (only for anonymous users)
  const checkLimitBeforeCreate = useCallback(() => {
    // Only check limit for anonymous users (when identityKey starts with "anon:")
    if (identityKey && identityKey.startsWith("anon:")) {
      const currentCount = getReviewCount();
      if (currentCount !== null && currentCount >= 3) {
        // Only show modal if it hasn't been shown yet in this session
        if (!hasShownLimitModalRef.current) {
          setShowLimitModal(true);
          hasShownLimitModalRef.current = true;
        }
        return true; // Limit reached
      }
    }
    return false; // Can proceed
  }, [identityKey]);

  const handleRatingClick = (value: number) => {
    const newFormData = { ...formData, rating: value };
    setFormData(newFormData);
  };

  const handleCommentChange = (value: string) => {
    setFormData({ ...formData, comment: value });
  };

  const handleDetailChange = (field: keyof CreateReviewInput, value: any) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

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
          // Decrement review count for anonymous users
          if (identityKey && identityKey.startsWith("anon:")) {
            const currentCount = getReviewCount();
            if (currentCount !== null && currentCount > 0) {
              setReviewCount(currentCount - 1);
            }
          }

          // Reset all state
          setFormData({
            entity_type: entityType,
            entity_id: entityId,
            recommend: null,
            rating: null,
            value_for_money: null,
            works_with_milk: null,
            brew_method: null,
            comment: null,
          });
          setIsEditMode(false);
          setShowWarningAlert(false); // Hide warning if shown
          setShowDeleteConfirm(false);
        },
      }
    );
  };

  // ========== DETERMINE UI MODE ==========
  // Show saved review view if user has a review and is not editing
  const showEditMode = userReview && !isEditMode;
  // =======================================

  // Show saved state if user has review and not editing
  if (showEditMode) {
    return (
      <>
        {/* Delete Confirmation Modal */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent
            className={cn(
              "surface-2 overflow-hidden rounded-[2.5rem] p-0 gap-0 sm:max-w-md"
            )}
          >
            {/* Decorative stripe */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-destructive/60 via-destructive to-destructive/60 opacity-60 z-10" />

            <DialogHeader className="p-8 pb-6 border-b border-border/10 pt-10">
              <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-1 text-left">
                Confirm Action
              </p>
              <DialogTitle className="font-serif italic text-title text-primary leading-tight text-left">
                Delete this review?
              </DialogTitle>
              <DialogDescription className="text-body text-muted-foreground mt-2 text-left">
                This will permanently remove your review from the community.
                This action cannot be undone.
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
                {isDeleting ? "Deleting..." : "Delete Review"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="group relative overflow-hidden bg-card border border-border/60 rounded-2xl shadow-sm transition-all duration-500">
          {/* Subtle accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/60 via-accent/40 to-primary/40 opacity-50" />

          <CardContent className="p-8">
            <Stack gap="6">
              <Cluster gap="4" align="center">
                <Stack gap="2">
                  <div className="inline-flex items-center gap-3">
                    <span className="h-px w-6 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.1em]">
                      Your Experience
                    </span>
                  </div>
                  <h3 className="text-title text-balance leading-tight">
                    Your <span className="text-accent italic">Review.</span>
                  </h3>
                  {userReview.recommend !== null && (
                    <p className="text-body text-muted-foreground">
                      {userReview.recommend
                        ? "You recommend this choice"
                        : "Not quite for your palate"}
                    </p>
                  )}
                </Stack>
                <Cluster gap="2">
                  <Badge
                    variant="secondary"
                    className="text-label bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1"
                  >
                    <Icon name="Check" size={12} className="mr-1.5" />
                    Saved
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 px-3 hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="PencilSimple" size={14} className="mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Icon name="TrashSimple" size={14} className="mr-1.5" />
                    Delete
                  </Button>
                </Cluster>
              </Cluster>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Stack gap="4">
                  {userReview.rating && (
                    <Stack gap="2">
                      <span className="text-label text-muted-foreground uppercase tracking-wider font-medium">
                        Rating
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={20}
                            className={cn(
                              "transition-colors",
                              i < userReview.rating!
                                ? "text-amber-500 fill-amber-500"
                                : "text-muted-foreground/20"
                            )}
                          />
                        ))}
                        <span className="text-body font-semibold ml-1.5 pt-0.5">
                          {userReview.rating.toFixed(1)}
                        </span>
                      </div>
                    </Stack>
                  )}

                  {(userReview.value_for_money !== null ||
                    userReview.works_with_milk !== null ||
                    userReview.brew_method) && (
                    <Stack gap="3">
                      <span className="text-label text-muted-foreground uppercase tracking-wider font-medium">
                        Details
                      </span>
                      <Cluster gap="2" className="flex-wrap">
                        {userReview.value_for_money !== null && (
                          <Badge
                            variant="outline"
                            className="text-caption py-1.5 px-3 border-border/40"
                          >
                            <Icon
                              name={
                                userReview.value_for_money
                                  ? "ThumbsUp"
                                  : "ThumbsDown"
                              }
                              size={12}
                              className="mr-2 opacity-70"
                            />
                            {userReview.value_for_money
                              ? "Good value"
                              : "Pricey for the quality"}
                          </Badge>
                        )}
                        {userReview.works_with_milk !== null && (
                          <Badge
                            variant="outline"
                            className="text-caption py-1.5 px-3 border-border/40"
                          >
                            {userReview.works_with_milk
                              ? "Splendid with milk"
                              : "Best enjoyed black"}
                          </Badge>
                        )}
                        {userReview.brew_method && (
                          <Badge
                            variant="outline"
                            className="text-caption py-1.5 px-3 border-border/40"
                          >
                            {GRIND_TYPES.find(
                              (g) => g.value === userReview.brew_method
                            )?.label || userReview.brew_method}
                          </Badge>
                        )}
                      </Cluster>
                    </Stack>
                  )}
                </Stack>

                {userReview.comment && (
                  <Stack gap="2">
                    <span className="text-label text-muted-foreground uppercase tracking-wider font-medium">
                      Comments
                    </span>
                    <div className="bg-muted/30 rounded-xl p-5 border border-border/40 relative">
                      <Icon
                        name="Quotes"
                        size={24}
                        className="absolute -top-3 -left-2 text-primary/10 rotate-180"
                      />
                      <p className="text-body italic leading-relaxed whitespace-pre-line text-foreground/90">
                        {userReview.comment}
                      </p>
                    </div>
                  </Stack>
                )}
              </div>
            </Stack>
          </CardContent>
        </Card>
      </>
    );
  }

  // Capture UI
  return (
    <>
      {/* Warning Dialog after 2nd review */}
      <Dialog open={showWarningAlert} onOpenChange={setShowWarningAlert}>
        <DialogContent
          className={cn(
            "surface-2 overflow-hidden rounded-[2.5rem] p-0 gap-0 sm:max-w-lg"
          )}
        >
          {/* Decorative stripe */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary via-accent to-primary/60 opacity-60 z-10" />

          <DialogHeader className="p-8 md:p-10 pb-6 border-b border-border/10 pt-10">
            <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-1 text-left">
              Guest Access
            </p>
            <DialogTitle className="font-serif italic text-title text-primary leading-tight text-left">
              Almost at the limit
            </DialogTitle>
            <DialogDescription className="text-body text-muted-foreground mt-2 text-left">
              You can submit one more review as a guest. Sign in to unlock
              unlimited ratings and save your progress.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 md:p-10 pt-6 flex flex-col gap-4">
            <Button asChild className="w-full" size="lg">
              <Link href={`/auth?from=${encodeURIComponent(pathname)}`}>
                Sign in / Sign up
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showLimitModal}
        onOpenChange={(open) => {
          setShowLimitModal(open);
          if (!open) {
            // Reset ref when modal is dismissed
            hasShownLimitModalRef.current = false;
          }
        }}
      >
        <DialogContent
          className={cn(
            "surface-2 overflow-hidden rounded-[2.5rem] p-0 gap-0 sm:max-w-lg"
          )}
        >
          {/* Decorative stripe */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary via-accent to-primary/60 opacity-60 z-10" />

          <DialogHeader className="p-8 md:p-10 pb-6 border-b border-border/10 pt-10">
            <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-1 text-left">
              Limit Reached
            </p>
            <DialogTitle className="font-serif italic text-title text-primary leading-tight text-left">
              Unlock Unlimited Reviews
            </DialogTitle>
            <DialogDescription className="text-body text-muted-foreground mt-2 text-left">
              You&apos;ve reached the limit for anonymous reviews. Sign in to
              continue rating coffees and track your tasting journey.
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 md:p-10 pt-6 flex flex-col gap-4">
            <Button asChild className="w-full" size="lg">
              <Link href={`/auth?from=${encodeURIComponent(pathname)}`}>
                Sign in / Sign up
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent
          className={cn(
            "surface-2 overflow-hidden rounded-[2.5rem] p-0 gap-0 sm:max-w-md"
          )}
        >
          {/* Decorative stripe */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-destructive/60 via-destructive to-destructive/60 opacity-60 z-10" />

          <DialogHeader className="p-8 pb-6 border-b border-border/10 pt-10">
            <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-1 text-left">
              Confirm Action
            </p>
            <DialogTitle className="font-serif italic text-title text-primary leading-tight text-left">
              Delete this review?
            </DialogTitle>
            <DialogDescription className="text-body text-muted-foreground mt-2 text-left">
              This will permanently remove your review from the community. This
              action cannot be undone.
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
              {isDeleting ? "Deleting..." : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="group relative overflow-hidden bg-card border border-border/60 rounded-xl shadow-sm transition-all duration-500">
        {/* Subtle accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/60 via-accent/40 to-primary/40 opacity-50" />

        <CardContent className="p-8">
          <Stack gap="6">
            {/* Header */}
            <Stack gap="2">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-6 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.1em]">
                  Review this {entityType}
                </span>
              </div>
              <h3 className="text-title text-balance leading-tight">
                {entityType === "coffee" ? (
                  <>
                    How was your{" "}
                    <span className="text-accent italic">Brew?</span>
                  </>
                ) : (
                  <>
                    How was your{" "}
                    <span className="text-accent italic">Experience?</span>
                  </>
                )}
              </h3>
              <p className="text-body text-muted-foreground">
                {entityType === "coffee"
                  ? "Share your experience to help others discover great coffee"
                  : "Share your experience to help others discover great roasters"}
              </p>
            </Stack>

            {/* Rating, Comment & Additional Details */}
            <Stack gap="8" className="pt-8 border-t border-border/40">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Rating and Comment */}
                <Stack gap="8">
                  {/* Rating */}
                  <Stack gap="4">
                    <label className="text-label text-muted-foreground uppercase tracking-widest font-medium">
                      Overall rating*
                    </label>
                    <div
                      className="flex items-center gap-2"
                      onMouseLeave={() => setHoveredStar(null)}
                    >
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = hoveredStar
                          ? star <= hoveredStar
                          : formData.rating && star <= formData.rating;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            disabled={isLoading || isDeleting}
                            className="transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Icon
                              name="Star"
                              size={28}
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
                      {formData.rating && (
                        <span className="text-body font-medium text-muted-foreground ml-1">
                          {formData.rating}/5
                        </span>
                      )}
                    </div>
                  </Stack>

                  {/* Comment */}
                  <Stack gap="4">
                    <label className="text-label text-muted-foreground uppercase tracking-widest font-medium">
                      Your review
                    </label>
                    <Textarea
                      placeholder={`Tell us what makes this ${entityType} special...`}
                      value={formData.comment ?? ""}
                      onChange={(e) => handleCommentChange(e.target.value)}
                      disabled={isLoading || isDeleting}
                      className="min-h-[120px] resize-none border-border/60 focus:border-primary/50 transition-colors bg-muted/5"
                      maxLength={1000}
                    />
                    {formData.comment && formData.comment.length > 0 && (
                      <p className="text-caption text-muted-foreground text-right">
                        {formData.comment.length.toLocaleString()}/1,000
                      </p>
                    )}
                  </Stack>
                </Stack>

                {/* Right Column: Additional Details */}
                <Stack gap="8">
                  {/* Add to My Recommendations Checkbox */}
                  <Stack gap="4">
                    <label className="text-label text-muted-foreground uppercase tracking-widest font-medium">
                      Selections
                    </label>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="recommend"
                        checked={formData.recommend === true}
                        onCheckedChange={(checked) => {
                          const newFormData = {
                            ...formData,
                            recommend: checked === true ? true : null,
                          };
                          setFormData(newFormData);
                        }}
                        disabled={isLoading || isDeleting}
                      />
                      <label
                        htmlFor="recommend"
                        className="text-body text-foreground cursor-pointer select-none"
                      >
                        Add to &quot;My Recommendations&quot;
                      </label>
                    </div>
                  </Stack>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Value for Money */}
                    <Stack gap="4">
                      <label className="text-label text-muted-foreground uppercase tracking-widest font-medium">
                        Value for money
                      </label>
                      <Cluster gap="2" className="flex-wrap">
                        <Button
                          type="button"
                          variant={
                            formData.value_for_money === true
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleDetailChange("value_for_money", true)
                          }
                          disabled={isLoading || isDeleting}
                          className={cn(
                            "h-9 px-4",
                            formData.value_for_money === true && "shadow-sm"
                          )}
                        >
                          <Icon name="ThumbsUp" size={14} className="mr-1.5" />
                          Good
                        </Button>
                        <Button
                          type="button"
                          variant={
                            formData.value_for_money === false
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            handleDetailChange("value_for_money", false)
                          }
                          disabled={isLoading || isDeleting}
                          className={cn(
                            "h-9 px-4",
                            formData.value_for_money === false && "shadow-sm"
                          )}
                        >
                          <Icon
                            name="ThumbsDown"
                            size={14}
                            className="mr-1.5"
                          />
                          Poor
                        </Button>
                        {formData.value_for_money !== null && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDetailChange("value_for_money", null)
                            }
                            disabled={isLoading || isDeleting}
                            className="h-9 px-3 text-muted-foreground hover:text-foreground"
                          >
                            Clear
                          </Button>
                        )}
                      </Cluster>
                    </Stack>

                    {/* Coffee-specific: Works with milk */}
                    {entityType === "coffee" && (
                      <Stack gap="4">
                        <label className="text-label text-muted-foreground uppercase tracking-widest font-medium">
                          Profile suitability
                        </label>
                        <Cluster gap="2" className="flex-wrap">
                          <Button
                            type="button"
                            variant={
                              formData.works_with_milk === false
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleDetailChange("works_with_milk", false)
                            }
                            disabled={isLoading || isDeleting}
                            className={cn(
                              "h-9 px-4",
                              formData.works_with_milk === false && "shadow-sm"
                            )}
                          >
                            Black
                          </Button>
                          <Button
                            type="button"
                            variant={
                              formData.works_with_milk === true
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleDetailChange("works_with_milk", true)
                            }
                            disabled={isLoading || isDeleting}
                            className={cn(
                              "h-9 px-4",
                              formData.works_with_milk === true && "shadow-sm"
                            )}
                          >
                            Milk
                          </Button>
                          {formData.works_with_milk !== null && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDetailChange("works_with_milk", null)
                              }
                              disabled={isLoading || isDeleting}
                              className="h-9 px-3 text-muted-foreground hover:text-foreground"
                            >
                              Clear
                            </Button>
                          )}
                        </Cluster>
                      </Stack>
                    )}

                    {/* Coffee-specific: Brew method */}
                    {entityType === "coffee" && (
                      <Stack
                        gap="4"
                        className="sm:col-span-2 lg:col-span-1 xl:col-span-2"
                      >
                        <label className="text-label text-muted-foreground uppercase tracking-widest font-medium">
                          Brew method used
                        </label>
                        <Select
                          value={formData.brew_method ?? "none"}
                          onValueChange={(value) =>
                            handleDetailChange(
                              "brew_method",
                              value === "none" ? null : (value as any)
                            )
                          }
                          disabled={isLoading || isDeleting}
                        >
                          <SelectTrigger className="w-full h-9 border-border/60 focus:border-primary/50 bg-muted/5">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {GRIND_TYPES.map((grind) => (
                              <SelectItem key={grind.value} value={grind.value}>
                                {grind.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Stack>
                    )}
                  </div>
                </Stack>
              </div>
            </Stack>

            {/* Submit Button */}
            <div className="pt-4 border-t border-border/40">
              <Button
                type="button"
                onClick={() => {
                  if (checkLimitBeforeCreate()) return;
                  createReview(formData);
                  setIsEditMode(false);
                }}
                disabled={isLoading || isDeleting}
                className="w-full sm:w-auto"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Icon
                      name="Circle"
                      size={16}
                      className="mr-2 animate-spin"
                    />
                    Submitting...
                  </>
                ) : (
                  <>Submit Review</>
                )}
              </Button>
            </div>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
