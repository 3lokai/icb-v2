"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { capture } from "@/lib/posthog";

/**
 * Wraps a homepage section to record whether visitors reach it and what they
 * click in it. Baseline for the experience redesign: before this, only the
 * hero's buttons were instrumented.
 *
 * - `home_section_viewed` fires once per page view, when a quarter of the
 *   section (or a quarter of the viewport, for tall sections) is on screen.
 * - `home_section_clicked` fires for any link or button inside it.
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
      // Tall sections never reach a 25% ratio on a phone, so also accept the
      // section crossing a quarter of the way up the viewport.
      { threshold: [0, 0.25], rootMargin: "0px 0px -25% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [name, position]);

  return (
    <div
      ref={ref}
      data-section={name}
      onClick={(e) => {
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
