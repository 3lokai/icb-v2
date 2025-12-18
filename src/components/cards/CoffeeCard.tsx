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
        className={cn(
          "group relative overflow-hidden",
          "bg-card/70 backdrop-blur-sm border border-border/40",
          "rounded-xl shadow-md hover:shadow-xl",
          "transition-all duration-300 hover:bg-card/80 hover:-translate-y-1",
          "h-full p-4 md:p-6"
        )}
        itemScope
        itemType="https://schema.org/Product"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            alt={coffee.name || "Coffee product image"}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            fill
            itemProp="image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={coffeeImagePresets.coffeeCard(coffee.image_url)}
          />
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {displayRibbon && (
            <div
              className={cn(
                "absolute top-3 right-3 rounded-md px-3 py-1.5 font-semibold text-xs uppercase tracking-wider",
                "shadow-lg backdrop-blur-sm border border-white/20",
                getRibbonStyles(displayRibbon)
              )}
            >
              {getRibbonLabel(displayRibbon)}
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle
            className="font-semibold text-lg md:text-xl line-clamp-2 min-h-[3.5rem]"
            itemProp="name"
          >
            {coffee.name}
          </CardTitle>
          {coffee.roaster_name && (
            <div className="text-caption hover:text-accent transition-colors line-clamp-1" itemProp="brand">
              by {coffee.roaster_name}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-2">
          <TagList className="gap-2">
            {coffee.roast_level && (
              <Tag variant="outline">{coffee.roast_level}</Tag>
            )}
            {coffee.process && <Tag variant="outline">{coffee.process}</Tag>}
            {coffee.decaf && <Tag variant="outline">Decaf</Tag>}
            {coffee.is_limited && <Tag variant="outline">Limited</Tag>}
          </TagList>
        </CardContent>

        <CardFooter className="flex justify-between items-center pt-4 border-t border-border/30">
          <div className="rating-stars">
            {/* Placeholder for future ratings */}
          </div>
          {price && (
            <div
              className="flex items-center gap-1 font-bold text-base bg-accent/10 px-2.5 py-1 rounded-md border border-accent/30"
              itemProp="offers"
              itemScope
              itemType="https://schema.org/Offer"
            >
              <span className="text-xs text-muted-foreground font-normal" itemProp="priceCurrency">₹</span>
              <span className="text-accent-foreground" itemProp="price">
                {formatPrice(price).replace(/₹/g, "").trim()}
              </span>
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
