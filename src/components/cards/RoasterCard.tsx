// src/components/cards/RoasterCard.tsx
import Image from "next/image";
import { Icon } from "@/components/common/Icon";
import Tag, { TagList } from "@/components/common/Tag";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { coffeeImagePresets } from "@/lib/imagekit";
import { cn } from "@/lib/utils";
import type { RoasterSummary } from "@/types/roaster-types";
import { RoasterTrackingLink } from "../common/TrackingLink";

type RoasterCardProps = {
  roaster: RoasterSummary;
};

type RibbonType = "featured" | "editors-pick" | null;

function computeRibbon(roaster: RoasterSummary): RibbonType {
  if (roaster.coffee_count > 10) {
    return "featured";
  }
  if (roaster.avg_rating && roaster.avg_rating >= 4.5) {
    return "editors-pick";
  }
  return null;
}

function getRibbonLabel(ribbon: RibbonType): string {
  if (ribbon === "featured") {
    return "Featured";
  }
  if (ribbon === "editors-pick") {
    return "Editor's Pick";
  }
  return "";
}

function getRibbonStyles(ribbon: RibbonType): string {
  if (ribbon === "featured") {
    return "bg-chart-1 text-white";
  }
  if (ribbon === "editors-pick") {
    return "bg-chart-3 text-white";
  }
  return "";
}

function formatAddress(roaster: RoasterSummary): string {
  const parts: string[] = [];
  if (roaster.hq_city) {
    parts.push(roaster.hq_city);
  }
  if (roaster.hq_state) {
    parts.push(roaster.hq_state);
  }
  if (roaster.hq_country) {
    parts.push(roaster.hq_country);
  }
  return parts.join(", ");
}

function formatRating(rating: number | null): string {
  if (!rating) {
    return "";
  }
  return rating.toFixed(1);
}

function RatingDisplay({ roaster }: { roaster: RoasterSummary }) {
  const avgRating = roaster.avg_rating;
  const totalRatings = roaster.total_ratings_count;
  const hasRating = avgRating !== null && avgRating > 0;
  const hasCount = totalRatings !== null && totalRatings > 0;

  const showRating = hasRating || hasCount;
  if (!showRating) {
    return <span className="text-caption">View Roaster</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {hasRating && (
        <div className="flex items-center gap-1">
          <Icon color="primary" name="Star" size={14} />
          <span className="font-medium text-caption">
            {formatRating(roaster.avg_rating)}
          </span>
        </div>
      )}
      {hasCount && (
        <span className="text-caption text-muted-foreground">
          ({roaster.total_ratings_count}{" "}
          {roaster.total_ratings_count === 1 ? "rating" : "ratings"})
        </span>
      )}
    </div>
  );
}

export default function RoasterCard({ roaster }: RoasterCardProps) {
  if (!roaster) {
    return null;
  }
  if (!roaster.slug) {
    return null;
  }
  if (!roaster.name) {
    return null;
  }

  const ribbon = computeRibbon(roaster);
  const address = formatAddress(roaster);

  return (
    <RoasterTrackingLink
      ariaLabel={`View details for ${roaster.name} roaster`}
      coffeeCount={roaster.coffee_count || null}
      href={`/roasters/${roaster.slug}`}
      roasterOnlyId={roaster.id || null}
    >
      <Card
        className="glass-card card-padding card-hover hover-lift h-full"
        itemScope
        itemType="https://schema.org/Organization"
      >
        <div className="relative h-40 w-full overflow-hidden rounded-t-lg">
          <Image
            alt={roaster.name || "Coffee roaster image"}
            className="object-cover"
            fill
            itemProp="logo"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={coffeeImagePresets.roasterCard(undefined)}
          />

          {ribbon && (
            <div
              className={cn(
                "absolute top-2 left-2 rounded-md px-2 py-1 font-medium text-xs",
                getRibbonStyles(ribbon)
              )}
            >
              {getRibbonLabel(ribbon)}
            </div>
          )}
        </div>

        <CardHeader>
          <CardTitle
            className="font-semibold text-lg md:text-xl"
            itemProp="name"
          >
            {roaster.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          {address && (
            <div className="text-caption" itemProp="address">
              {address}
            </div>
          )}

          <TagList className="mt-2">
            {roaster.coffee_count > 0 && (
              <Tag variant="outline">
                {roaster.coffee_count}{" "}
                {roaster.coffee_count === 1 ? "Coffee" : "Coffees"}
              </Tag>
            )}
          </TagList>
        </CardContent>

        <CardFooter>
          <div className="rating-stars">
            <RatingDisplay roaster={roaster} />
          </div>
        </CardFooter>
        <meta
          content={`https://indiancoffeebeans.com/roasters/${roaster.slug}`}
          itemProp="url"
        />
      </Card>
    </RoasterTrackingLink>
  );
}
