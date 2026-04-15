"use client";

import Image from "next/image";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { coffeeImagePresets } from "@/lib/imagekit";
import { coffeeDetailHref } from "@/lib/utils/coffee-url";

export type ProfileSelectionListItem = {
  id: string;
  name: string;
  roaster: string;
  note: string;
  image?: string;
  coffeeSlug?: string;
  roasterSlug?: string;
  coffeeId?: string;
};

type ProfileSelectionCardProps = {
  selection: ProfileSelectionListItem;
  isOwner?: boolean;
  onEdit?: (selection: ProfileSelectionListItem) => void;
  onRemoveFromRecommendations?: (selection: ProfileSelectionListItem) => void;
};

export function ProfileSelectionCard({
  selection,
  isOwner = false,
  onEdit,
  onRemoveFromRecommendations,
}: ProfileSelectionCardProps) {
  return (
    <Card className="relative group overflow-hidden border-border/40 rounded-[2rem] hover:border-accent/40 transition-all duration-500 flex flex-col sm:flex-row py-0 gap-0">
      <div className="relative w-full sm:w-2/5 aspect-[4/3] min-h-[200px] bg-muted overflow-hidden">
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

        {isOwner && (onEdit || onRemoveFromRecommendations) && (
          <div className="absolute top-4 right-6 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 sm:[@media(hover:none)]:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full"
                onClick={() => onEdit(selection)}
                aria-label={`Edit rating for ${selection.name}`}
              >
                <Icon name="PencilSimple" size={14} />
              </Button>
            )}
            {onRemoveFromRecommendations && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground bg-background/50 backdrop-blur-sm rounded-full"
                onClick={() => onRemoveFromRecommendations(selection)}
                aria-label={`Remove ${selection.name} from public recommendations`}
              >
                <Icon name="X" size={14} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
