// src/components/common/Tag.tsx

import type React from "react";
import { cn } from "../../lib/utils";

type TagVariant = "outline" | "filled" | "brown" | "muted";

type TagProps = {
  children: React.ReactNode;
  variant?: TagVariant;
  className?: string;
};

export default function Tag({
  children,
  variant = "outline",
  className,
}: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs transition-colors",
        // Variant styles based on your mockup
        variant === "outline" &&
          "border border-border/60 bg-background/80 text-foreground shadow-sm backdrop-blur-sm",
        variant === "filled" &&
          "bg-secondary/90 text-secondary-foreground shadow-sm backdrop-blur-sm",
        variant === "brown" &&
          "bg-accent/90 text-accent-foreground shadow-sm backdrop-blur-sm",
        variant === "muted" &&
          "bg-muted/80 text-muted-foreground shadow-sm backdrop-blur-sm",
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
