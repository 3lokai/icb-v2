// components/common/LoadingSpinner.tsx
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
};

export const LoadingSpinner = ({
  size = "md",
  text = "Loading...",
  className,
}: LoadingSpinnerProps) => {
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const sizeClasses = {
    sm: "size-10", // 40px - aligns with Tailwind w-10/h-10
    md: "size-16", // 64px - aligns with Tailwind w-16/h-16 (standard spacing)
    lg: "size-20", // 80px - aligns with Tailwind w-20/h-20
  };

  // Return an empty div during SSR to avoid hydration mismatch
  if (!isClient) {
    return <div className={sizeClasses[size]} />;
  }

  return (
    <div
      className={cn(
        "flex animate-fade-in-scale flex-col items-center justify-center",
        className
      )}
    >
      <div className={cn("mb-2", sizeClasses[size])}>
        <DotLottieReact
          autoplay
          loop
          speed={1.2}
          src="/animations/loading-coffee.lottie" // Slightly faster for a more engaging loading experience
          useFrameInterpolation={true} // Smoother animation
        />
      </div>
      {text && <p className="font-medium text-accent text-sm">{text}</p>}
    </div>
  );
};
