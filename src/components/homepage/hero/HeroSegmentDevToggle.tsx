"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { HeroSegment } from "@/types/hero-segment";
import { HERO_SEGMENT_OPTIONS } from "@/types/hero-segment";

type HeroSegmentDevToggleProps = {
  activeSegment: HeroSegment;
  devPreview?: HeroSegment;
};

/**
 * Development only: switch `?heroSegment=` to preview hero states. Rendered at bottom of hero.
 */
export function HeroSegmentDevToggle({
  activeSegment,
  devPreview,
}: HeroSegmentDevToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const setSegment = (seg: HeroSegment | "live") => {
    const p = new URLSearchParams(searchParams.toString());
    if (seg === "live") {
      p.delete("heroSegment");
    } else {
      p.set("heroSegment", seg);
    }
    const qs = p.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  };

  const querySeg = searchParams.get("heroSegment");
  const hasOverride = querySeg != null && querySeg !== "" && devPreview != null;

  return (
    <div
      className="mt-10 w-full max-w-7xl rounded-lg border border-amber-500/35 bg-amber-950/50 px-4 py-3 text-left shadow-sm backdrop-blur-sm"
      data-testid="hero-segment-dev-toggle"
    >
      <p className="mb-2 font-semibold text-amber-200 text-overline uppercase tracking-wider">
        Dev: hero segment preview
      </p>
      {hasOverride ? (
        <p className="mb-3 text-caption text-amber-100/90">
          URL override active — showing &quot;{devPreview}&quot; (real segment
          was resolved, then replaced for UI).
        </p>
      ) : (
        <p className="mb-3 text-caption text-amber-100/80">
          Add{" "}
          <code className="rounded bg-black/30 px-1">
            ?heroSegment=discovery
          </code>{" "}
          or use the buttons below.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          className={cn(
            "rounded-md border px-3 py-1.5 text-caption transition-colors",
            !searchParams.get("heroSegment")
              ? "border-amber-400 bg-amber-500/20 text-amber-50"
              : "border-white/20 bg-black/20 text-white/90 hover:bg-black/30"
          )}
          onClick={() => setSegment("live")}
          type="button"
        >
          Live (no override)
        </button>
        {HERO_SEGMENT_OPTIONS.map(({ value, label }) => (
          <button
            className={cn(
              "rounded-md border px-3 py-1.5 text-caption transition-colors",
              querySeg === value
                ? "border-amber-400 bg-amber-500/20 text-amber-50"
                : "border-white/20 bg-black/20 text-white/90 hover:bg-black/30"
            )}
            key={value}
            onClick={() => setSegment(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-micro text-amber-200/70">
        Segment: <span className="font-mono">{activeSegment}</span>
        {devPreview ? (
          <>
            {" "}
            · preview: <span className="font-mono">{devPreview}</span>
          </>
        ) : null}
      </p>
    </div>
  );
}
