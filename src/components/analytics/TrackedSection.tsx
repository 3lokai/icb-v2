"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { capture } from "@/lib/posthog";

/**
 * Wraps a homepage section to record whether visitors reach it and what they
 * click in it. Baseline for the experience redesign: before this, only the
 * hero's buttons were instrumented.
 *
 * - `home_section_viewed` fires once per page view, when the section reaches
 *   the middle half of the viewport. That means at least a quarter of the
 *   viewport's height (or the whole section, if it is shorter) is on screen,
 *   whichever direction the visitor scrolls from.
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
        capture("home_section_viewed", { section: name, position });
        observer.disconnect();
      },
      // Shrink the viewport to its middle half. A ratio threshold would never
      // fire for sections taller than four screens on a phone; this measures
      // exposure against the viewport instead, and shrinking both edges stops
      // a section scrolled into view from above counting on its last pixels.
      { threshold: 0, rootMargin: "-25% 0px -25% 0px" }
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
