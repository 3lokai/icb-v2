"use client";
// src/components/cards/RoasterCard.tsx
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RoasterSummary, SimilarRoaster } from "@/types/roaster-types";
import { Stack } from "../primitives/stack";
import { CoffeeIcon, MapPinIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "../common/Icon";
import { CardRatingFooter } from "./CardRatingFooter";
import { useRoasterLogoPlate } from "@/hooks/useRoasterLogoPlate";
import { labelForTag } from "@/lib/utils/roaster-tags";

// The "similar" variant is fed by the roaster_similar matview, which carries only
// slug/name/shared_tags — no ratings, no counts. Discriminating on `variant` keeps
// it honest instead of faking a RoasterSummary full of nulls.
type RoasterCardProps =
  | { variant?: "default" | "compact"; roaster: RoasterSummary }
  | { variant: "similar"; roaster: SimilarRoaster };

function initialsFor(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatAddress(roaster: RoasterSummary): string {
  const parts: string[] = [];
  if (roaster.hq_city) {
    parts.push(roaster.hq_city);
  }
  if (roaster.hq_state) {
    parts.push(roaster.hq_state);
  }
  return parts.join(", ");
}

/**
 * "Roasters like this one" tile. Fed by the roaster_similar matview, so it has no
 * ratings or coffee count to show — the shared traits are the payload.
 */
function SimilarRoasterCard({ roaster }: { roaster: SimilarRoaster }) {
  const [hasError, setHasError] = useState(false);
  const { logoUrl, plateClass } = useRoasterLogoPlate(roaster.slug);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden",
        "surface-1 rounded-lg card-hover",
        "h-full flex flex-col p-0"
      )}
      itemScope
      itemType="https://schema.org/Organization"
    >
      <Link
        aria-label={`View ${roaster.name} roaster profile`}
        className="flex h-full flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        href={`/roasters/${roaster.slug}`}
      >
        {/* Logo plate - shorter than the directory tile */}
        <div
          className={cn(
            "relative flex w-full items-center justify-center overflow-hidden border-b border-border/40 p-6 transition-colors duration-300",
            plateClass
          )}
        >
          <div className="relative flex h-14 w-full max-w-[120px] items-center justify-center">
            {!hasError && logoUrl ? (
              <Image
                alt={roaster.name}
                className="object-contain"
                fill
                itemProp="logo"
                sizes="(max-width: 640px) 50vw, 120px"
                src={logoUrl}
                onError={() => setHasError(true)}
                unoptimized
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20">
                <span className="text-body font-black tracking-tighter text-accent">
                  {initialsFor(roaster.name)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 card-padding-compact">
          <Stack gap="2">
            <CardTitle
              className="text-heading text-balance line-clamp-2 leading-tight"
              itemProp="name"
            >
              {roaster.name}
            </CardTitle>

            {/* Why this roaster matched */}
            {roaster.shared_tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {roaster.shared_tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-micro">
                    {labelForTag(tag)}
                  </Badge>
                ))}
              </div>
            )}
          </Stack>
        </div>
      </Link>

      <meta
        content={`https://www.indiancoffeebeans.com/roasters/${roaster.slug}`}
        itemProp="url"
      />
    </Card>
  );
}

export default function RoasterCard(props: RoasterCardProps) {
  // Narrow before any hooks run — the similar variant takes a different shape
  // (roaster_similar rows carry no ratings or counts).
  if (props.variant === "similar") {
    return <SimilarRoasterCard roaster={props.roaster} />;
  }
  return (
    <RoasterSummaryCard
      roaster={props.roaster}
      variant={props.variant ?? "default"}
    />
  );
}

