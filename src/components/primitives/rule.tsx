"use client";

import { cn } from "@/lib/utils";

type RuleProps = {
  spacing?: "tight" | "default" | "loose";
  className?: string;
};

/**
 * Rule - Horizontal divider line
 * Use between sections for visual separation
 */
export function Rule({ spacing = "default", className }: RuleProps) {
  const spacingClasses = {
    tight: "my-4",
    default: "my-8",
    loose: "my-16",
  };

  return (
    <hr
      className={cn(
        "border-t border-border/60",
        spacingClasses[spacing],
        className
      )}
    />
  );
}
