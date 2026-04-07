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
  tier: number;
  persona: string;
  isOwner?: boolean;
  isAnonymous?: boolean;
  className?: string;
};

export function ProfileAtAGlance({
  totalReviews,
  avgRating,
  distinctRoasterCount,
  selectionsCount,
  tier,
  persona,
  isOwner = false,
  isAnonymous = false,
  className,
}: ProfileAtAGlanceProps) {
  const hasEnoughRatings = totalReviews >= 3;

  const glanceStats: ProfileGlanceStat[] = [
    {
      label: "Library",
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
      label: "Reach",
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
        "rounded-3xl border border-border/20 bg-background/60 backdrop-blur-md p-6 shadow-sm",
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
              className="shrink-0 text-muted-foreground/50"
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
                  className="rounded-2xl border border-border/10 bg-muted/20 px-3 py-3 group/stat transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-1.5 opacity-50 group-hover/stat:opacity-80 transition-opacity mb-1">
                    <Icon name={stat.icon} size={10} className="text-accent" />
                    <p className="text-micro uppercase font-medium tracking-wider m-0">
                      {stat.label}
                    </p>
                  </div>
                  <p className="text-heading font-mono tabular-nums text-foreground m-0 leading-none flex items-baseline gap-0.5">
                    {stat.value}
                    {stat.suffix ? (
                      <span className="text-caption font-mono opacity-60">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </p>
                </div>
              ))}
            </div>

            {tier === 3 && (
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 relative overflow-hidden group/persona">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    name="Sparkle"
                    size={14}
                    className="text-accent animate-pulse"
                  />
                  <span className="text-micro uppercase font-medium tracking-wider text-muted-foreground/60">
                    PERSONA
                  </span>
                </div>
                <p className="text-title italic text-accent m-0 leading-tight">
                  {persona}
                </p>
              </div>
            )}
          </Stack>
        )}
      </Stack>
    </aside>
  );
}
