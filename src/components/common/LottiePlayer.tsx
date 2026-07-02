"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type LottiePlayerProps = {
  src: string;
  loop?: boolean;
  speed?: number;
  className?: string;
  onReady?: () => void;
};

// lottie-web's canvas "light" build instead of the dotLottie WASM runtime
// (~600KB). Canvas renderer, not SVG: the homepage can mount a dozen of these
// concurrently as Suspense fallbacks, and SVG's per-frame DOM churn across
// that many instances blew up main-thread time; canvas draws are cheap even
// with many instances animating at once.
export function LottiePlayer({
  src,
  loop = true,
  speed = 1,
  className,
  onReady,
}: LottiePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: import("lottie-web").AnimationItem | null = null;
    let cancelled = false;

    import("lottie-web/build/player/lottie_light_canvas").then(
      ({ default: lottie }) => {
        if (cancelled || !containerRef.current) return;
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "canvas",
          loop,
          autoplay: true,
          path: src,
        });
        anim.setSpeed(speed);
        anim.addEventListener("DOMLoaded", () => onReady?.());
      }
    );

    return () => {
      cancelled = true;
      anim?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- rebuild only when src changes
  }, [src]);

  return <div ref={containerRef} className={cn("size-full", className)} />;
}
