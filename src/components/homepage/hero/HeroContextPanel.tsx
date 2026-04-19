"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import type { IconName } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { cn } from "@/lib/utils";
import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import type { HeroSegmentPayload } from "@/types/hero-segment";

const HeroSearch = dynamic(() =>
  import("./HeroSearch").then((mod) => ({ default: mod.HeroSearch }))
);

function coffeeHref(
  c: { coffeeSlug: string; roasterSlug: string },
  hash: "#reviews" | "" = "#reviews"
): string {
  if (c.coffeeSlug && c.roasterSlug) {
    return `/roasters/${c.roasterSlug}/coffees/${c.coffeeSlug}${hash}`;
  }
  return "/coffees";
}

const HERO_QUICK_CHIPS: { label: string; href: string }[] = [
  { label: "Light", href: "/coffees/light-roast" },
  { label: "Medium", href: "/coffees/medium-roast" },
  { label: "Dark", href: "/coffees/dark-roast" },
  { label: "V60", href: "/coffees/v60" },
  { label: "AeroPress", href: "/coffees/aeropress" },
  { label: "Fruity", href: "/coffees?q=fruity" },
  { label: "Under ₹500", href: "/coffees/budget" },
];

function CoffeeRowLink({
  href,
  name,
  roasterName,
  imageUrl,
  rightSlot,
}: {
  href: string;
  name: string;
  roasterName: string;
  imageUrl: string | null;
  rightSlot?: ReactNode;
}) {
  return (
    <Link
      className={cn(
        "group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-black/25 p-3.5",
        "transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-black/40 hover:shadow-lg"
      )}
      href={href}
    >
      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-white/10">
        {imageUrl ? (
          <Image
            alt={name}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            fill
            sizes="56px"
            src={imageUrl}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon className="text-white/40" name="Coffee" size={24} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-body text-white">{name}</div>
        <div className="truncate text-overline text-white/50">
          {roasterName}
        </div>
      </div>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </Link>
  );
}

/** Panel header with contextual icon */
function PanelHeader({
  icon,
  children,
}: {
  icon: IconName;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-accent/10">
        <Icon className="text-accent" name={icon} size={24} />
      </div>
      <h2 className="text-title text-white">{children}</h2>
    </div>
  );
}

/** Segmented progress dots — filled up to `count`, capped at `total` for visuals and label */
function ProgressDots({ count, total = 3 }: { count: number; total?: number }) {
  const safeCount = Math.max(0, count);
  const filled = Math.min(safeCount, total);
  return (
    <div className="flex items-center gap-4 py-1">
      <div aria-hidden="true" className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            className={cn(
              "h-2.5 w-6 rounded-full transition-all duration-500",
              i < filled
                ? "bg-accent shadow-[0_0_8px_rgba(var(--accent-rgb),0.4)]"
                : "bg-white/15"
            )}
            key={i}
          />
        ))}
      </div>
      <span className="text-caption font-medium text-white/80 tabular-nums">
        {filled} of {total} rated
      </span>
    </div>
  );
}

type HeroContextPanelProps = {
  totals: PublicDirectoryTotals;
  hero: HeroSegmentPayload;
};

