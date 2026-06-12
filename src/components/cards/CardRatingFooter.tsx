"use client";

import { cn } from "@/lib/utils";
import { StarRating } from "../common/StarRating";
import { useModal } from "@/components/providers/modal-provider";
import { QuickRating } from "@/components/reviews";

type CardRatingFooterProps = {
  entityType: "coffee" | "roaster";
  entityId: string | null | undefined;
  /** Used only for the accessible label, e.g. "Rate Monsoon Malabar". */
  entityName: string;
  /** Community average (0 / null when not yet rated). */
  ratingAvg: number | null | undefined;
  /** Community rating count. */
  ratingCount: number | null | undefined;
  /** This viewer's existing rating, if any. */
  userRating?: number | null;
  size?: "sm" | "md" | "lg";
  /**
   * `full` — the opinion-first footer: left number block + right stars/microcopy,
   * pinned with `mt-auto` and a top border (CoffeeCard hero/default, RoasterCard).
   * `minimal` — a compact interactive stars + microcopy row, no number block
   * (similar / recommendation contexts).
   */
  variant?: "full" | "minimal";
};

/**
 * CardRatingFooter — shared, accessible rating-submission affordance for cards.
 *
 * Opening flow: clicking the shell (pointer) or activating a star (pointer/keyboard)
 * opens the QuickRating modal pre-filled with that value. The stars are the real
 * keyboard control (a `radiogroup` via StarRating); the shell `onClick` is a
 * pointer-only convenience that duplicates it, so the markup stays valid (no nested
 * interactive elements) while remaining fully operable by keyboard.
 */
export function CardRatingFooter({
  entityType,
  entityId,
  entityName,
  ratingAvg,
  ratingCount,
  userRating,
  size = "md",
  variant = "full",
}: CardRatingFooterProps) {
  const { openModal } = useModal();

  const hasOverallRating = Boolean(ratingAvg && ratingAvg > 0);
  const hasUserRating = typeof userRating === "number" && userRating > 0;
  const safeCount = ratingCount ?? 0;

  // Stars show the viewer's rating when present, else the community average.
  const starRating = hasUserRating ? userRating! : ratingAvg || 0;

  let microcopy: string;
  if (hasUserRating) {
    microcopy = `Your rating: ${userRating}`;
  } else if (hasOverallRating) {
    microcopy = "Tried this? Rate it.";
  } else {
    microcopy = "Be the first to rate.";
  }

  const ratingDisplay = hasOverallRating ? ratingAvg!.toFixed(1) : "—";
  const rateLabel = `Rate ${entityName}`;

  const openRatingModal = (rating?: number) => {
    if (!entityId) return;
    openModal({
      type: "custom",
      component: QuickRating,
      props: {
        entityType,
        entityId,
        initialRating: rating,
        onClose: () => {},
      },
    });
  };

  // Minimal: compact interactive stars + microcopy, no number block.
  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "mt-auto flex items-center justify-between gap-2 border-t border-border/40 bg-muted/20",
          "card-padding-compact",
          "transition-colors duration-200 group-hover:bg-muted/30"
        )}
        onClick={(e) => {
          // Keep card navigation isolated from the rating zone.
          e.stopPropagation();
        }}
      >
        <div className="shrink-0">
          <StarRating
            rating={starRating}
            size={size}
            interactive
            showEmpty
            ariaLabel={rateLabel}
            onRate={(rating) => openRatingModal(rating)}
          />
        </div>
        <span className="text-caption min-w-0 truncate text-right">
          {microcopy}
        </span>
      </div>
    );
  }

  // Full: opinion-first footer (number block left, stars + microcopy right).
  return (
    <div
      onClick={() => openRatingModal()}
      className={cn(
        "mt-auto border-t border-border/40 bg-muted/20 cursor-pointer",
        "transition-transform duration-200 ease-out origin-bottom",
        "group-hover:scale-[1.02] group-hover:bg-muted/30",
        "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      )}
    >
      <div
        className={cn(
          "flex flex-row items-center justify-between",
          "card-padding-compact"
        )}
      >
        {/* Left: Rating number block */}
        <div className="flex flex-col">
          <div className="text-title font-medium">{ratingDisplay}</div>
          <div className="flex flex-row items-baseline gap-1">
            <span className="text-label">Rating</span>
            {hasOverallRating && safeCount > 0 && (
              <span className="text-caption">({safeCount})</span>
            )}
          </div>
        </div>

        {/* Right: Action block — stars are the real (keyboard) control */}
        <div
          className="flex flex-col items-end gap-1"
          onClick={(e) => {
            // Prevent shell click when activating stars (pointer).
            e.stopPropagation();
          }}
        >
          <StarRating
            rating={starRating}
            size={size}
            interactive
            showEmpty
            ariaLabel={rateLabel}
            onRate={(rating) => openRatingModal(rating)}
          />
          <div className="text-caption">{microcopy}</div>
        </div>
      </div>
    </div>
  );
}