function RoasterSummaryCard({
  roaster,
  variant,
}: {
  roaster: RoasterSummary;
  variant: "default" | "compact";
}) {
  const [hasError, setHasError] = useState(false);
  const { logoUrl, plateClass } = useRoasterLogoPlate(roaster?.slug);

  if (!roaster) {
    return null;
  }
  if (!roaster.slug) {
    return null;
  }
  if (!roaster.name) {
    return null;
  }

  const hqLocation = formatAddress(roaster);
  const coffeeCount = roaster.coffee_count || 0;

  const initials = initialsFor(roaster.name);

  const ariaLabel = `View coffees from ${roaster.name} roaster`;

  // Compact variant - dense, horizontal row card
  if (variant === "compact") {
    return (
      <Link aria-label={ariaLabel} href={`/roasters/${roaster.slug}`}>
        <Card
          className={cn(
            "group relative overflow-hidden cursor-pointer",
            "surface-1 rounded-lg card-hover",
            "flex flex-row items-center gap-3 card-padding-compact",
            "h-[80px]"
          )}
          itemScope
          itemType="https://schema.org/Organization"
        >
          {/* Small logo - 40px square, left aligned */}
          <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded">
            {!hasError ? (
              <Image
                alt={roaster.name || "Coffee roaster logo"}
                className="object-contain"
                fill
                itemProp="logo"
                sizes="40px"
                src={logoUrl ?? ""}
                onError={() => setHasError(true)}
                unoptimized
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted border border-border">
                <span className="text-caption font-semibold text-muted-foreground">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Content - 1-2 lines total */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <Stack gap="1">
              {/* Roaster name - primary */}
              <h3 className="text-body line-clamp-1" itemProp="name">
                {roaster.name}
              </h3>

              {/* Secondary info - always show coffee count, location optional */}
              {coffeeCount > 0 && (
                <div className="flex items-center gap-1.5 line-clamp-1">
                  <Icon icon={CoffeeIcon} size={12} color="muted" />
                  <span className="text-caption">
                    {coffeeCount} {coffeeCount === 1 ? "coffee" : "coffees"}
                  </span>
                  {hqLocation && (
                    <>
                      <span className="text-caption text-muted-foreground">
                        •
                      </span>
                      <Icon icon={MapPinIcon} size={12} color="muted" />
                      <span className="text-caption">{hqLocation}</span>
                    </>
                  )}
                </div>
              )}
            </Stack>
          </div>

          <meta
            content={`https://www.indiancoffeebeans.com/roasters/${roaster.slug}`}
            itemProp="url"
          />
        </Card>
      </Link>
    );
  }

  // Default variant - directory tile with rating footer
  return (
    <Card
      className={cn(
        "group relative overflow-hidden",
        "surface-1 rounded-lg card-hover",
        "h-full flex flex-col p-0"
      )}
      itemScope
      itemType="https://schema.org/Organization"
    >
      <Link
        aria-label={ariaLabel}
        className="flex-1 flex flex-col cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        href={`/roasters/${roaster.slug}`}
      >
        {/* Logo Container - Dynamic gradient based on logo color */}
        <div
          className={cn(
            "relative w-full overflow-hidden flex items-center justify-center border-b border-border/40 transition-colors duration-300",
            plateClass
          )}
        >
          {/* Subtle Plate Texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.4) 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            />
          </div>

          {/* Logo Frame: Centered, larger size */}
          <div className="relative z-10 flex h-full w-full items-center justify-center p-8">
            <div className="relative flex h-20 w-full items-center justify-center max-w-[160px]">
              {!hasError ? (
                <Image
                  alt={roaster.name || "Coffee roaster logo"}
                  className="object-contain"
                  fill
                  itemProp="logo"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 160px"
                  src={logoUrl ?? ""}
                  onError={() => setHasError(true)}
                  unoptimized
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20">
                  <span className="text-heading font-black tracking-tighter text-accent">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative card-padding-compact">
          <Stack gap="1">
            {/* Roaster name */}
            <CardTitle
              className="text-heading text-balance line-clamp-2 leading-tight"
              itemProp="name"
            >
              {roaster.name}
            </CardTitle>

            {/* Location */}
            {hqLocation && (
              <div className="flex items-center gap-1.5">
                <Icon icon={MapPinIcon} size={14} color="muted" />
                <p className="text-body-muted">{hqLocation}</p>
              </div>
            )}

            {/* Coffee count */}
            <div className="flex items-center gap-1.5">
              <Icon icon={CoffeeIcon} size={14} color="muted" />
              <p className="text-body-muted">
                {coffeeCount} {coffeeCount === 1 ? "coffee" : "coffees"}
              </p>
            </div>
          </Stack>
        </div>
      </Link>

      {/* Opinion-first rating footer — roaster ratings (QuickRating entityType="roaster") */}
      <CardRatingFooter
        entityType="roaster"
        entityId={roaster.id}
        entityName={roaster.name}
        ratingAvg={roaster.avg_rating}
        ratingCount={roaster.total_ratings_count}
        size="md"
      />

      <meta
        content={`https://www.indiancoffeebeans.com/roasters/${roaster.slug}`}
        itemProp="url"
      />
    </Card>
  );
}
