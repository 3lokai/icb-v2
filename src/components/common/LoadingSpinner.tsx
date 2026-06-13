// components/common/LoadingSpinner.tsx
"use client";

import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import { useState } from "react";
import "@/lib/lottie"; // side effect: point dotLottie at the self-hosted WASM
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
};

const sizeClasses = {
  sm: "size-10", // 40px - aligns with Tailwind w-10/h-10
  md: "size-16", // 64px - aligns with Tailwind w-16/h-16 (standard spacing)
  lg: "size-20", // 80px - aligns with Tailwind w-20/h-20
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

  const handleRef = (dotLottie: DotLottie | null) => {
    if (!dotLottie) return;
    dotLottie.addEventListener("load", () => setLottieReady(true));
  };

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

        <DotLottieReact
          autoplay
          loop
          speed={1.2}
          src="/animations/loading-coffee.lottie" // Slightly faster for a more engaging loading experience
          useFrameInterpolation={true} // Smoother animation
          dotLottieRefCallback={handleRef}
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
