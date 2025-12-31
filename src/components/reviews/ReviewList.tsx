"use client";

import { useState } from "react";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { LatestReviewPerIdentity } from "@/types/review-types";
import { formatDistanceToNow } from "date-fns";

type ReviewWithProfile = LatestReviewPerIdentity & {
  user_profiles: {
    id: string;
    username: string | null;
    full_name: string;
    avatar_url: string | null;
  } | null;
};

type ReviewListProps = {
  entityType: "coffee" | "roaster";
  reviews: ReviewWithProfile[];
};

const INITIAL_DISPLAY_COUNT = 3;

export function ReviewList({
  entityType: _entityType,
  reviews,
}: ReviewListProps) {
  const [showAll, setShowAll] = useState(false);

  const displayReviews = showAll
    ? reviews
    : reviews.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMore = reviews.length > INITIAL_DISPLAY_COUNT;

  return (
    <Stack gap="6">
      <div className="flex items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-4 mb-3">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              Community Voices
            </span>
          </div>
          <h3 className="text-title text-balance leading-[1.1] tracking-tight">
            What Others Are <span className="text-accent italic">Saying.</span>
          </h3>
          <p className="text-caption text-muted-foreground mt-2">
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

function ReviewItem({ review }: { review: ReviewWithProfile }) {
  const isAnonymous = review.identity_key?.startsWith("anon:");
  const timeAgo = review.created_at
    ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true })
    : "";

  // Get user display info
  const userProfile = review.user_profiles;
  const displayName = userProfile
    ? userProfile.username || userProfile.full_name
    : null;
  const avatarUrl = userProfile?.avatar_url || null;
  const initials = userProfile
    ? userProfile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

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
          <Avatar className="size-6">
            <AvatarImage
              src={avatarUrl || undefined}
              alt={displayName || "Anonymous"}
            />
            <AvatarFallback className="text-caption font-medium">
              {isAnonymous ? "?" : initials}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {isAnonymous ? "Anonymous" : displayName || "Reviewer"}
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
