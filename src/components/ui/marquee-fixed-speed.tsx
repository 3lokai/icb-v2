"use client";

import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

const FALLBACK_DURATION_SEC = 40;

interface MarqueeFixedSpeedProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  /** Target scroll speed in CSS pixels per second along the scroll axis. */
  fixedSpeedPxPerSecond?: number;
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
}

export function MarqueeFixedSpeed({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  fixedSpeedPxPerSecond = 40,
  minDurationSeconds = 12,
  maxDurationSeconds = 240,
  ...props
}: MarqueeFixedSpeedProps) {
  const firstTrackRef = useRef<HTMLDivElement>(null);
  const [durationSec, setDurationSec] = useState(FALLBACK_DURATION_SEC);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const updateDuration = useCallback(() => {
    const el = firstTrackRef.current;
    if (!el) return;
    const size = vertical ? el.scrollHeight : el.scrollWidth;
    if (size <= 0) return;
    const rawSec = size / fixedSpeedPxPerSecond;
    const clamped = Math.min(
      maxDurationSeconds,
      Math.max(minDurationSeconds, rawSec)
    );
    setDurationSec(clamped);
  }, [fixedSpeedPxPerSecond, vertical, minDurationSeconds, maxDurationSeconds]);

  useLayoutEffect(() => {
    const el = firstTrackRef.current;
    if (!el) return undefined;
    updateDuration();
    const ro = new ResizeObserver(() => {
      updateDuration();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateDuration]);

  return (
    <div
      {...props}
      className={cn(
        "group relative flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {new Array(repeat).fill(0).map((_, i) => (
        <div
          ref={i === 0 ? firstTrackRef : undefined}
          className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
          // eslint-disable-next-line react/no-array-index-key -- matches Marquee pattern
          key={i}
          style={
            reduceMotion
              ? { animation: "none" }
              : {
                  animationDuration: `${durationSec}s`,
                  animationDirection: reverse ? "reverse" : "normal",
                }
          }
        >
          {children}
        </div>
      ))}
    </div>
  );
}
