// src/components/cards/CuratorCard.tsx
"use client";

import Image from "next/image";
import { memo, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CuratorTrackingLink } from "@/components/common/TrackingLink";
import { Stack } from "../primitives/stack";
import { cn } from "@/lib/utils";
import type { Curator } from "@/components/curations/types";

type CuratorCardProps = {
  curator: Curator;
  className?: string;
};

function curatorInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * CuratorCard — directory tile for Curations Hub (logo + type header row, CoffeeCard chip tokens).
 */
function CuratorCardComponent({ curator, className }: CuratorCardProps) {
  const [logoError, setLogoError] = useState(false);

  const quoteText = useMemo(() => {
    const q = curator.quote?.trim();
    if (q) return q;
    const p = curator.philosophy?.trim();
    if (p) return p;
    const s = curator.story?.trim();
    if (s) return s;
    return null;
  }, [curator.quote, curator.philosophy, curator.story]);

  const picks = useMemo(
    () =>
      curator.recentPicks?.length
        ? curator.recentPicks
        : ["Heritage Blend", "Single Origin"],
    [curator.recentPicks]
  );

  const initials = useMemo(() => curatorInitials(curator.name), [curator.name]);

  const profileHref = `/curations/${curator.slug}`;
  const ariaLabel = `View curator profile for ${curator.name}`;
  const canonicalUrl = `https://www.indiancoffeebeans.com${profileHref}`;

  return (
    <CuratorTrackingLink
      ariaLabel={ariaLabel}
      curatorId={curator.id}
      href={profileHref}
    >
      <Card
        className={cn(
          "group relative flex h-full flex-col overflow-hidden",
          "surface-1 rounded-lg card-hover",
          "p-0",
          className
        )}
        itemScope
        itemType="https://schema.org/Person"
      >
        <div className="bg-noise pointer-events-none absolute inset-0 z-0 opacity-[0.03]" />

        <CardContent className="relative z-10 flex h-full flex-1 flex-col gap-5 card-padding">
          <div className="flex items-start justify-between gap-3">
            <div className="relative overflow-hidden rounded border border-border/40 p-0.5 shadow-sm transition-colors duration-500 group-hover:border-accent/40">
              <div className="relative h-14 w-14 overflow-hidden rounded-sm grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0">
                {!logoError ? (
                  <Image
                    alt={`${curator.name} logo`}
                    className="object-cover"
                    fill
                    itemProp="image"
                    sizes="56px"
                    src={curator.logo}
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div
                    aria-hidden
                    className="flex h-full w-full items-center justify-center bg-muted text-caption font-semibold text-muted-foreground"
                  >
                    {initials}
                  </div>
                )}
              </div>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 text-overline capitalize"
            >
              {curator.curatorType}
            </Badge>
          </div>

          <Stack gap="2">
            <h3
              className="text-heading transition-colors duration-300 group-hover:text-accent text-balance line-clamp-2"
              itemProp="name"
            >
              {curator.name}
            </h3>
            <p className="text-label font-bold uppercase">{curator.location}</p>
          </Stack>

          {quoteText ? (
            <p className="text-body font-serif italic leading-relaxed text-muted-foreground line-clamp-3">
              &quot;{quoteText}&quot;
            </p>
          ) : null}

          <div className="mt-auto pt-4">
            <Stack gap="4">
              <div className="flex items-center justify-between border-t border-border/10 pt-5">
                <span className="text-micro font-bold uppercase tracking-widest text-muted-foreground/60">
                  EDITORIAL PICKS
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {picks.map((pick, i) => (
                  <Badge
                    key={`${pick}-${i}`}
                    variant="outline"
                    className="max-w-full text-overline line-clamp-1 normal-case"
                  >
                    {pick}
                  </Badge>
                ))}
              </div>

              <span
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full text-xs font-medium shadow-sm transition-all duration-500",
                  "group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                )}
              >
                View Curator
              </span>
            </Stack>
          </div>
        </CardContent>

        <meta content={canonicalUrl} itemProp="url" />
      </Card>
    </CuratorTrackingLink>
  );
}

export const CuratorCard = memo(CuratorCardComponent, (prev, next) => {
  const a = prev.curator;
  const b = next.curator;
  return (
    a.id === b.id &&
    a.slug === b.slug &&
    a.name === b.name &&
    a.logo === b.logo &&
    a.location === b.location &&
    a.curatorType === b.curatorType &&
    a.quote === b.quote &&
    a.philosophy === b.philosophy &&
    a.story === b.story &&
    JSON.stringify(a.recentPicks) === JSON.stringify(b.recentPicks) &&
    prev.className === next.className
  );
});
CuratorCard.displayName = "CuratorCard";
