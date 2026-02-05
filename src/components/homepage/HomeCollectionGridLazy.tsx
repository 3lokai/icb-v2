"use client";

import { useRef, useState, useEffect } from "react";
import { HomeCollectionGridStatic } from "./HomeCollectionGridStatic";
import type { HomeCollectionGridProps } from "./homeCollectionGridShared";

const MOTION_LOAD_ROOT_MARGIN = "150px";

// Renders static placeholder until section is near viewport, then lazy-loads Motion and the parallax grid.
// Keeps Motion out of the initial bundle when this section is below the fold.
export function HomeCollectionGridLazy(props: HomeCollectionGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [MotionGrid, setMotionGrid] =
    useState<React.ComponentType<HomeCollectionGridProps> | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        import("./HomeCollectionGrid").then((mod) => {
          setMotionGrid(() => mod.HomeCollectionGrid);
        });
      },
      { rootMargin: MOTION_LOAD_ROOT_MARGIN, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (MotionGrid) {
    return <MotionGrid {...props} />;
  }

  return (
    <div ref={sentinelRef}>
      <HomeCollectionGridStatic {...props} />
    </div>
  );
}
