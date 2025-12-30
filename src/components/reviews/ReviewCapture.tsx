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
import { ensureAnonId } from "@/lib/reviews/anon-id";
import { createClient } from "@/lib/supabase/client";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const { data: reviews } = useReviews(entityType, entityId);
  const { createReview, isLoading, isDebouncing, isSuccess, cleanup } =
    useCreateReview();
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

  // ========== SESSION MANAGEMENT ==========
  const startActiveSession = useCallback(() => {
    setIsActiveSession(true);
    setSessionStartTime(Date.now());
  }, []);

  const endActiveSession = useCallback(() => {
    setIsActiveSession(false);
    setSessionStartTime(null);
  }, []);
  // ========================================

  const handleRecommendClick = (value: boolean) => {
    const newFormData = { ...formData, recommend: value };
    setFormData(newFormData);
    startActiveSession(); // Mark as active editing
    createReview(newFormData);
    // Auto-expand to rating after recommend click
    setExpanded(true);
    setIsEditMode(false);
  };

  const handleRatingClick = (value: number) => {
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
    if (!confirm("Delete your review? This cannot be undone.")) return;

    const anonId = ensureAnonId();
    deleteReview(
      {
        input: { entity_type: entityType, entity_id: entityId },
        anonId,
      },
      {
        onSuccess: () => {
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
      <Card className="group relative overflow-hidden bg-card border border-border/60 rounded-xl shadow-sm transition-all duration-500">
        {/* Subtle accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-accent/40 to-primary/40 opacity-50" />

        <CardContent className="p-6">
          <Stack gap="4">
            <Cluster gap="3" align="center">
              <Cluster gap="3" align="center">
                <div>
                  <h3 className="text-heading font-semibold">Your review</h3>
                  {userReview.recommend !== null && (
                    <p className="text-caption text-muted-foreground mt-0.5">
                      {userReview.recommend
                        ? "You recommend this"
                        : "You don't recommend this"}
                      {userReview.rating && ` • ${userReview.rating} stars`}
                    </p>
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className="text-label bg-primary/10 text-primary border-primary/20"
                >
                  <Icon name="Check" size={12} className="mr-1" />
                  Saved
                </Badge>
              </Cluster>
              <Cluster gap="2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="hover:bg-accent/50"
                >
                  <Icon name="PencilSimple" size={14} className="mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Icon name="TrashSimple" size={14} className="mr-1.5" />
                  Delete
                </Button>
              </Cluster>
            </Cluster>

            {userReview.rating && (
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
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
                <span className="text-body font-medium ml-1">
                  {userReview.rating.toFixed(1)}
                </span>
              </div>
            )}

            {userReview.comment && (
              <div className="bg-muted/30 rounded-lg p-4 border border-border/40">
                <p className="text-body leading-relaxed whitespace-pre-line text-foreground">
                  {userReview.comment}
                </p>
              </div>
            )}

            {(userReview.value_for_money !== null ||
              userReview.works_with_milk !== null ||
              userReview.brew_method) && (
              <Cluster gap="2" className="flex-wrap">
                {userReview.value_for_money !== null && (
                  <Badge variant="outline" className="text-caption bg-muted/50">
                    <Icon
                      name={
                        userReview.value_for_money ? "ThumbsUp" : "ThumbsDown"
                      }
                      size={12}
                      className="mr-1.5"
                    />
                    {userReview.value_for_money
                      ? "Good value"
                      : "Not great value"}
                  </Badge>
                )}
                {userReview.works_with_milk !== null && (
                  <Badge variant="outline" className="text-caption bg-muted/50">
                    {userReview.works_with_milk
                      ? "Works with milk"
                      : "Better black"}
                  </Badge>
                )}
                {userReview.brew_method && (
                  <Badge variant="outline" className="text-caption bg-muted/50">
                    {GRIND_TYPES.find((g) => g.value === userReview.brew_method)
                      ?.label || userReview.brew_method}
                  </Badge>
                )}
              </Cluster>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Capture UI
  return (
    <Card className="group relative overflow-hidden bg-card border border-border/60 rounded-xl shadow-sm transition-all duration-500">
      {/* Subtle accent stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-accent/40 to-primary/40 opacity-50" />

      <CardContent className="p-6">
        <Stack gap="6">
          {/* Stage 1: Recommend */}
          <Stack gap="4">
            <div>
              <h3 className="text-heading font-semibold">
                What did you think of this {entityType}?
              </h3>
              <p className="text-caption text-muted-foreground mt-1">
                Share your experience to help others discover great coffee
              </p>
            </div>
            <Cluster gap="3">
              <Button
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
            <Stack gap="4">
              {/* Rating - Same for coffee and roaster */}
              <Stack gap="3">
                <label className="text-caption font-medium text-foreground">
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
              <Stack gap="3">
                <label className="text-caption font-medium text-foreground">
                  Add a comment (optional)
                </label>
                <Textarea
                  placeholder={`Share your experience with this ${entityType}...`}
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
                <Stack gap="4" className="pt-4 border-t border-border/40">
                  {/* Value for Money */}
                  <Stack gap="3">
                    <label className="text-caption font-medium text-foreground">
                      Value for money
                    </label>
                    <Cluster gap="2" className="flex-wrap">
                      <Button
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
                          formData.value_for_money === true && "shadow-sm"
                        )}
                      >
                        <Icon name="ThumbsUp" size={14} className="mr-1.5" />
                        Good value
                      </Button>
                      <Button
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
                          formData.value_for_money === false && "shadow-sm"
                        )}
                      >
                        <Icon name="ThumbsDown" size={14} className="mr-1.5" />
                        Not great value
                      </Button>
                      {formData.value_for_money !== null && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDetailChange("value_for_money", null)
                          }
                          disabled={isLoading || isDeleting}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          Clear
                        </Button>
                      )}
                    </Cluster>
                  </Stack>

                  {/* Coffee-specific: Works with milk */}
                  {entityType === "coffee" && (
                    <Stack gap="3">
                      <label className="text-caption font-medium text-foreground">
                        Works better with
                      </label>
                      <Cluster gap="2" className="flex-wrap">
                        <Button
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
                            formData.works_with_milk === false && "shadow-sm"
                          )}
                        >
                          Better black
                        </Button>
                        <Button
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
                            formData.works_with_milk === true && "shadow-sm"
                          )}
                        >
                          Works with milk
                        </Button>
                        {formData.works_with_milk !== null && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDetailChange("works_with_milk", null)
                            }
                            disabled={isLoading || isDeleting}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Clear
                          </Button>
                        )}
                      </Cluster>
                    </Stack>
                  )}

                  {/* Coffee-specific: Brew method */}
                  {entityType === "coffee" && (
                    <Stack gap="3">
                      <label className="text-caption font-medium text-foreground">
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
                        <SelectTrigger className="w-full sm:w-[240px] border-border/60 focus:border-primary/50">
                          <SelectValue placeholder="Select method (optional)" />
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
                </Stack>
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
                <span className="font-medium">Your review has been saved</span>
              </div>
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
