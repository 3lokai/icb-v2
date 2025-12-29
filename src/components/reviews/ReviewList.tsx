"use client";

import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LatestReviewPerIdentity } from "@/types/review-types";
import { formatDistanceToNow } from "date-fns";

type ReviewListProps = {
  entityType: "coffee" | "roaster";
  reviews: LatestReviewPerIdentity[];
};

const INITIAL_DISPLAY_COUNT = 3;

export function ReviewList({ entityType, reviews }: ReviewListProps) {
  const [showAll, setShowAll] = useState(false);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <Stack gap="4">
          <div className="w-20 h-20 rounded-full bg-muted/50 border border-border/40 flex items-center justify-center mx-auto">
            <Icon
              name="ChatText"
              size={32}
              className="text-muted-foreground/60"
            />
          </div>
          <Stack gap="2">
            <h3 className="text-heading font-semibold">No reviews yet</h3>
            <p className="text-body text-muted-foreground max-w-md mx-auto">
              Be the first to share your experience with this {entityType} and
              help others discover great coffee.
            </p>
          </Stack>
        </Stack>
      </div>
    );
  }

  const displayReviews = showAll
    ? reviews
    : reviews.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMore = reviews.length > INITIAL_DISPLAY_COUNT;

  return (
    <Stack gap="6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-title">What others are saying</h3>
          <p className="text-caption text-muted-foreground mt-1">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
        {reviews.length > 1 && (
          <select
            className="text-caption text-foreground bg-background border border-input/60 rounded-md px-3 py-1.5 hover:border-primary/50 focus:border-primary/50 transition-colors"
            defaultValue="latest"
          >
            <option value="latest">Latest first</option>
          </select>
        )}
      </div>

      <Stack gap="6">
        {displayReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </Stack>

      {hasMore && !showAll && (
        <Button
          variant="outline"
          onClick={() => setShowAll(true)}
          className="w-full border-border/60 hover:border-primary/50 hover:bg-accent/30 transition-all"
        >
          Show all {reviews.length} reviews
          <Icon name="CaretDown" size={14} className="ml-2" />
        </Button>
      )}
    </Stack>
  );
}

function ReviewItem({ review }: { review: LatestReviewPerIdentity }) {
  const isAnonymous = review.identity_key?.startsWith("anon:");
  const timeAgo = review.created_at
    ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true })
    : "";

  return (
    <div className="group relative py-5 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/20 rounded-lg px-3 -mx-3">
      <Stack gap="4">
        {/* Rating & Recommend Badge */}
        <Cluster gap="3" align="center" className="flex-wrap">
          {review.rating && (
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={16}
                  className={cn(
                    "transition-colors",
                    i < review.rating!
                      ? "text-amber-500 fill-amber-500"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
              <span className="text-body font-medium ml-1 text-muted-foreground">
                {review.rating.toFixed(1)}
              </span>
            </div>
          )}
          {review.recommend !== null && (
            <Badge
              variant={review.recommend ? "default" : "secondary"}
              className={cn(
                "text-label border",
                review.recommend
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-muted/50 border-border/40"
              )}
            >
              <Icon
                name={review.recommend ? "ThumbsUp" : "ThumbsDown"}
                size={12}
                className="mr-1.5"
              />
              {review.recommend ? "Recommends" : "Doesn't recommend"}
            </Badge>
          )}
        </Cluster>

        {/* Comment */}
        {review.comment && (
          <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
            <p className="text-body leading-relaxed whitespace-pre-line text-foreground">
              {review.comment}
            </p>
          </div>
        )}

        {/* Additional Details */}
        {(review.value_for_money !== null ||
          review.works_with_milk !== null ||
          review.brew_method) && (
          <Cluster gap="2" className="flex-wrap">
            {review.value_for_money !== null && (
              <Badge variant="outline" className="text-caption bg-muted/40">
                <Icon
                  name={review.value_for_money ? "ThumbsUp" : "ThumbsDown"}
                  size={11}
                  className="mr-1.5"
                />
                {review.value_for_money ? "Good value" : "Not great value"}
              </Badge>
            )}
            {review.works_with_milk !== null && (
              <Badge variant="outline" className="text-caption bg-muted/40">
                {review.works_with_milk ? "Works with milk" : "Better black"}
              </Badge>
            )}
            {review.brew_method && (
              <Badge variant="outline" className="text-caption bg-muted/40">
                {review.brew_method}
              </Badge>
            )}
          </Cluster>
        )}

        {/* Meta */}
        <Cluster
          gap="2"
          align="center"
          className="text-caption text-muted-foreground"
        >
          <span className="font-medium">
            {isAnonymous ? "Anonymous reviewer" : "Reviewer"}
          </span>
          {timeAgo && (
            <>
              <span className="opacity-40">·</span>
              <span>{timeAgo}</span>
            </>
          )}
        </Cluster>
      </Stack>
    </div>
  );
}
