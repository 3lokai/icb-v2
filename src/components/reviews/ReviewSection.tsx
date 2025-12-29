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

  return (
    <Stack gap="8">
      {/* Stats Header */}
      {stats && stats.review_count && stats.review_count > 0 && (
        <>
          <ReviewStats stats={stats} />
          <Separator />
        </>
      )}

      {/* Capture UI - Always First */}
      <ReviewCapture entityType={entityType} entityId={entityId} />

      <Separator />

      {/* Reviews List */}
      <ReviewList entityType={entityType} reviews={reviews ?? []} />
    </Stack>
  );
}
