"use client";

import { Suspense } from "react";
import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import type { HeroSegmentPayload } from "@/types/hero-segment";
import { HeroContextPanel } from "./HeroContextPanel";
import { HeroCTAs } from "./HeroCTAs";
import { HeroPrimaryEyebrow, HeroPrimaryHeadline } from "./HeroPrimaryCopy";
import { HeroSegmentDevToggle } from "./HeroSegmentDevToggle";
import { HeroStatsStrip } from "./HeroStatsStrip";
import { HeroVideoBackground } from "./HeroVideoBackground";
import { Separator } from "@/components/ui/separator";

type HeroControlProps = {
  totals: PublicDirectoryTotals;
  hero: HeroSegmentPayload;
};

export function HeroControl({ totals, hero }: HeroControlProps) {
  return (
    <section className="relative flex min-h-[90dvh] items-center justify-start overflow-x-hidden pb-24 pt-16 px-4 md:px-6 lg:px-8">
      <HeroVideoBackground />

      <div className="absolute inset-0 z-0 bg-gradient-to-l from-black/80 via-black/40 to-black/60" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.3)_0%,transparent_70%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-y-6 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0 xl:gap-x-8">
          <div className="order-1 min-w-0 lg:col-start-1 lg:row-start-1">
            <HeroPrimaryEyebrow hero={hero} />
          </div>

          <div className="order-2 min-w-0 lg:col-start-1 lg:row-start-2">
            <HeroPrimaryHeadline hero={hero} />
          </div>

          <div className="order-4 min-w-0 animate-fade-in-scale delay-200 lg:order-none lg:col-start-2 lg:row-start-2 lg:self-start">
            <HeroContextPanel hero={hero} totals={totals} />
          </div>

          <div className="order-3 flex min-w-0 flex-col lg:col-start-1 lg:row-start-3 lg:mt-4">
            <HeroCTAs hero={hero} />
          </div>

          <div className="order-5 mt-12 lg:col-span-2 lg:row-start-4 lg:mt-16">
            <Separator className="opacity-10" />
            <HeroStatsStrip totals={totals} />
            <Separator className="opacity-10" />
          </div>
        </div>

        {process.env.NODE_ENV === "development" ? (
          <Suspense fallback={null}>
            <HeroSegmentDevToggle
              activeSegment={hero.segment}
              devPreview={hero.devSegmentPreview}
            />
          </Suspense>
        ) : null}
      </div>
    </section>
  );
}
