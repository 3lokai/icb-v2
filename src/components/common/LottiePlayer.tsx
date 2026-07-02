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

// lottie-web's SVG-only "light" build (~45KB gzipped) instead of the dotLottie
// WASM runtime (~600KB) — the animations here are plain shape layers, so the
// WASM renderer bought nothing but bytes.
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

    import("lottie-web/build/player/lottie_light").then(
      ({ default: lottie }) => {
        if (cancelled || !containerRef.current) return;
        anim = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
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
