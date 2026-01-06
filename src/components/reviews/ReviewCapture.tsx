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
};

// Session expires after 5 minutes of inactivity
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function ReviewCapture({ entityType, entityId }: ReviewCaptureProps) {
  // ========== SESSION STATE ==========
  const [isActiveSession, setIsActiveSession] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!isActiveSession || !sessionStartTime) return;

    const timer = setTimeout(() => {
      setIsActiveSession(false);
      setSessionStartTime(null);
    }, SESSION_TIMEOUT);

    return () => clearTimeout(timer);
  }, [isActiveSession, sessionStartTime]);
  // ====================================

  const [expanded, setExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const pathname = usePathname();

  const { data: reviews } = useReviews(entityType, entityId);
  const {
    createReview,
    isLoading,
    isDebouncing,
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
    rating: null,
    value_for_money: null,
    works_with_milk: null,
    brew_method: null,
    comment: null,
  };

  const [formData, setFormData] = useState<CreateReviewInput>(defaultFormData);

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
    if (
      userReview &&
      !isEditMode &&
      !isActiveSession &&
      !hasSyncedRef.current
    ) {
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
  }, [userReview, isEditMode, isActiveSession, entityType, entityId]);

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

  // ========== SESSION MANAGEMENT ==========
  const startActiveSession = useCallback(() => {
    setIsActiveSession(true);
    setSessionStartTime(Date.now());
  }, []);

  const endActiveSession = useCallback(() => {
    setIsActiveSession(false);
    setSessionStartTime(null);
    // Reset limit modal ref when session ends
    hasShownLimitModalRef.current = false;
  }, []);
  // ========================================

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

  const handleRecommendClick = (value: boolean) => {
    if (checkLimitBeforeCreate()) return;

    startTransition(() => {
      const newFormData = { ...formData, recommend: value };
      setFormData(newFormData);
      startActiveSession(); // Mark as active editing
      createReview(newFormData);
      // Auto-expand to rating after recommend click
      setExpanded(true);
      setIsEditMode(false);
    });
  };

  const handleRatingClick = (value: number) => {
    if (checkLimitBeforeCreate()) return;

    const newFormData = { ...formData, rating: value };
    setFormData(newFormData);

    // If not already in session, start it
    if (!isActiveSession) {
      startActiveSession();
    }

    createReview(newFormData);
    setIsEditMode(false);
  };

  const handleCommentChange = (value: string) => {
    setFormData({ ...formData, comment: value });

    if (!isActiveSession) {
      startActiveSession();
    }
  };

  const handleCommentBlur = () => {
    if (formData.comment && formData.comment.trim()) {
      if (checkLimitBeforeCreate()) return;

      if (!isActiveSession) {
        startActiveSession();
      }
      createReview(formData);
      setIsEditMode(false);
      // Auto-expand details section after comment is entered
      setShowDetails(true);
    }
  };

  const handleDetailChange = (field: keyof CreateReviewInput, value: any) => {
    if (checkLimitBeforeCreate()) return;

    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    if (!isActiveSession) {
      startActiveSession();
    }

    createReview(newFormData);
    setIsEditMode(false);
  };

  const handleEdit = () => {
    // Enter edit mode by starting a new session
    startActiveSession();
    setIsEditMode(true);
    setExpanded(true);
    setShowDetails(true);
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
          setExpanded(false);
          setShowDetails(false);
          setIsEditMode(false);
          endActiveSession();
          setShowWarningAlert(false); // Hide warning if shown
          setShowDeleteConfirm(false);
        },
      }
    );
  };

  // ========== DETERMINE UI MODE ==========
  // Show edit mode ONLY if:
  // 1. Has existing review
  // 2. NOT in active editing session
  // 3. NOT in manual edit mode
  const showEditMode = userReview && !isActiveSession && !isEditMode;

  // Show saving indicator during active session
  const showSavingIndicator = isActiveSession && (isDebouncing || isLoading);
  const showSavedIndicator =
    isActiveSession && isSuccess && !isDebouncing && !isLoading;
  // =======================================

  // Show saved state if user has review and not editing
  if (showEditMode) {
    return (
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
    );
  }

  // Capture UI
  return (
    <>
      {/* Warning Dialog after 2nd review */}
      <Dialog open={showWarningAlert} onOpenChange={setShowWarningAlert}>
        <DialogContent className="overflow-hidden rounded-[2.5rem] border-border/60 p-0 gap-0 sm:max-w-lg">
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
        <DialogContent className="overflow-hidden rounded-[2.5rem] border-border/60 p-0 gap-0 sm:max-w-lg">
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
        <DialogContent className="overflow-hidden rounded-[2.5rem] border-border/60 p-0 gap-0 sm:max-w-md">
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
            {/* Stage 1: Recommend */}
            <Stack gap="6">
              <Stack gap="2">
                <div className="inline-flex items-center gap-3">
                  <span className="h-px w-6 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.1em]">
                    Review this {entityType}
                  </span>
                </div>
                <h3 className="text-title text-balance leading-tight">
                  What did you{" "}
                  <span className="text-accent italic">Think?</span>
                </h3>
                <p className="text-body text-muted-foreground">
                  Share your experience to help others discover great coffee
                </p>
              </Stack>
              <Cluster gap="3">
                <Button
                  type="button"
                  variant={formData.recommend === true ? "default" : "outline"}
                  onClick={() => handleRecommendClick(true)}
                  disabled={isLoading || isDeleting}
                  className={cn(
                    "flex-1 sm:flex-none transition-all",
                    formData.recommend === true && "shadow-sm"
                  )}
                >
                  <Icon name="ThumbsUp" size={16} className="mr-2" />
                  Recommend
                </Button>
                <Button
                  type="button"
                  variant={formData.recommend === false ? "default" : "outline"}
                  onClick={() => handleRecommendClick(false)}
                  disabled={isLoading || isDeleting}
                  className={cn(
                    "flex-1 sm:flex-none transition-all",
                    formData.recommend === false && "shadow-sm"
                  )}
                >
                  <Icon name="ThumbsDown" size={16} className="mr-2" />
                  Not for me
                </Button>
              </Cluster>
            </Stack>

            {/* Stage 2: Rating & Comment (auto-expand after recommend) */}
            {/* Note: Rating input is identical for both coffee and roaster entity types */}
            {(expanded || formData.recommend !== null) && (
              <Stack gap="8" className="pt-8 border-t border-border/40">
                {/* Rating - Same for coffee and roaster */}
                <Stack gap="4">
                  <label className="text-label text-muted-foreground uppercase tracking-widest font-medium">
                    Overall rating (optional)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        disabled={isLoading || isDeleting}
                        className="transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Icon
                          name="Star"
                          size={28}
                          className={cn(
                            "transition-all duration-200",
                            formData.rating && star <= formData.rating
                              ? "text-amber-500 fill-amber-500 drop-shadow-sm"
                              : "text-muted-foreground/30 hover:text-amber-500/60 hover:fill-amber-500/20"
                          )}
                        />
                      </button>
                    ))}
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
                    Add a comment (optional)
                  </label>
                  <Textarea
                    placeholder={`Tell us what makes this ${entityType} special...`}
                    value={formData.comment ?? ""}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    onBlur={handleCommentBlur}
                    disabled={isLoading || isDeleting}
                    className="min-h-[100px] resize-none border-border/60 focus:border-primary/50 transition-colors"
                    maxLength={1000}
                  />
                  {formData.comment && formData.comment.length > 0 && (
                    <p className="text-caption text-muted-foreground text-right">
                      {formData.comment.length.toLocaleString()}/1,000
                    </p>
                  )}
                </Stack>

                {/* Stage 3: Additional Details */}
                {!showDetails && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(true)}
                    className="self-start text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  >
                    <Icon name="Plus" size={14} className="mr-2" />
                    Add more details (optional)
                  </Button>
                )}

                {showDetails && (
                  <div className="pt-8 border-t border-border/40">
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
                            <Icon
                              name="ThumbsUp"
                              size={14}
                              className="mr-1.5"
                            />
                            Good value
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
                            Not great value
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
                            Works better with
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
                                formData.works_with_milk === false &&
                                  "shadow-sm"
                              )}
                            >
                              Better black
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
                              Works with milk
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
                        <Stack gap="4">
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
                            <SelectTrigger className="w-full xl:w-[240px] h-9 border-border/60 focus:border-primary/50">
                              <SelectValue placeholder="Select method (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {GRIND_TYPES.map((grind) => (
                                <SelectItem
                                  key={grind.value}
                                  value={grind.value}
                                >
                                  {grind.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Stack>
                      )}
                    </div>
                  </div>
                )}
              </Stack>
            )}

            {/* Saving indicator (only during active session) */}
            {showSavingIndicator && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-2 text-caption text-muted-foreground">
                  <Icon
                    name="Circle"
                    size={12}
                    className="animate-pulse text-primary"
                  />
                  <span>Saving your review...</span>
                </div>
              </div>
            )}

            {showSavedIndicator && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <div className="flex items-center gap-2 text-caption text-emerald-600 dark:text-emerald-500">
                  <Icon
                    name="Check"
                    size={14}
                    className="fill-emerald-600 dark:fill-emerald-500"
                  />
                  <span className="font-medium">
                    Your review has been saved
                  </span>
                </div>
              </div>
            )}
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
