"use client";

import { useReviews, useReviewStats } from "@/hooks/use-reviews";
import { ReviewStats } from "./ReviewStats";
import { ReviewCapture } from "./ReviewCapture";
import { ReviewList } from "./ReviewList";
import { Stack } from "@/components/primitives/stack";
import { Separator } from "@/components/ui/separator";

type ReviewSectionProps = {
  entityType: "coffee" | "roaster";
  entityId: string;
};

export function ReviewSection({ entityType, entityId }: ReviewSectionProps) {
  const { data: stats } = useReviewStats(entityType, entityId);
  const { data: reviews } = useReviews(entityType, entityId);
  const hasReviews = reviews && reviews.length > 0;

  return (
    <Stack gap="8">
      {/* Stats Header - Always shown with heading */}
      <ReviewStats stats={stats ?? null} />
      <Separator />

      {/* Capture UI - Always shown */}
      <ReviewCapture entityType={entityType} entityId={entityId} />

      {/* Reviews List - Only shown if reviews exist */}
      {hasReviews && (
        <>
          <Separator />
          <ReviewList entityType={entityType} reviews={reviews} />
        </>
      )}
    </Stack>
  );
}
