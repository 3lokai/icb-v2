// src/components/cards/CoffeeCardSkeleton.tsx
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Stack } from "../primitives/stack";

type CoffeeCardSkeletonProps = {
  variant?: "hero" | "default" | "compact";
};

/**
 * Skeleton loading states for CoffeeCard variants
 * Matches the structure and dimensions of the actual card
 */
export function CoffeeCardSkeleton({
  variant = "default",
}: CoffeeCardSkeletonProps) {
  // Hero variant skeleton
  if (variant === "hero") {
    return (
      <Card className="surface-1 rounded-lg overflow-hidden h-full flex flex-col p-0">
        {/* Hero image skeleton - 4:3 */}
        <Skeleton className="aspect-[4/3] w-full" />

        {/* Content skeleton */}
        <div className="flex-1 card-padding">
          <Stack gap="3">
            {/* Title */}
            <Skeleton className="h-8 w-3/4" />
            {/* Roaster */}
            <Skeleton className="h-4 w-1/2" />
            {/* Metadata - inline */}
            <Skeleton className="h-4 w-2/3" />
            {/* Price */}
            <Skeleton className="h-3 w-32 mt-auto pt-2" />
          </Stack>
        </div>

        {/* Bottom rating zone skeleton - horizontal layout */}
        <div className="mt-auto border-t border-border/40 bg-muted/20">
          <div className="flex flex-row items-center justify-between card-padding-compact">
            {/* Left: Rating number block */}
            <div className="flex flex-col gap-1">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
            {/* Right: Action block */}
            <div className="flex flex-col items-end gap-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Compact variant skeleton
  if (variant === "compact") {
    return (
      <Card className="surface-1 rounded-lg overflow-hidden flex flex-row items-center gap-3 card-padding-compact h-[80px] p-0">
        {/* Small image */}
        <Skeleton className="w-16 h-16 shrink-0 rounded self-center" />

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <Stack gap="1">
            {/* Stars (only if rating exists) */}
            <Skeleton className="h-3 w-20" />
            {/* Name */}
            <Skeleton className="h-4 w-full" />
            {/* Roaster */}
            <Skeleton className="h-3 w-2/3" />
          </Stack>
        </div>
      </Card>
    );
  }

  // Default variant skeleton
  return (
    <Card className="surface-1 rounded-lg overflow-hidden h-full flex flex-col p-0">
      {/* Image skeleton - 3:2 */}
      <Skeleton className="aspect-[3/2] w-full" />

      {/* Content skeleton - strict hierarchy */}
      <div className="flex-1 card-padding-compact">
        <Stack gap="2">
          {/* 1. Stars (even if empty) */}
          <Skeleton className="h-4 w-24" />
          {/* 2. Title */}
          <Skeleton className="h-6 w-4/5" />
          {/* 3. Roaster */}
          <Skeleton className="h-4 w-1/2" />
          {/* 4. Metadata - inline */}
          <Skeleton className="h-4 w-2/3" />
          {/* 5. Price */}
          <Skeleton className="h-3 w-32 mt-auto pt-2" />
        </Stack>
      </div>

      {/* Rating zone skeleton - horizontal layout */}
      <div className="mt-auto border-t border-border/40 bg-muted/20">
        <div className="flex flex-row items-center justify-between card-padding-compact">
          {/* Left: Rating number block */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-3 w-16" />
          </div>
          {/* Right: Action block */}
          <div className="flex flex-col items-end gap-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}
