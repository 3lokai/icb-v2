"use client";

import { StarRating } from "@/components/common/StarRating";
import type { EntityReviewStats } from "@/types/review-types";

type ReviewStatsProps = {
  stats: EntityReviewStats | null;
  onReviewsClick?: () => void;
};

/**
 * Rating summary: the average as a large numeral, stars, then the count. The stars
 * are decorative; the number and the count carry the evidence.
 * ponytail: no distribution bars, "with notes" or "brewed as" tally yet; those need
 * the reviews list, which this component is not given.
 */
export function ReviewStats({ stats, onReviewsClick }: ReviewStatsProps) {
  const { review_count, avg_rating } = stats || {};
  const hasStats = !!review_count && review_count > 0;
  const count = `${review_count} ${review_count === 1 ? "rating" : "ratings"}`;

  return (
    <div>
      <h3 className="text-heading text-balance">What drinkers say</h3>
      {hasStats ? (
        <>
          {avg_rating != null && (
            <>
              <p className="mt-4 text-hero tabular-nums">
                {avg_rating.toFixed(1)}
              </p>
              <div aria-hidden className="mt-2">
                <StarRating rating={avg_rating} size="lg" />
              </div>
            </>
          )}
          <p className="mt-2 text-ui-meta">
            {onReviewsClick ? (
              <button
                className="rounded-sm underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={onReviewsClick}
                type="button"
              >
                {count}
              </button>
            ) : (
              count
            )}
          </p>
        </>
      ) : (
        <p className="mt-2 text-ui-meta">No ratings yet · Tried it? Rate it</p>
      )}
    </div>
  );
}
