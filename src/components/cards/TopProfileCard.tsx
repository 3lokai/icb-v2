"use client";

import Link from "next/link";
import { memo, useMemo } from "react";
import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";
import type { TopProfile } from "@/lib/data/fetch-top-coffee-reviewers";

type TopProfileCardProps = {
  profile: TopProfile;
  /** 1-based leaderboard position, shown as a quiet rank chip. */
  rank: number;
  className?: string;
};

function profileInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function locationLabel(profile: TopProfile): string | null {
  if (profile.show_location === false) return null;
  const parts = [profile.city, profile.state].filter(Boolean) as string[];
  return parts.length ? parts.join(", ") : (profile.country ?? null);
}

function humanizeMethod(method: string): string {
  return method.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function TopProfileCardComponent({
  profile,
  rank,
  className,
}: TopProfileCardProps) {
  const initials = useMemo(
    () => profileInitials(profile.full_name || profile.username),
    [profile.full_name, profile.username]
  );
  const location = useMemo(() => locationLabel(profile), [profile]);
  const methods = useMemo(
    () => (profile.preferred_brewing_methods ?? []).slice(0, 3),
    [profile.preferred_brewing_methods]
  );

  const profileHref = `/profile/${profile.username}`;

  return (
    <Link
      href={profileHref}
      aria-label={`View ${profile.full_name}'s profile`}
      className="block h-full rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card
        className={cn(
          "group relative flex h-full flex-col overflow-hidden p-0",
          "surface-1 rounded-lg card-hover",
          className
        )}
        itemScope
        itemType="https://schema.org/Person"
      >
        <CardContent className="relative z-10 flex h-full flex-1 flex-col gap-4 card-padding">
          <div className="flex items-start justify-between gap-3">
            <div className="relative">
              <Avatar className="h-14 w-14 border border-border/50 transition-transform duration-500 ease-out group-hover:scale-105">
                <AvatarImage
                  alt={`${profile.full_name} avatar`}
                  className="object-cover"
                  itemProp="image"
                  src={profile.avatar_url ?? undefined}
                />
                <AvatarFallback className="text-caption font-semibold text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Coffee badge echoing the brand mark — decorative; let clicks pass to the card link */}
              <div className="pointer-events-none absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-accent">
                <Icon
                  name="Coffee"
                  size={11}
                  aria-hidden
                  className="text-accent-foreground"
                />
              </div>
            </div>

            <span className="shrink-0 text-label tabular-nums text-muted-foreground/70">
              #{rank}
            </span>
          </div>

          <Stack gap="1">
            <h3
              className="text-heading text-balance transition-colors duration-300 group-hover:text-accent line-clamp-1"
              itemProp="name"
            >
              {profile.full_name}
            </h3>
            <p className="text-label normal-case text-muted-foreground">
              @{profile.username}
              {location ? (
                <span className="text-muted-foreground/70"> · {location}</span>
              ) : null}
            </p>
          </Stack>

          {profile.bio ? (
            <p className="text-body leading-relaxed text-muted-foreground line-clamp-2">
              {profile.bio}
            </p>
          ) : null}

          <div className="mt-auto flex flex-col gap-4 pt-2">
            {methods.length ? (
              <div className="flex flex-wrap gap-1.5">
                {methods.map((m) => (
                  <Badge
                    key={m}
                    variant="outline"
                    className="text-overline normal-case line-clamp-1"
                  >
                    {humanizeMethod(m)}
                  </Badge>
                ))}
              </div>
            ) : null}

            <div className="flex items-baseline gap-1.5 border-t border-border/40 pt-4">
              <span className="text-title tabular-nums text-foreground">
                {profile.review_count}
              </span>
              <span className="text-label text-muted-foreground">
                {profile.review_count === 1 ? "coffee rated" : "coffees rated"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export const TopProfileCard = memo(TopProfileCardComponent, (prev, next) => {
  const a = prev.profile;
  const b = next.profile;
  return (
    a.id === b.id &&
    a.username === b.username &&
    a.full_name === b.full_name &&
    a.avatar_url === b.avatar_url &&
    a.bio === b.bio &&
    a.review_count === b.review_count &&
    prev.rank === next.rank &&
    prev.className === next.className
  );
});
TopProfileCard.displayName = "TopProfileCard";
