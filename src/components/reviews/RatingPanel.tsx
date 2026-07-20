"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuickRating } from "@/components/reviews/QuickRating";
import { ShareRow } from "@/components/common/ShareRow";

type RatingPanelProps = {
  entityType: "coffee" | "roaster";
  entityId: string;
  name: string;
  slug: string;
};

/**
 * Client island for the rating form. Extracted so the detail page body can be a
 * Server Component. On save it refreshes the route so the server-rendered
 * ReviewStats/ReviewList pick up the new review (they render from server props,
 * not client hooks — that's what keeps SSR full-height and kills the CLS).
 */
export function RatingPanel({
  entityType,
  entityId,
  name,
  slug,
}: RatingPanelProps) {
  const router = useRouter();
  const [hasUserRating, setHasUserRating] = useState(false);

  return (
    <div className="surface-2 rounded-xl p-8 border border-accent/20">
      <QuickRating
        entityType={entityType}
        entityId={entityId}
        variant="inline"
        slug={slug || undefined}
        onSavedStateChange={(saved) => {
          setHasUserRating(saved);
          if (saved) router.refresh();
        }}
      />
      {hasUserRating && (
        <ShareRow entityType={entityType} name={name} slug={slug} />
      )}
    </div>
  );
}
