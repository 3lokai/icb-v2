"use client";

import { cn } from "@/lib/utils";

type StackProps = {
  children: React.ReactNode;
  gap?: "1" | "2" | "3" | "4" | "6" | "8" | "12" | "16";
  className?: string;
};

/**
 * Stack - Vertical layout with consistent gap spacing
 * Use for stacking elements with uniform spacing
 */
export function Stack({ children, gap = "4", className }: StackProps) {
  const gapClasses = {
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
    "12": "gap-12",
    "16": "gap-16",
  };

  return (
    <div className={cn("flex flex-col", gapClasses[gap], className)}>
      {children}
    </div>
  );
}
