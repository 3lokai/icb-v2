"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { QuickRating } from "./QuickRating";

export type ExitIntentRatingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: "coffee" | "roaster";
  entityId: string;
  coffeeName?: string | null;
  slug?: string | null;
};

/**
 * Wraps QuickRating (modal variant) in the same Dialog shell as ProfileSelections.
 */
export function ExitIntentRatingModal({
  open,
  onOpenChange,
  entityType,
  entityId,
  coffeeName,
  slug,
}: ExitIntentRatingModalProps) {
  const title =
    entityType === "coffee"
      ? `Rate ${coffeeName?.trim() || "this coffee"}`
      : "Leave a rating";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        <QuickRating
          entityType={entityType}
          entityId={entityId}
          slug={slug ?? undefined}
          variant="modal"
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
