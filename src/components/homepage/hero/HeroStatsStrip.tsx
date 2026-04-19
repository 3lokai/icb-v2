"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";

const SESSION_ANIMATED_KEY = "icb_hero_stats_animated";

function AnimatedStatValue({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const [skipAnimation, setSkipAnimation] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_ANIMATED_KEY) === "1") {
        queueMicrotask(() => {
          setDisplay(value);
          setSkipAnimation(true);
        });
      }
    } catch {
      /* sessionStorage unavailable */
    }
  }, [value]);

  useEffect(() => {
    if (reduceMotion) return;
    if (skipAnimation) return;
    if (!inView) return;

    let sessionMarked = false;
    const controls = animate(0, value, {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const r = Math.round(v);
        setDisplay(r);
        if (!sessionMarked && r >= value) {
          sessionMarked = true;
          try {
            window.sessionStorage.setItem(SESSION_ANIMATED_KEY, "1");
          } catch {
            /* sessionStorage unavailable */
          }
        }
      },
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion, skipAnimation]);

  const shown = reduceMotion ? value : display;

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}

type HeroStatsStripProps = {
  totals: PublicDirectoryTotals;
};

export function HeroStatsStrip({ totals }: HeroStatsStripProps) {
  return (
    <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-4 py-6 lg:py-8">
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
      <div className="flex items-center gap-3 text-micro text-white/85 uppercase tracking-[0.2em] font-semibold">
        <span className="h-1 w-1 shrink-0 rounded-full bg-accent/60" />
        Free to use
      </div>
    </div>
  );
}
