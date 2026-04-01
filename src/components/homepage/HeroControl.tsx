"use client";

import dynamic from "next/dynamic";
import { Stack } from "@/components/primitives/stack";
import { HeroHeading } from "./HeroHeading";
import { HeroVideoBackground } from "./HeroVideoBackground";
import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";

const HeroSearch = dynamic(() =>
  import("./HeroSearch").then((mod) => ({ default: mod.HeroSearch }))
);

const HeroCTAs = dynamic(() =>
  import("./HeroCTAs").then((mod) => ({ default: mod.HeroCTAs }))
);

type HeroControlProps = {
  totals: PublicDirectoryTotals;
};

export function HeroControl({ totals }: HeroControlProps) {
  return (
    <section className="relative flex min-h-[90dvh] items-center justify-start overflow-x-hidden pb-24 pt-16 px-6 sm:px-12 md:px-24">
      <HeroVideoBackground />

      <div className="absolute inset-0 z-0 bg-gradient-to-l from-black/80 via-black/40 to-black/60" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.3)_0%,transparent_70%)]" />

      <div className="hero-content relative z-10 w-full max-w-2xl text-left">
        <Stack gap="8">
          <HeroHeading />
          <HeroSearch />
          <HeroCTAs heroVariant="control" totals={totals} />
        </Stack>
      </div>
    </section>
  );
}
