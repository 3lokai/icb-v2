"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import { capture } from "@/lib/posthog";
import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import { useSearchContext } from "@/providers/SearchProvider";

function AnimatedStatValue({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    if (!inView) return;

    const controls = animate(0, value, {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  const shown = reduceMotion ? value : display;

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}

export function HeroCTAs({ totals }: { totals: PublicDirectoryTotals }) {
  const { openSearch } = useSearchContext();

  return (
    <Stack
      gap="8"
      className="animate-fade-in-scale delay-300 w-full items-center"
    >
      <div className="flex flex-col gap-2 items-center">
        <Cluster gap="4" align="center" className="justify-center">
          {/* Primary CTA - Start rating coffees */}
          <Button
            onClick={() => {
              capture("hero_cta_clicked", {
                cta_label: "Start rating coffees",
              });
              openSearch(undefined, true);
            }}
            className="hover-lift px-8"
            variant="default"
            size="lg"
          >
            <Icon className="mr-2" name="Coffee" size={18} />
            Start rating coffees
          </Button>

          {/* Secondary CTA - Explore coffees */}
          <Button
            asChild
            className="hover-lift px-8 whitespace-nowrap"
            variant="secondary"
            size="lg"
          >
            <Link
              href="/coffees"
              onClick={() =>
                capture("hero_cta_clicked", {
                  cta_label: "Explore coffees",
                })
              }
            >
              Explore coffees
            </Link>
          </Button>
        </Cluster>
        {/* Footnote for both buttons */}
        <p className="text-micro text-white/60 text-center">
          No sign-up required
        </p>
      </div>

      {/* Editorial Footer */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4">
        <div className="flex items-center gap-3 text-micro text-white/85 uppercase tracking-[0.2em] font-semibold">
          <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
          <span>
            <AnimatedStatValue value={totals.coffees} /> coffees listed
          </span>
        </div>
        <div className="flex items-center gap-3 text-micro text-white/85 uppercase tracking-[0.2em] font-semibold">
          <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
          <span>
            <AnimatedStatValue value={totals.roasters} /> Indian roasters
          </span>
        </div>
        <div className="flex items-center gap-3 text-micro text-white/85 uppercase tracking-[0.2em] font-semibold">
          <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
          Community-driven, not sponsored
        </div>
      </div>
    </Stack>
  );
}
