"use client";

import { Icon } from "@/components/common/Icon";
import { Cluster } from "@/components/primitives/cluster";
import type { EntityReviewStats } from "@/types/review-types";
import { cn } from "@/lib/utils";

type ReviewStatsProps = {
  stats: EntityReviewStats;
  onReviewsClick?: () => void;
};

export function ReviewStats({ stats, onReviewsClick }: ReviewStatsProps) {
  const { review_count, avg_rating, recommend_pct } = stats;

  return (
    <div>
      <h2 className="text-title mb-5">Ratings & Reviews</h2>
      <Cluster gap="4" align="center" className="flex-wrap">
        {/* Star Rating */}
        {avg_rating !== null && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 rounded-lg border border-border/40">
            <div className="flex items-center gap-1">
              <Icon
                name="Star"
                size={22}
                className="text-amber-500 fill-amber-500 drop-shadow-sm"
              />
              <span className="text-heading font-bold text-foreground">
                {avg_rating.toFixed(1)}
              </span>
            </div>
            <span className="text-caption text-muted-foreground/60">
              out of 5
            </span>
          </div>
        )}

        {/* Review Count */}
        <button
          onClick={onReviewsClick}
          className={cn(
            "text-body font-semibold transition-all px-4 py-2.5 rounded-lg border border-border/40",
            onReviewsClick
              ? "text-primary hover:text-primary/90 hover:bg-primary/5 hover:border-primary/30 active:scale-95"
              : "text-foreground bg-muted/30"
          )}
        >
          {review_count} {review_count === 1 ? "review" : "reviews"}
        </button>

        {/* Recommend % */}
        {recommend_pct !== null && recommend_pct > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/30 rounded-lg border border-border/40">
            <Icon name="ThumbsUp" size={16} className="text-primary" />
            <span className="text-body font-medium text-foreground">
              {Math.round(recommend_pct)}% recommend
            </span>
          </div>
        )}
      </Cluster>
    </div>
  );
}
