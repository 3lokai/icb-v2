// src/components/common/Tag.tsx

import type React from "react";
import { cn } from "../../lib/utils";

type TagVariant = "outline" | "filled" | "brown" | "muted";
type TagSize = "default" | "small" | "micro";

type TagProps = {
  children: React.ReactNode;
  variant?: TagVariant;
  size?: TagSize;
  className?: string;
};

export default function Tag({
  children,
  variant = "outline",
  size = "default",
  className,
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full transition-colors",
        // Variant styles based on your mockup
        variant === "outline" &&
          "border border-border/60 bg-background/80 text-foreground shadow-sm backdrop-blur-sm",
        variant === "filled" &&
          "bg-secondary/90 text-secondary-foreground shadow-sm backdrop-blur-sm",
        variant === "brown" &&
          "bg-accent/90 text-accent-foreground shadow-sm backdrop-blur-sm",
        variant === "muted" &&
          "bg-muted/80 text-muted-foreground shadow-sm backdrop-blur-sm",
        // Keep size typography after variant color so twMerge preserves text-overline/text-label/text-micro.
        size === "default" && "px-2.5 py-0.5 text-overline",
        size === "small" && "px-2 py-0.5 text-label",
        size === "micro" && "px-1.5 py-0.5 text-micro",
        className
      )}
    >
      {children}
    </span>
  );
}

// A component for a group of tags
export function TagList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>
  );
}
