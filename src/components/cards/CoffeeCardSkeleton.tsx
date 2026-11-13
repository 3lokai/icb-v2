// src/components/cards/CoffeeCardSkeleton.tsx
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Stack } from "../primitives/stack";

type CoffeeCardSkeletonProps = {
  variant?: "hero" | "default" | "compact" | "similar";
};

/**
 * Skeleton loading states for CoffeeCard variants
 * Matches the structure and dimensions of the actual card
 */
export function CoffeeCardSkeleton({
  variant = "default",
}: CoffeeCardSkeletonProps) {
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

  // Hero, default and similar mirror CoffeeCard: framed tile, then text lines and the rating row.
  const aspect =
    variant === "hero"
      ? "aspect-square"
      : variant === "similar"
        ? "aspect-[3/4]"
        : "aspect-[4/5]";

  return (
    <div
      className={
        variant === "hero"
          ? "mx-auto flex h-full w-full max-w-[420px] flex-col"
          : variant === "default"
            ? "flex h-full w-full max-w-[300px] flex-col"
            : "flex h-full w-full flex-col"
      }
    >
      <Skeleton className={`${aspect} w-full rounded-xl`} />
      <Stack gap="2" className="mt-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        {variant !== "similar" && <Skeleton className="h-5 w-5/6" />}
        <Skeleton className="h-4 w-full" />
      </Stack>
      <div className="mt-2 flex min-h-11 items-center justify-between border-t border-border/40">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
