"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { coffeeImagePresets } from "@/lib/imagekit";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";
import { AddSelection } from "./AddSelection";
import { ShareSection } from "./ShareSection";
import { QuickRating } from "@/components/reviews/QuickRating";

type Selection = {
  id: string;
  name: string;
  roaster: string;
  note: string;
  image?: string;
  coffeeSlug?: string;
  roasterSlug?: string;
  coffeeId?: string;
};

type ProfileSelectionsProps = {
  selections: Selection[];
  username: string | null;
  isOwner?: boolean;
  isAnonymous?: boolean;
};

export function ProfileSelections({
  selections,
  username,
  isOwner = false,
  isAnonymous = false,
}: ProfileSelectionsProps) {
  const [editingSelection, setEditingSelection] = useState<Selection | null>(
    null
  );

  return (
    <div id="selections">
      <Stack gap="8" className="pt-8">
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
            <Card
              key={selection.id}
              className="relative group overflow-hidden border-border/40 rounded-[2rem] hover:border-accent/40 transition-all duration-500 flex flex-col sm:flex-row py-0 gap-0"
            >
              {/* Image Section */}
              <div className="relative w-full sm:w-2/5 aspect-[4/3] min-h-[200px] bg-muted grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden">
                {selection.image ? (
                  <Image
                    src={coffeeImagePresets.coffeeCard(selection.image)}
                    alt={selection.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-contain group-hover:scale-110 transition-transform duration-1000"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon
                      name="Coffee"
                      size={40}
                      className="text-muted-foreground/20"
                    />
                  </div>
                )}
              </div>

              {/* Content Section */}
              <CardContent className="p-8 flex-1 flex flex-col">
                <Stack gap="4" className="h-full">
                  <Stack gap="1">
                    {selection.roasterSlug && selection.coffeeSlug ? (
                      <Link
                        href={coffeeDetailHref(
                          selection.roasterSlug,
                          selection.coffeeSlug
                        )}
                        className="text-heading font-serif leading-[1.1] hover:text-accent transition-colors"
                      >
                        {selection.name}
                      </Link>
                    ) : (
                      <h3 className="text-heading font-serif leading-[1.1]">
                        {selection.name}
                      </h3>
                    )}
                    <p className="text-label mt-1">{selection.roaster}</p>
                  </Stack>
                  <div className="relative mt-2">
                    <Icon
                      name="Quotes"
                      size={24}
                      className="absolute -top-4 -left-3 text-accent/10 rotate-180"
                    />
                    <p className="text-body italic text-muted-foreground/90 leading-relaxed font-serif">
                      &quot;{selection.note}&quot;
                    </p>
                  </div>
                </Stack>

                {isOwner && (
                  <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full"
                      onClick={() => setEditingSelection(selection)}
                    >
                      <Icon name="PencilSimple" size={14} />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
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

      {/* Edit Rating Dialog */}
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
    </div>
  );
}
