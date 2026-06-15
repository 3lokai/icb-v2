"use client";

import { Accent } from "@/components/primitives/accent";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Icon } from "@/components/common/Icon";
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
      <Stack gap="8">
        <Stack gap="2">
          <Cluster align="center" className="justify-between">
            <h2 className="text-title text-balance leading-[1.1] italic m-0">
              My <Accent>Selections.</Accent>
            </h2>
            {!isAnonymous && (
              <ShareSection section="selections" username={username} />
            )}
          </Cluster>
          <p className="text-caption text-muted-foreground text-pretty md:max-w-md">
            {isAnonymous
              ? "Your chosen coffees, saved locally on this device. Sign up to share them and access them anywhere."
              : isOwner
                ? "A curated collection of my personal favorites — coffees I've rated and chosen to recommend publicly."
                : "Coffees this member has rated highly and chosen to recommend publicly."}
          </p>
        </Stack>

        {selections.length === 0 && !isOwner ? (
          <div className="border border-dashed border-border/60 rounded-3xl py-16 flex flex-col items-center justify-center text-center gap-3 bg-background/60">
            <Icon name="Heart" size={28} className="text-muted-foreground" />
            <p className="text-caption text-muted-foreground italic m-0 max-w-xs">
              No public selections yet. When this member recommends a coffee,
              it&apos;ll appear here.
            </p>
          </div>
        ) : (
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
                  <p className="text-micro text-accent mt-2 italic text-center">
                    Sign up to share selections publicly
                  </p>
                )}
              </div>
            )}
          </div>
        )}
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
            <p className="text-micro font-bold uppercase tracking-widest text-muted-foreground mb-1 text-left">
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
