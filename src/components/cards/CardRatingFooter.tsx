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
 * Opening flow: activating a star (pointer/keyboard) opens the QuickRating modal
 * pre-filled with that value; activating the microcopy opens the same modal with
 * no rating pre-filled. Those two are the footer's only interactive elements and
 * they sit side by side — the shell stays a non-interactive layout container, so
 * nothing nests and the whole strip is operable by keyboard and pointer.
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

  // The microcopy is a second way into the same modal — same target as the
  // stars, only without a pre-filled value, so the words people actually read
  // ("Be the first to rate.") are a control rather than decoration. Falls back
  // to plain text when there is nothing to rate, so it never renders dead.
  const renderMicrocopy = (className: string) =>
    entityId ? (
      <button
        type="button"
        onClick={() => openRatingModal()}
        className={cn(
          className,
          "cursor-pointer rounded-sm underline-offset-2 transition-colors",
          "hover:text-foreground hover:underline",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        )}
      >
        {microcopy}
      </button>
    ) : (
      <span className={className}>{microcopy}</span>
    );

  // Minimal: compact interactive stars + microcopy, no number block.
  if (variant === "minimal") {
    return (
      <div
        className={cn(
          "mt-auto flex items-center justify-between gap-2 border-t border-border/40 bg-muted/20",
          "px-3 py-2 md:px-4 md:py-2.5",
          "transition-colors duration-200 group-hover:bg-muted/30"
        )}
        onPointerDown={(e) => {
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
        {renderMicrocopy("text-caption min-w-0 truncate text-right")}
      </div>
    );
  }

  // Full: opinion-first footer (number block left, stars + microcopy right).
  // Outer shell is a non-interactive layout container; the stars and the
  // microcopy are the only controls.
  return (
    <div
      className={cn(
        "mt-auto border-t border-border/40 bg-muted/20",
        "transition-transform duration-200 ease-out origin-bottom",
        "group-hover:scale-[1.02] group-hover:bg-muted/30",
        "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      )}
    >
      <div
        className={cn(
          "flex flex-row items-center justify-between",
          "px-3 py-2 md:px-4 md:py-2.5"
        )}
      >
        {/* Left: Rating number block (empty until the entity has a rating) */}
        {hasOverallRating ? (
          <div className="flex flex-row items-baseline gap-1.5">
            <span className="text-heading font-medium">
              {ratingAvg!.toFixed(1)}
            </span>
            <span className="text-label">Rating</span>
            {safeCount > 0 && (
              <span className="text-caption">({safeCount})</span>
            )}
          </div>
        ) : (
          <div aria-hidden />
        )}

        {/* Right: Action block — stars are the sole interactive control */}
        <div className="flex flex-col items-end gap-0.5">
          <StarRating
            rating={starRating}
            size={size}
            interactive
            showEmpty
            ariaLabel={rateLabel}
            onRate={(rating) => openRatingModal(rating)}
          />
          {renderMicrocopy("text-caption")}
        </div>
      </div>
    </div>
  );
}
