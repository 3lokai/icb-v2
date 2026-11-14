"use client";

import { useState } from "react";
import { CaretDownIcon } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { Icon } from "@/components/common/Icon";
import { StarRating } from "@/components/common/StarRating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GRIND_TYPES } from "@/lib/utils/coffee-constants";
import type { LatestReviewPerIdentity } from "@/types/review-types";

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

  return (
    <div>
      <ul aria-label="Ratings from drinkers" className="flex flex-col gap-6">
        {displayReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </ul>

      {reviews.length > INITIAL_DISPLAY_COUNT && !showAll && (
        <Button
          className="mt-6 w-full"
          onClick={() => setShowAll(true)}
          variant="outline"
        >
          Show all {reviews.length} ratings
          <Icon icon={CaretDownIcon} size={14} className="ml-2" />
        </Button>
      )}
    </div>
  );
}

/** "20 Sep", with the year once it is no longer this one. */
function formatReviewDate(iso: string): string {
  const date = new Date(iso);
  return format(
    date,
    date.getFullYear() === new Date().getFullYear() ? "d MMM" : "d MMM yyyy"
  );
}

/**
 * One rating: the reviewer's avatar, stars and a quiet "name · method · date" line,
 * then the note as a quote. Anonymous ratings show as "A drinker".
 */
function ReviewItem({ review }: { review: ReviewWithProfile }) {
  const profile = review.user_profiles;
  const name = profile ? profile.username || profile.full_name : "A drinker";
  const initials = profile
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const meta = [
    name,
    review.brew_method &&
      (GRIND_TYPES.find((g) => g.value === review.brew_method)?.label ??
        review.brew_method),
    review.works_with_milk === true && "With milk",
    review.works_with_milk === false && "Black",
    review.created_at && formatReviewDate(review.created_at),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <Avatar className="size-8">
          {/* Decorative: the name is in the line beside it. */}
          <AvatarImage alt="" src={profile?.avatar_url || undefined} />
          <AvatarFallback>
            <span className="text-ui-meta">{initials}</span>
          </AvatarFallback>
        </Avatar>
        {review.rating != null && (
          <>
            <span aria-hidden>
              <StarRating rating={review.rating} size="md" />
            </span>
            <span className="sr-only">Rated {review.rating} out of 5</span>
          </>
        )}
        <span className="text-ui-meta">{meta}</span>
      </div>
      {review.comment && (
        <p className="mt-2 max-w-prose font-serif text-body italic whitespace-pre-line">
          “{review.comment}”
        </p>
      )}
    </li>
  );
}
