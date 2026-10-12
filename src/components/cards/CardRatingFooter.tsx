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

  // Unrated: no stars at all — one quiet "Unrated · Rate it" line, so a grid of
  // new entries isn't a wall of hollow stars.
  const isUnrated = !hasOverallRating && !hasUserRating;

  let microcopy: string;
  if (hasUserRating) {
    microcopy = `Your rating: ${userRating}`;
  } else if (hasOverallRating) {
    microcopy = "Tried this? Rate it.";
  } else {
    microcopy = "Rate it";
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
  // ("Rate it") are a control rather than decoration. Falls back
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

  const shellClass =
    "mt-auto border-t border-border/40 px-3 py-2 md:px-4 md:py-2.5";

  const unratedRow = (
    <p className="text-caption text-muted-foreground">
      Unrated <span aria-hidden>·</span> {renderMicrocopy("text-caption")}
    </p>
  );

  const stars = (
    <StarRating
      rating={starRating}
      size={size}
      interactive
      showEmpty
      ariaLabel={rateLabel}
      onRate={(rating) => openRatingModal(rating)}
    />
  );

  // Minimal: compact interactive stars + microcopy, no number block.
  if (variant === "minimal") {
    return (
      <div
        className={cn(shellClass, "flex items-center justify-between gap-2")}
        onPointerDown={(e) => {
          // Keep card navigation isolated from the rating zone.
          e.stopPropagation();
        }}
      >
        {isUnrated ? (
          unratedRow
        ) : (
          <>
            <div className="shrink-0">{stars}</div>
            {renderMicrocopy("text-caption min-w-0 truncate text-right")}
          </>
        )}
      </div>
    );
  }

  // Full: opinion-first footer (number block left, stars + microcopy right).
  // Outer shell is a non-interactive layout container; the stars and the
  // microcopy are the only controls.
  if (isUnrated) {
    return <div className={shellClass}>{unratedRow}</div>;
  }

  return (
    <div
      className={cn(shellClass, "flex flex-row items-center justify-between")}
    >
      {/* Left: average and count at equal weight — "4.5 · 1 rating" */}
      {hasOverallRating ? (
        <p className="text-label font-medium">
          {ratingAvg!.toFixed(1)} <span aria-hidden>·</span> {safeCount}{" "}
          {safeCount === 1 ? "rating" : "ratings"}
        </p>
      ) : (
        <div aria-hidden />
      )}

      {/* Right: stars + microcopy are the only interactive controls */}
      <div className="flex flex-col items-end gap-0.5">
        {stars}
        {renderMicrocopy("text-caption")}
      </div>
    </div>
  );
}
