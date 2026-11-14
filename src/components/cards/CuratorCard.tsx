// src/components/cards/CuratorCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
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

  // No invented fallback: a curator with no picks shows no picks.
  const picks = curator.recentPicks ?? [];

  const initials = useMemo(() => curatorInitials(curator.name), [curator.name]);

  const profileHref = `/curations/${curator.slug}`;
  const ariaLabel = `View curator profile for ${curator.name}`;
  const canonicalUrl = `https://www.indiancoffeebeans.com${profileHref}`;

  return (
    <Link
      aria-label={ariaLabel}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
        <CardContent className="relative z-10 flex h-full flex-1 flex-col gap-6 card-padding">
          <div className="flex items-start justify-between gap-3">
            <div className="relative overflow-hidden rounded border border-border p-0.5">
              <div className="relative h-14 w-14 overflow-hidden rounded-sm">
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
              className="text-heading text-balance line-clamp-2 underline-offset-4 group-hover:underline"
              itemProp="name"
            >
              {curator.name}
            </h3>
            <p className="text-ui-meta">{curator.location}</p>
          </Stack>

          {quoteText ? (
            <p className="font-serif text-body italic leading-snug line-clamp-3">
              &quot;{quoteText}&quot;
            </p>
          ) : null}

          <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
            {picks.length > 0 && (
              <>
                <p className="text-ui-meta">Curator picks</p>
                <div className="flex flex-wrap gap-2">
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
              </>
            )}
            {/* The whole card is the link; this is its label, not a second button. */}
            <span className="flex items-center gap-1 text-ui-label">
              View selections
              <Icon icon={ArrowRightIcon} size={16} />
            </span>
          </div>
        </CardContent>

        <meta content={canonicalUrl} itemProp="url" />
      </Card>
    </Link>
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
