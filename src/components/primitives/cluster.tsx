"use client";

import { cn } from "@/lib/utils";

type ClusterProps = {
  children: React.ReactNode;
  gap?: "1" | "2" | "3" | "4" | "6" | "8";
  align?: "start" | "center" | "end";
  className?: string;
};

/**
 * Cluster - Horizontal layout with wrapping
 * Use for tags, chips, inline buttons
 */
export function Cluster({
  children,
  gap = "2",
  align = "start",
  className,
}: ClusterProps) {
  const gapClasses = {
    "1": "gap-1",
    "2": "gap-2",
    "3": "gap-3",
    "4": "gap-4",
    "6": "gap-6",
    "8": "gap-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  return (
    <div
      className={cn(
        "flex flex-wrap",
        gapClasses[gap],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}
