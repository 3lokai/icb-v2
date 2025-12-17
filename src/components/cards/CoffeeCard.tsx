// src/components/cards/CoffeeCard.tsx
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { coffeeImagePresets } from "@/lib/imagekit";
import { computeCoffeeRibbon, formatPrice } from "@/lib/utils/coffee-utils";
import type { CoffeeSummary } from "@/types/coffee-types";
import { cn } from "../../lib/utils";
import Tag, { TagList } from "../common/Tag";
import { CoffeeTrackingLink } from "../common/TrackingLink";

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
    return "bg-chart-1 text-white";
  }
  if (ribbon === "new") {
    return "bg-chart-2 text-white";
  }
  if (ribbon === "editors-pick") {
    return "bg-chart-3 text-white";
  }
  if (ribbon === "seasonal") {
    return "bg-accent text-accent-foreground";
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
        className={cn("glass-card card-padding card-hover hover-lift h-full")}
        itemScope
        itemType="https://schema.org/Product"
      >
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            alt={coffee.name || "Coffee product image"}
            className="object-cover"
            fill
            itemProp="image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={coffeeImagePresets.coffeeCard(coffee.image_url)}
          />

          {displayRibbon && (
            <div
              className={cn(
                "absolute top-2 right-2 rounded-md px-2 py-1 font-medium text-xs",
                getRibbonStyles(displayRibbon)
              )}
            >
              {getRibbonLabel(displayRibbon)}
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle
            className="font-semibold text-lg md:text-xl"
            itemProp="name"
          >
            {coffee.name}
          </CardTitle>
          {coffee.roaster_name && (
            <div className="text-caption" itemProp="brand">
              by {coffee.roaster_name}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <TagList>
            {coffee.roast_level && (
              <Tag variant="outline">{coffee.roast_level}</Tag>
            )}
            {coffee.process && <Tag variant="outline">{coffee.process}</Tag>}
            {coffee.decaf && <Tag variant="outline">Decaf</Tag>}
            {coffee.is_limited && <Tag variant="outline">Limited</Tag>}
          </TagList>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="rating-stars">
            {/* Placeholder for future ratings */}
          </div>
          {price && (
            <div
              className="price-tag"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <span itemProp="priceCurrency">INR</span>
              <span itemProp="price">{formatPrice(price)}</span>
              <link href="https://schema.org/InStock" itemProp="availability" />
            </div>
          )}
        </CardFooter>
        <meta
          content={`https://indiancoffeebeans.com/coffees/${coffee.slug}`}
          itemProp="url"
        />
      </Card>
    </CoffeeTrackingLink>
  );
}
