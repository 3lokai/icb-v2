"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { AddSelection } from "./AddSelection";
import { ShareSection } from "./ShareSection";
import { QuickRating } from "@/components/reviews/QuickRating";
import {
  ProfileSelectionCard,
  type ProfileSelectionListItem,
} from "@/components/cards/ProfileSelectionCard";
import { useSetReviewRecommendFalse } from "@/hooks/use-reviews";
import { ensureAnonId } from "@/lib/reviews/anon-id";
import { cn } from "@/lib/utils";

type ProfileSelectionsProps = {
  selections: ProfileSelectionListItem[];
  username: string | null;
  /** Used with `revalidatePath` after clearing a recommendation */
  revalidateProfilePath: string;
  isOwner?: boolean;
  isAnonymous?: boolean;
};

export function ProfileSelections({
  selections,
  username,
  revalidateProfilePath,
  isOwner = false,
  isAnonymous = false,
}: ProfileSelectionsProps) {
  const router = useRouter();
  const [editingSelection, setEditingSelection] =
    useState<ProfileSelectionListItem | null>(null);
  const [removingSelection, setRemovingSelection] =
    useState<ProfileSelectionListItem | null>(null);

  const { mutate: clearRecommendation, isPending: isClearingRecommend } =
    useSetReviewRecommendFalse();

  const handleConfirmRemoveFromRecommendations = () => {
    if (!removingSelection) return;
    const anonId = ensureAnonId();
    clearRecommendation(
      {
        reviewId: removingSelection.id,
        anonId,
        revalidateProfilePath,
      },
      {
        onSuccess: () => {
          setRemovingSelection(null);
          router.refresh();
          toast.success(
            "This coffee has been removed from recommendations, but your review is still safe."
          );
        },
        onError: (err) => {
          toast.error(
            err instanceof Error ? err.message : "Something went wrong."
          );
        },
      }
    );
  };

  return (
    <div>
      <Stack gap="8" className="pt-0 md:pt-2">
        <Stack gap="6">
          <div className="inline-flex items-center gap-4">
            <span className="h-px w-8 md:w-12 bg-accent/60" />
            <span className="text-overline text-muted-foreground tracking-[0.15em]">
              COLLECTION
            </span>
          </div>
          <Stack gap="1">
            <Cluster align="center" className="justify-between">
              <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                My <span className="text-accent italic">Selections.</span>
              </h2>
              {!isAnonymous && (
                <ShareSection section="selections" username={username} />
              )}
            </Cluster>
            <p className="text-caption text-pretty md:max-w-md">
              {isAnonymous
                ? "Your chosen coffees, saved locally on this device. Sign up to share them and access them anywhere."
                : "A curated collection of my personal favorites. These are the coffees I have rated and chosen to recommend publicly."}
            </p>
          </Stack>
        </Stack>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selections.map((selection) => (
            <ProfileSelectionCard
              key={selection.id}
              selection={selection}
              isOwner={isOwner}
              onEdit={isOwner ? setEditingSelection : undefined}
              onRemoveFromRecommendations={
                isOwner ? setRemovingSelection : undefined
              }
            />
          ))}

          {isOwner && (
            <div className="relative">
              <AddSelection />
              {isAnonymous && (
                <p className="text-micro text-accent/60 mt-2 italic text-center">
                  Sign up to share selections publicly
                </p>
              )}
            </div>
          )}
        </div>
      </Stack>

      <Dialog
        open={!!editingSelection}
        onOpenChange={(open) => !open && setEditingSelection(null)}
      >
        <DialogContent className="max-w-lg p-0">
          <VisuallyHidden>
            <DialogTitle>Edit rating for {editingSelection?.name}</DialogTitle>
          </VisuallyHidden>
          {editingSelection && (
            <QuickRating
              entityType="coffee"
              entityId={editingSelection.coffeeId ?? editingSelection.id}
              onClose={() => setEditingSelection(null)}
              variant="modal"
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!removingSelection}
        onOpenChange={(open) => !open && setRemovingSelection(null)}
      >
        <DialogContent
          className={cn(
            "surface-2 overflow-hidden rounded-[2.5rem] p-0 gap-0 sm:max-w-md"
          )}
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-destructive/60 via-destructive to-destructive/60 opacity-60 z-10" />
          <DialogHeader className="p-8 pb-6 border-b border-border/10 pt-10">
            <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60 mb-1 text-left">
              Confirm Action
            </p>
            <DialogTitle className="font-serif italic text-title text-primary leading-tight text-left">
              Remove from public recommendations?
            </DialogTitle>
            <DialogDescription className="text-body text-muted-foreground mt-2 text-left">
              {removingSelection ? (
                <>
                  <span className="font-medium text-foreground">
                    {removingSelection.name}
                  </span>{" "}
                  will no longer appear in your selections. Your rating and
                  written review stay on your profile and on the coffee page.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="p-8 pt-6 flex-row gap-3 justify-end sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRemovingSelection(null)}
              disabled={isClearingRecommend}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmRemoveFromRecommendations}
              disabled={isClearingRecommend}
            >
              {isClearingRecommend ? "Updating…" : "Remove from selections"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
