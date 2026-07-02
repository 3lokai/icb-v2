// components/common/LoadingSpinner.tsx
"use client";

import { useState } from "react";
import { LottiePlayer } from "@/components/common/LottiePlayer";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
};

const sizeClasses = {
  sm: "size-10", // 40px - aligns with Tailwind w-10/h-10
  md: "size-16", // 64px - aligns with Tailwind w-16/h-16 (standard spacing)
  lg: "size-20", // 80px - aligns with Tailwind w-20/h-20
  // Responsive — scales with the viewport for full-screen loading pages
  xl: "size-28 sm:size-36 md:size-44", // 112px → 144px → 176px
};

export const LoadingSpinner = ({
  size = "md",
  text = "Loading...",
  className,
}: LoadingSpinnerProps) => {
  // The dotLottie player needs to fetch + instantiate a WASM runtime before the
  // animation can paint. Until it's ready we show a lightweight CSS fallback so
  // the loading state is never blank — especially on short-lived loading.tsx
  // screens that may unmount before the Lottie finishes loading.
  const [lottieReady, setLottieReady] = useState(false);

  return (
    <div
      className={cn(
        "flex animate-fade-in-scale flex-col items-center justify-center",
        className
      )}
    >
      <div className={cn("relative mb-2", sizeClasses[size])}>
        {/* Instant CSS fallback — visible immediately, fades out once the Lottie loads */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
            lottieReady ? "opacity-0" : "opacity-100"
          )}
          aria-hidden="true"
        >
          <div className="size-2/3 animate-spin rounded-full border-2 border-accent/25 border-t-accent" />
        </div>

        <LottiePlayer
          speed={1.2} // Slightly faster for a more engaging loading experience
          src="/animations/loading-coffee.json"
          onReady={() => setLottieReady(true)}
          className={cn(
            "transition-opacity duration-300",
            lottieReady ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
      {text && <p className="font-medium text-accent text-caption">{text}</p>}
    </div>
  );
};
