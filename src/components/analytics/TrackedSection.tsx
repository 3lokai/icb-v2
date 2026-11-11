"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { capture } from "@/lib/posthog";

const VIEW_THRESHOLDS = Array.from({ length: 101 }, (_, i) => i / 100);

/**
 * Wraps a homepage section to record whether visitors reach it and what they
 * click in it. Baseline for the experience redesign: before this, only the
 * hero's buttons were instrumented.
 *
 * - `home_section_viewed` fires once per page view, when at least a quarter of
 *   the viewport's height (or the whole section, if it is shorter) is on
 *   screen, whichever direction the visitor scrolls from.
 * - `home_section_clicked` fires for any link or button inside it, including
 *   ones that stop propagation (WishlistButton), hence the capture phase.
 */
export function TrackedSection({
  name,
  position,
  children,
}: {
  name: string;
  position: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        // Measure visible pixels against the viewport height. A single ratio
        // threshold can't express this (a section four screens tall never
        // reaches 25%), and rootMargin percentages resolve against the
        // viewport's width, so on wide windows they collapse the area.
        const needed = Math.min(
          entry.boundingClientRect.height,
          window.innerHeight * 0.25
        );
        if (entry.intersectionRect.height < needed - 1) return;
        capture("home_section_viewed", { section: name, position });
        observer.disconnect();
      },
      // Steps of 1% so the callback re-runs as more of the section shows.
      { threshold: VIEW_THRESHOLDS }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [name, position]);

  return (
    <div
      ref={ref}
      data-section={name}
      onClickCapture={(e) => {
        const target = (e.target as HTMLElement).closest("a, button");
        if (!target) return;
        capture("home_section_clicked", {
          section: name,
          position,
          href: target.getAttribute("href") ?? undefined,
          label: target.textContent?.trim().slice(0, 80) || undefined,
        });
      }}
    >
      {children}
    </div>
  );
}
