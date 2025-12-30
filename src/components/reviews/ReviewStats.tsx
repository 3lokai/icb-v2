"use client";

import { Icon } from "@/components/common/Icon";
import { Cluster } from "@/components/primitives/cluster";
import type { EntityReviewStats } from "@/types/review-types";
import { cn } from "@/lib/utils";

type ReviewStatsProps = {
  stats: EntityReviewStats | null;
  onReviewsClick?: () => void;
};

export function ReviewStats({ stats, onReviewsClick }: ReviewStatsProps) {
  const hasStats = stats && stats.review_count && stats.review_count > 0;
  const { review_count, avg_rating, recommend_pct } = stats || {};

  return (
    <div>
      <div className="mb-6">
        <div className="inline-flex items-center gap-4 mb-3">
          <span className="h-px w-8 md:w-12 bg-accent/60" />
          <span className="text-overline text-muted-foreground tracking-[0.15em]">
            Community Feedback
          </span>
        </div>
        <h2 className="text-title text-balance leading-[1.1] tracking-tight">
          Ratings & <span className="text-accent italic">Reviews.</span>
        </h2>
      </div>
      {hasStats ? (
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
      ) : (
        <p className="text-body text-muted-foreground">No Reviews yet</p>
      )}
    </div>
  );
}
