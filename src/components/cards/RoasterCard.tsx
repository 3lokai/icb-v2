"use client";
// src/components/cards/RoasterCard.tsx
import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/common/Icon";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RoasterSummary } from "@/types/roaster-types";
import { Stack } from "../primitives/stack";
import { roasterImagePresets } from "@/lib/imagekit";
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
    return "bg-primary text-primary-foreground border-border";
  }
  if (ribbon === "editors-pick") {
    return "bg-foreground text-background border-border";
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
  return parts.join(", ");
}

function formatRating(rating: number | null): string {
  if (!rating) {
    return "";
  }
  return rating.toFixed(1);
}

export default function RoasterCard({ roaster }: RoasterCardProps) {
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
  const ribbon = computeRibbon(roaster);
  const hqLocation = formatAddress(roaster);

  const initials = roaster.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <RoasterTrackingLink
      ariaLabel={`View details for ${roaster.name} roaster`}
      coffeeCount={roaster.coffee_count || null}
      href={`/roasters/${roaster.slug}`}
      roasterOnlyId={roaster.id || null}
    >
      <Card
        className={cn(
          "group relative overflow-hidden",
          "bg-card border border-border", // Solid border, no glass
          "rounded-3xl shadow-sm hover:shadow-md",
          "transition-all duration-500 hover:-translate-y-1",
          "h-full flex flex-col"
        )}
        itemScope
        itemType="https://schema.org/Organization"
      >
        {/* Magazine Accent: Subtle top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 md:h-1.5 bg-gradient-to-r from-primary/60 via-accent to-primary/40 opacity-55" />

        {/* Logo Layer: Editorial Plate */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-[radial-gradient(circle_at_center,var(--muted)_0%,var(--background)_100%)] dark:bg-[radial-gradient(circle_at_center,var(--card)_0%,var(--background)_100%)] flex items-center justify-center border-b border-border/40">
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

          {/* Logo Frame: Centered, non-cropped */}
          <div className="relative z-10 flex h-full w-full items-center justify-center p-12 transition-transform duration-500 group-hover:scale-105">
            <div className="relative flex h-full w-full items-center justify-center max-w-[70%] max-h-[55%]">
              {!hasError ? (
                <Image
                  alt={roaster.name || "Coffee roaster logo"}
                  className="object-contain"
                  fill
                  itemProp="logo"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 400px"
                  src={roasterImagePresets.roasterLogo(
                    `roasters/${roaster.slug}-logo`
                  )}
                  onError={() => setHasError(true)}
                  priority
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20">
                  <span className="text-heading font-black tracking-tighter text-accent">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Top image-integrated selector fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background/40 to-transparent opacity-80"
          />

          {/* Ribbon / selector */}
          {ribbon && (
            <div
              className={cn(
                "absolute top-3 right-3 z-20 rounded-full px-3 py-1 shadow-sm border backdrop-blur-[2px] transition-colors",
                getRibbonStyles(ribbon)
              )}
            >
              <span className="text-overline uppercase font-bold tracking-wider">
                {getRibbonLabel(ribbon)}
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
                {roaster.name}
              </CardTitle>
              {roaster.instagram_handle && (
                <div className="flex items-center gap-1.5 opacity-60">
                  <Icon name="InstagramLogo" size={12} />
                  <span className="text-caption font-medium">
                    @{roaster.instagram_handle}
                  </span>
                </div>
              )}
            </Stack>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex flex-col gap-0.5 border-l-2 border-accent/20 pl-3">
                <span className="text-overline uppercase font-bold text-muted-foreground/60">
                  HQ
                </span>
                <span className="text-caption font-medium line-clamp-1">
                  {hqLocation || "India"}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 border-l-2 border-accent/20 pl-3">
                <span className="text-overline uppercase font-bold text-muted-foreground/60">
                  Catalogue
                </span>
                <span className="text-caption font-medium line-clamp-1">
                  {roaster.coffee_count}{" "}
                  {roaster.coffee_count === 1 ? "Coffee" : "Coffees"}
                </span>
              </div>
            </div>
          </Stack>
        </div>

        {/* Reputation Floor */}
        <div className="relative mt-auto px-5 md:px-6 pb-4 md:pb-5 pt-4 border-t border-border/40">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-overline uppercase font-bold text-muted-foreground/60">
                Reputation
              </span>
              {roaster.avg_rating ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-accent/10 border border-accent/20">
                    <Icon
                      name="Star"
                      size={12}
                      className="text-accent fill-accent"
                    />
                    <span className="text-caption font-black text-accent">
                      {formatRating(roaster.avg_rating)}
                    </span>
                  </div>
                  {roaster.total_ratings_count &&
                    roaster.total_ratings_count > 0 && (
                      <span className="text-overline text-muted-foreground/60 italic">
                        ({roaster.total_ratings_count})
                      </span>
                    )}
                </div>
              ) : (
                <span className="text-caption text-muted-foreground mt-0.5 italic">
                  New Roaster
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
          content={`https://indiancoffeebeans.com/roasters/${roaster.slug}`}
          itemProp="url"
        />
      </Card>
    </RoasterTrackingLink>
  );
}
