"use client";

import { useFeatureFlagVariantKey } from "posthog-js/react";
import { HeroControl } from "./HeroControl";
import { HeroDiscovery } from "./HeroDiscovery";
import { HeroSkeleton } from "./HeroSkeleton";
import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";

const FLAG_KEY = "hero-discovery-variant";

function getDevHeroVariantOverride(): "discovery" | "control" | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;
  const o = process.env.NEXT_PUBLIC_HERO_VARIANT_OVERRIDE;
  if (o === "discovery" || o === "control") return o;
  return undefined;
}

type HeroSectionClientProps = {
  totals: PublicDirectoryTotals;
};

export function HeroSectionClient({ totals }: HeroSectionClientProps) {
  const devOverride = getDevHeroVariantOverride();
  const flagVariant = useFeatureFlagVariantKey(FLAG_KEY);
  const variant = devOverride ?? flagVariant;

  if (variant === undefined) {
    return <HeroSkeleton />;
  }

  if (variant === "discovery") {
    return <HeroDiscovery totals={totals} />;
  }

  return <HeroControl totals={totals} />;
}