export function HeroContextPanel({ totals, hero }: HeroContextPanelProps) {
  const {
    segment,
    recentlyViewed,
    ratedCoffees,
    ratingCount,
    isAuthenticated,
  } = hero;

  const panelClass =
    "w-full min-w-0 rounded-3xl border border-white/10 bg-black/45 p-7 shadow-2xl backdrop-blur-md on-media-scrim-strong";

  switch (segment) {
    case "discovery":
      return (
        <div className={panelClass}>
          <Stack gap="4">
            <HeroSearch />
            <div>
              <p className="mb-2 text-overline font-semibold uppercase tracking-wider text-white/70">
                Quick filters
              </p>
              <div className="flex flex-wrap gap-2">
                {HERO_QUICK_CHIPS.map((chip) => (
                  <Link
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-overline text-white/90 transition-colors hover:border-accent/50 hover:bg-white/10"
                    href={chip.href}
                    key={chip.label}
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
            </div>
            <p className="text-overline text-white/60">
              <span className="font-semibold text-white/80">
                {totals.coffees.toLocaleString()}
              </span>{" "}
              coffees across{" "}
              <span className="font-semibold text-white/80">
                {totals.roasters.toLocaleString()}
              </span>{" "}
              roasters
            </p>
          </Stack>
        </div>
      );

    case "returning_browser":
      return (
        <div className={panelClass}>
          <Stack gap="4">
            <PanelHeader icon="ClockCounterClockwise">
              Recently viewed
            </PanelHeader>
            {recentlyViewed.length === 0 ? (
              <p className="text-caption leading-relaxed text-white/60">
                No recent coffees yet — browse the directory and open a coffee
                page to see it here.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentlyViewed.slice(0, 3).map((c) => (
                  <CoffeeRowLink
                    href={coffeeHref(c)}
                    imageUrl={c.imageUrl}
                    key={c.coffeeId}
                    name={c.name}
                    roasterName={c.roasterName}
                  />
                ))}
              </div>
            )}
            <p className="text-caption leading-relaxed text-white/50">
              Select a coffee to add your rating and build your taste profile.
            </p>
          </Stack>
        </div>
      );

    case "rating_progress":
      return (
        <div className={panelClass}>
          <Stack gap="4">
            <PanelHeader icon="Star">Your rated coffees</PanelHeader>
            {ratingCount > 0 && ratedCoffees.length === 0 ? (
              <p className="text-caption leading-relaxed text-amber-200/80">
                Some coffees couldn&apos;t be loaded. Try again later or browse
                the directory.
              </p>
            ) : ratedCoffees.length > 0 ? (
              <div className="flex flex-col gap-3">
                {ratedCoffees.map((c) => (
                  <CoffeeRowLink
                    href={coffeeHref(c)}
                    imageUrl={c.imageUrl}
                    key={c.coffeeId}
                    name={c.name}
                    roasterName={c.roasterName}
                    rightSlot={
                      c.rating != null ? (
                        <span className="text-caption font-semibold text-accent tabular-nums">
                          {c.rating}★
                        </span>
                      ) : null
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-caption leading-relaxed text-white/60">
                You haven&apos;t rated any coffees yet — open one from the
                directory and add a rating to see it here.
              </p>
            )}
            <ProgressDots count={ratingCount} />
            {!isAuthenticated && (
              <p className="text-caption text-amber-200/60 font-medium">
                Save your progress to unlock personalized recommendations.
              </p>
            )}
          </Stack>
        </div>
      );

    case "anon_conversion":
      return (
        <div className={panelClass}>
          <Stack gap="4">
            <PanelHeader icon="Sparkle">Your journey so far</PanelHeader>
            {ratingCount > 0 && ratedCoffees.length === 0 ? (
              <p className="text-caption leading-relaxed text-amber-200/80">
                Some coffees couldn&apos;t be loaded. Try again later or open
                your ratings from the profile menu.
              </p>
            ) : ratedCoffees.length > 0 ? (
              <div className="flex flex-col gap-3">
                {ratedCoffees.map((c) => (
                  <CoffeeRowLink
                    href={coffeeHref(c)}
                    imageUrl={c.imageUrl}
                    key={c.coffeeId}
                    name={c.name}
                    roasterName={c.roasterName}
                    rightSlot={
                      c.rating != null ? (
                        <span className="text-caption font-semibold text-accent tabular-nums">
                          {c.rating}★
                        </span>
                      ) : null
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="text-caption leading-relaxed text-white/60">
                You haven&apos;t rated any coffees yet — open one from the
                directory and add a rating to see it here.
              </p>
            )}
            <ProgressDots count={ratingCount} />
            <div className="mt-4 border-t border-white/10 pt-5">
              <p className="mb-3 text-overline font-semibold uppercase tracking-wider text-accent">
                Unlock With A Profile
              </p>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-caption text-white/80">
                <li className="flex items-center gap-2">
                  <Icon
                    className="text-accent/60 shrink-0"
                    name="BookmarkSimple"
                    size={14}
                  />
                  Saved ratings
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    className="text-accent/60 shrink-0"
                    name="ChartBar"
                    size={14}
                  />
                  Taste profile
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    className="text-accent/60 shrink-0"
                    name="Compass"
                    size={14}
                  />
                  Recommendations
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    className="text-accent/60 shrink-0"
                    name="ClockClockwise"
                    size={14}
                  />
                  Full history
                </li>
              </ul>
            </div>
          </Stack>
        </div>
      );

    case "authenticated_profile":
      return (
        <div className={panelClass}>
          <Stack gap="4">
            <div className="flex flex-col gap-1.5">
              <PanelHeader icon="UserCircle">Your profile</PanelHeader>
              <ProgressDots count={ratingCount} total={10} />
            </div>

            <div className="flex flex-col gap-3">
              <p className="mb-1 text-overline font-semibold uppercase tracking-wider text-white/40">
                Recently rated
              </p>
              {ratingCount > 0 && ratedCoffees.length === 0 ? (
                <p className="text-caption leading-relaxed text-amber-200/80">
                  Some coffees couldn&apos;t be loaded. Browse the directory to
                  keep rating.
                </p>
              ) : ratedCoffees.length > 0 ? (
                ratedCoffees
                  .slice(0, 2)
                  .map((c) => (
                    <CoffeeRowLink
                      href={coffeeHref(c, "")}
                      imageUrl={c.imageUrl}
                      key={c.coffeeId}
                      name={c.name}
                      roasterName={c.roasterName}
                      rightSlot={
                        c.rating != null ? (
                          <span className="text-caption font-semibold text-accent tabular-nums">
                            {c.rating}★
                          </span>
                        ) : null
                      }
                    />
                  ))
              ) : (
                <p className="text-caption leading-relaxed text-white/60">
                  No ratings yet — rate a coffee from the directory to see it
                  here.
                </p>
              )}
            </div>
            <p className="text-caption leading-relaxed text-white/50">
              Taste insights expand with every Indian coffee you rate.
            </p>
          </Stack>
        </div>
      );

    default:
      return null;
  }
}
