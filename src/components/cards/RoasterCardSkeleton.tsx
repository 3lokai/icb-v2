import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Stack } from "@/components/primitives/stack";

/**
 * Skeleton loading state for RoasterCard (default variant).
 * Matches logo area + content structure for stable layout during load.
 */
export function RoasterCardSkeleton() {
  return (
    <Card className="surface-1 rounded-lg overflow-hidden h-full flex flex-col p-0">
      {/* Logo area - fixed height to match RoasterCard (p-8 + h-20 content) */}
      <div className="relative w-full overflow-hidden border-b border-border/40 min-h-[140px] flex items-center justify-center">
        <Skeleton className="h-20 w-20 rounded-full" />
      </div>

      {/* Content - card-padding + title + metadata */}
      <div className="flex-1 card-padding">
        <Stack gap="2">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </Stack>
      </div>

      {/* Rating zone skeleton - matches CardRatingFooter (no CLS) */}
      <div className="mt-auto border-t border-border/40 bg-muted/20">
        <div className="flex flex-row items-center justify-between px-3 py-2 md:px-4 md:py-2.5">
          {/* Left: Rating inline block */}
          <Skeleton className="h-6 w-20" />
          {/* Right: Action block */}
          <div className="flex flex-col items-end gap-0.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </Card>
  );
}
