"use client";

import { ExitIntentRatingModal } from "@/components/reviews";
import { useExitIntentRating } from "@/hooks/use-exit-intent-rating";
import type { LatestReviewPerIdentity } from "@/types/review-types";

type ExitIntentRatingProps = {
  entityType: "coffee" | "roaster";
  entityId: string;
  name: string;
  slug: string;
  reviews: LatestReviewPerIdentity[] | undefined;
};

/** Client island: exit-intent rating prompt, extracted from the detail page body. */
export function ExitIntentRating({
  entityType,
  entityId,
  name,
  slug,
  reviews,
}: ExitIntentRatingProps) {
  const { open, setOpen } = useExitIntentRating({
    entityId,
    entityType,
    reviews,
    mobileDelayMs: 45_000,
  });
  return (
    <ExitIntentRatingModal
      open={open}
      onOpenChange={setOpen}
      entityType={entityType}
      entityId={entityId}
      coffeeName={name}
      slug={slug}
    />
  );
}
