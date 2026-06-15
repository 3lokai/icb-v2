"use client";

import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { Icon, type IconName } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

type ProfileGlanceStat = {
  label: string;
  value: string;
  icon: IconName;
  suffix?: string;
};

type ProfileAtAGlanceProps = {
  totalReviews: number;
  avgRating: number | null;
  distinctRoasterCount: number;
  selectionsCount: number;
  isOwner?: boolean;
  isAnonymous?: boolean;
  className?: string;
};

// Note: the persona reveal lives only in the Taste Profile hero — surfacing it
// here too would duplicate the page's biggest moment within one screen.
export function ProfileAtAGlance({
  totalReviews,
  avgRating,
  distinctRoasterCount,
  selectionsCount,
  isOwner = false,
  isAnonymous = false,
  className,
}: ProfileAtAGlanceProps) {
  const hasEnoughRatings = totalReviews >= 3;

  const glanceStats: ProfileGlanceStat[] = [
    {
      label: "Coffees Rated",
      value: String(totalReviews),
      icon: "Coffee",
    },
    {
      label: "Palate",
      value: avgRating != null ? String(avgRating) : "—",
      suffix: avgRating != null ? "★" : undefined,
      icon: "Star",
    },
    {
      label: "Roasters Tried",
      value: String(distinctRoasterCount),
      icon: "MapPin",
    },
    {
      label: "Selections",
      value: String(selectionsCount),
      icon: "Heart",
    },
  ];

  return (
    <aside
      className={cn(
        "rounded-3xl border border-border/60 bg-card p-6 shadow-sm",
        className
      )}
    >
      <Stack gap="6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-overline text-muted-foreground tracking-[0.15em]">
            AT A GLANCE
          </span>
          {isAnonymous && (
            <Icon
              name="LockKey"
              size={14}
              className="shrink-0 text-muted-foreground"
              aria-hidden
            />
          )}
        </div>

        {!hasEnoughRatings ? (
          <Stack gap="3">
            <p className="text-caption text-muted-foreground m-0 leading-relaxed">
              {isAnonymous || isOwner
                ? "Rate three coffees to unlock your palate journey and unique taste insights."
                : "Not enough public ratings yet for a taste snapshot."}
            </p>
            {(isAnonymous || isOwner) && (
              <Link
                href="/coffees"
                className="text-micro font-medium text-accent hover:underline w-fit"
              >
                Start rating
              </Link>
            )}
          </Stack>
        ) : (
          <Stack gap="4">
            <div className="grid grid-cols-2 gap-3">
              {glanceStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl bg-background px-3 py-3 group/stat transition-colors hover:bg-muted/40"
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                    <Icon name={stat.icon} size={12} className="text-accent" />
                    <p className="text-micro uppercase font-medium tracking-wider m-0">
                      {stat.label}
                    </p>
                  </div>
                  <p className="text-heading font-mono tabular-nums text-foreground m-0 leading-none flex items-baseline gap-0.5">
                    {stat.value}
                    {stat.suffix ? (
                      <span className="text-caption font-mono text-muted-foreground">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </p>
                </div>
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </aside>
  );
}
