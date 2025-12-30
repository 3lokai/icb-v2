// src/components/cards/CoffeeCard.tsx
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { coffeeImagePresets } from "@/lib/imagekit";
import { computeCoffeeRibbon, formatPrice } from "@/lib/utils/coffee-utils";
import type { CoffeeSummary } from "@/types/coffee-types";
import { cn, capitalizeFirstLetter } from "../../lib/utils";
import { CoffeeTrackingLink } from "../common/TrackingLink";
import { Stack } from "../primitives/stack";
import { Icon } from "../common/Icon";

type CoffeeCardProps = {
  coffee: CoffeeSummary;
};

function getRibbonLabel(
  ribbon: ReturnType<typeof computeCoffeeRibbon>
): string {
  if (ribbon === "featured") {
    return "Featured";
  }
  if (ribbon === "new") {
    return "New";
  }
  if (ribbon === "editors-pick") {
    return "Editor's Pick";
  }
  if (ribbon === "seasonal") {
    return "Seasonal";
  }
  return "";
}

function getRibbonStyles(ribbon: ReturnType<typeof computeCoffeeRibbon>) {
  if (ribbon === "featured") {
    return "bg-primary text-primary-foreground border-border";
  }
  if (ribbon === "new") {
    return "bg-accent text-accent-foreground border-border";
  }
  if (ribbon === "editors-pick") {
    return "bg-foreground text-background border-border";
  }
  if (ribbon === "seasonal") {
    return "bg-secondary text-secondary-foreground border-border";
  }
  return "";
}

export default function CoffeeCard({ coffee }: CoffeeCardProps) {
  if (!coffee) {
    return null;
  }
  if (!coffee.slug) {
    return null;
  }
  if (!coffee.name) {
    return null;
  }

  const displayRibbon = computeCoffeeRibbon(coffee);
  const price = coffee.best_normalized_250g;
  const hasRoaster = Boolean(coffee.roaster_name);
  const ariaLabel = hasRoaster
    ? `View details for ${coffee.name} coffee by ${coffee.roaster_name}`
    : `View details for ${coffee.name} coffee`;

  return (
    <CoffeeTrackingLink
      ariaLabel={ariaLabel}
      coffeeId={coffee.coffee_id || null}
      href={`/coffees/${coffee.slug}`}
      roasterId={coffee.roaster_id || null}
    >
      <Card
        className={cn(
          "group relative overflow-hidden",
          "bg-card border border-border",
          "rounded-4xl shadow-sm hover:shadow-md",
          "transition-all duration-500 hover:-translate-y-1",
          "h-full flex flex-col"
        )}
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Magazine Accent: Subtle top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 md:h-1.5 bg-linear-to-r from-primary/60 via-accent to-primary/40 opacity-55 z-10" />

        {/* Thumbnail Layer */}
        <div className="relative aspect-4/3 w-full overflow-hidden">
          <Image
            alt={coffee.name || "Coffee product image"}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            fill
            itemProp="image"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
            src={coffeeImagePresets.coffeeCard(coffee.image_url)}
          />

          {/* Top image-integrated selector fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-linear-to-b from-background/70 via-background/30 to-transparent"
          />

          {/* Ribbon / selector */}
          {displayRibbon && (
            <div
              className={cn(
                "absolute top-3 right-3 rounded-full px-3 py-1 shadow-sm border backdrop-blur-[1px]",
                getRibbonStyles(displayRibbon)
              )}
            >
              <span className="text-overline uppercase font-bold">
                {getRibbonLabel(displayRibbon)}
              </span>
            </div>
          )}
        </div>

        {/* Editorial Content */}
        <div className="relative flex-1 p-5 md:p-6">
          <Stack gap="4" className="relative">
            <Stack gap="1">
              <CardTitle
                className="text-heading text-balance line-clamp-2 leading-tight"
                itemProp="name"
              >
                {coffee.name}
              </CardTitle>

              {coffee.roaster_name && (
                <div className="flex items-center gap-1.5 group/roaster">
                  <span className="text-caption text-muted-foreground/60 italic">
                    by
                  </span>
                  <span
                    className="text-caption font-semibold text-foreground group-hover/roaster:text-primary transition-colors cursor-pointer"
                    itemProp="brand"
                  >
                    {coffee.roaster_name}
                  </span>
                </div>
              )}
            </Stack>

            {/* Metadata Grid - Institutional style */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex flex-col gap-0.5 border-l-2 border-accent/20 pl-3">
                <span className="text-overline uppercase font-bold text-muted-foreground/60">
                  Roast
                </span>
                <span className="text-caption font-medium line-clamp-1">
                  {capitalizeFirstLetter(
                    coffee.roast_level_raw ||
                      coffee.roast_style_raw ||
                      coffee.roast_level
                  ) || "—"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 border-l-2 border-accent/20 pl-3">
                <span className="text-overline uppercase font-bold text-muted-foreground/60">
                  Process
                </span>
                <span className="text-caption font-medium line-clamp-1">
                  {capitalizeFirstLetter(
                    coffee.process_raw || coffee.process
                  ) || "—"}
                </span>
              </div>
            </div>
          </Stack>
        </div>

        {/* Action / Price Floor */}
        <div className="relative mt-auto px-5 md:px-6 pb-4 md:pb-5 pt-4 border-t border-border/40">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-overline uppercase font-bold text-muted-foreground/60">
                Starting Price
              </span>
              {price ? (
                <div
                  className="flex items-center gap-1.5 mt-0.5"
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                    <span className="text-caption font-bold text-accent">
                      ₹
                    </span>
                    <span
                      className="text-caption font-black text-accent"
                      itemProp="price"
                    >
                      {formatPrice(price).replace(/₹/g, "").trim()}
                    </span>
                  </div>
                  <span className="text-overline text-muted-foreground/60 italic">
                    / 250g
                  </span>
                  <link
                    href="https://schema.org/InStock"
                    itemProp="availability"
                  />
                </div>
              ) : (
                <span className="text-caption text-muted-foreground mt-0.5 italic">
                  Contact Roaster
                </span>
              )}
            </div>

            <div
              className="h-8 w-8 rounded-full border border-border flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary shrink-0"
              aria-hidden="true"
            >
              <Icon name="ArrowRight" size={16} />
            </div>
          </div>
        </div>

        <meta
          content={`https://indiancoffeebeans.com/coffees/${coffee.slug}`}
          itemProp="url"
        />
      </Card>
    </CoffeeTrackingLink>
  );
}
