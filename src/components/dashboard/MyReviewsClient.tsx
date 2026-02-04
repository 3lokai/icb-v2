"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MyReview } from "@/data/user-dto";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";
import { formatDistanceToNow } from "date-fns";
import { queryKeys } from "@/lib/query-keys";

type MyReviewsClientProps = {
  initialReviews: MyReview[];
};

const INITIAL_DISPLAY_COUNT = 3;

export function MyReviewsClient({ initialReviews }: MyReviewsClientProps) {
  // Use TanStack Query with initialData to avoid refetching
  const { data: reviews = [] } = useQuery({
    queryKey: queryKeys.reviews.myReviews,
    initialData: initialReviews,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      // This won't be called since we have initialData and staleTime
      // But required by TanStack Query v5
      return initialReviews;
    },
  });

  // Separate reviews by type
  const coffeeReviews = reviews.filter((r) => r.entity_type === "coffee");
  const roasterReviews = reviews.filter((r) => r.entity_type === "roaster");

  // Pagination state
  const [showAllCoffee, setShowAllCoffee] = useState(false);
  const [showAllRoaster, setShowAllRoaster] = useState(false);

  // Determine which reviews to display
  const displayedCoffeeReviews = showAllCoffee
    ? coffeeReviews
    : coffeeReviews.slice(0, INITIAL_DISPLAY_COUNT);
  const displayedRoasterReviews = showAllRoaster
    ? roasterReviews
    : roasterReviews.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreCoffee = coffeeReviews.length > INITIAL_DISPLAY_COUNT;
  const hasMoreRoaster = roasterReviews.length > INITIAL_DISPLAY_COUNT;

  return (
    <Stack gap="8">
      {/* Main header */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  Your Contributions
                </span>
              </div>
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                My <span className="text-accent italic">Reviews.</span>
              </h2>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                View and manage all the reviews you've shared with the
                community.
              </p>
            </Stack>
          </div>
        </div>
      </div>

      {/* Coffee Reviews Section */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-8">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  Coffee Reviews
                </span>
              </div>
              <h3 className="text-subheading text-balance leading-[1.1] tracking-tight">
                Coffee <span className="text-accent italic">Reviews.</span>
              </h3>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                {coffeeReviews.length === 0
                  ? "Reviews you've shared for coffees in our directory."
                  : `${coffeeReviews.length} ${coffeeReviews.length === 1 ? "review" : "reviews"} you've shared for coffees in our directory.`}
              </p>
            </Stack>
          </div>
        </div>

        {coffeeReviews.length > 0 ? (
          <Stack gap="6">
            {displayedCoffeeReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
            {hasMoreCoffee && !showAllCoffee && (
              <Button
                variant="outline"
                onClick={() => setShowAllCoffee(true)}
                className="w-full border-border/60 hover:border-primary/50 hover:bg-accent/30 transition-all"
              >
                Show all {coffeeReviews.length} coffee reviews
                <Icon name="CaretDown" size={14} className="ml-2" />
              </Button>
            )}
          </Stack>
        ) : (
          <EmptyState
            message="Share your reviews with others"
            buttonText="Browse Coffees"
            buttonHref="/coffees"
          />
        )}
      </div>

      {/* Roaster Reviews Section */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end mb-8">
          <div className="md:col-span-8">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em]">
                  Roaster Reviews
                </span>
              </div>
              <h3 className="text-subheading text-balance leading-[1.1] tracking-tight">
                Roaster <span className="text-accent italic">Reviews.</span>
              </h3>
              <p className="max-w-2xl text-pretty text-body text-muted-foreground leading-relaxed">
                {roasterReviews.length === 0
                  ? "Reviews you've shared for roasters in our directory."
                  : `${roasterReviews.length} ${roasterReviews.length === 1 ? "review" : "reviews"} you've shared for roasters in our directory.`}
              </p>
            </Stack>
          </div>
        </div>

        {roasterReviews.length > 0 ? (
          <Stack gap="6">
            {displayedRoasterReviews.map((review) => (
              <ReviewItem key={review.id} review={review} />
            ))}
            {hasMoreRoaster && !showAllRoaster && (
              <Button
                variant="outline"
                onClick={() => setShowAllRoaster(true)}
                className="w-full border-border/60 hover:border-primary/50 hover:bg-accent/30 transition-all"
              >
                Show all {roasterReviews.length} roaster reviews
                <Icon name="CaretDown" size={14} className="ml-2" />
              </Button>
            )}
          </Stack>
        ) : (
          <EmptyState
            message="Share your reviews with others"
            buttonText="Browse Roasters"
            buttonHref="/roasters"
          />
        )}
      </div>
    </Stack>
  );
}

function ReviewItem({ review }: { review: MyReview }) {
  const timeAgo = review.created_at
    ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true })
    : "";

  const entityUrl =
    review.entity_type === "coffee"
      ? review.entity.roaster_slug
        ? coffeeDetailHref(review.entity.roaster_slug, review.entity.slug)
        : `/coffees/${review.entity.slug}`
      : `/roasters/${review.entity.slug}`;

  return (
    <div className="group relative py-5 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/20 rounded-lg px-3 -mx-3">
      <Stack gap="4">
        {/* Entity Name */}
        <div>
          <Link
            href={entityUrl}
            className="text-heading font-bold hover:text-accent transition-colors"
          >
            {review.entity.name}
          </Link>
        </div>

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
          {timeAgo && <span>{timeAgo}</span>}
        </Cluster>
      </Stack>
    </div>
  );
}

function EmptyState({
  message,
  buttonText,
  buttonHref,
}: {
  message: string;
  buttonText: string;
  buttonHref: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border border-border/40 rounded-lg bg-muted/20">
      <Stack gap="4" className="items-center text-center">
        <p className="text-body text-muted-foreground">{message}</p>
        <Button asChild variant="default">
          <Link href={buttonHref}>
            {buttonText}
            <Icon name="ArrowRight" size={14} className="ml-2" />
          </Link>
        </Button>
      </Stack>
    </div>
  );
}
