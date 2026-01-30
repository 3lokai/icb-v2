"use client";
// src/components/cards/RoasterCard.tsx
import { useState } from "react";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RoasterSummary } from "@/types/roaster-types";
import { Stack } from "../primitives/stack";
import { roasterImagePresets } from "@/lib/imagekit";
import { RoasterTrackingLink } from "../common/TrackingLink";
import { Icon } from "../common/Icon";

type RoasterCardProps = {
  roaster: RoasterSummary;
  variant?: "default" | "compact";
};

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

export default function RoasterCard({
  roaster,
  variant = "default",
}: RoasterCardProps) {
  const [hasError, setHasError] = useState(false);

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

  const initials = roaster.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const ariaLabel = `View coffees from ${roaster.name} roaster`;

  // Compact variant - dense, horizontal row card
  if (variant === "compact") {
    return (
      <RoasterTrackingLink
        ariaLabel={ariaLabel}
        coffeeCount={coffeeCount || null}
        href={`/roasters/${roaster.slug}`}
        roasterOnlyId={roaster.id || null}
      >
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
                src={roasterImagePresets.roasterLogo(
                  `roasters/${roaster.slug}-logo`
                )}
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
                  <Icon name="Coffee" size={12} color="muted" />
                  <span className="text-caption">
                    {coffeeCount} {coffeeCount === 1 ? "coffee" : "coffees"}
                  </span>
                  {hqLocation && (
                    <>
                      <span className="text-caption text-muted-foreground">
                        •
                      </span>
                      <Icon name="MapPin" size={12} color="muted" />
                      <span className="text-caption">{hqLocation}</span>
                    </>
                  )}
                </div>
              )}
            </Stack>
          </div>

          <meta
            content={`https://indiancoffeebeans.com/roasters/${roaster.slug}`}
            itemProp="url"
          />
        </Card>
      </RoasterTrackingLink>
    );
  }

  // Default variant - directory tile with footer
  return (
    <RoasterTrackingLink
      ariaLabel={ariaLabel}
      coffeeCount={coffeeCount || null}
      href={`/roasters/${roaster.slug}`}
      roasterOnlyId={roaster.id || null}
    >
      <Card
        className={cn(
          "group relative overflow-hidden cursor-pointer",
          "surface-1 rounded-lg card-hover",
          "h-full flex flex-col p-0"
        )}
        itemScope
        itemType="https://schema.org/Organization"
      >
        {/* Logo Container - Editorial Plate with gradient background */}
        <div className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_center,var(--muted)_0%,var(--background)_100%)] dark:bg-[radial-gradient(circle_at_center,var(--card)_0%,var(--background)_100%)] flex items-center justify-center border-b border-border/40">
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
                  src={roasterImagePresets.roasterLogo(
                    `roasters/${roaster.slug}-logo`
                  )}
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
        <div className="relative card-padding">
          <Stack gap="2">
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
                <Icon name="MapPin" size={14} color="muted" />
                <p className="text-body-muted">{hqLocation}</p>
              </div>
            )}

            {/* Coffee count */}
            <div className="flex items-center gap-1.5">
              <Icon name="Coffee" size={14} color="muted" />
              <p className="text-body-muted">
                {coffeeCount} {coffeeCount === 1 ? "coffee" : "coffees"}
              </p>
            </div>
          </Stack>
        </div>

        <meta
          content={`https://indiancoffeebeans.com/roasters/${roaster.slug}`}
          itemProp="url"
        />
      </Card>
    </RoasterTrackingLink>
  );
}
