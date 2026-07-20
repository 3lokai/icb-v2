"use client";

import { useEffect, useState } from "react";

/**
 * True once the window has scrolled past `threshold` px. Replaces motion's
 * useScroll/useMotionValueEvent for the navbar compaction — a passive scroll
 * listener keeps motion/react out of the global (every-page) bundle.
 */
export function useScrolledPast(threshold: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold);
    onScroll(); // sync on mount (e.g. restored scroll position)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return past;
}
