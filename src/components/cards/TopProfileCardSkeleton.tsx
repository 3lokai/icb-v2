import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Stack } from "@/components/primitives/stack";

/**
 * Skeleton loading state for TopProfileCard.
 * Matches avatar + rank + name/username + badge row + stat-footer structure.
 */
export function TopProfileCardSkeleton() {
  return (
    <Card className="surface-1 rounded-lg h-full flex flex-col p-0">
      <CardContent className="flex h-full flex-1 flex-col gap-4 card-padding">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-14 w-14 rounded-full" />
          <Skeleton className="h-4 w-6" />
        </div>

        <Stack gap="1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </Stack>

        <div className="mt-auto flex flex-col gap-4 pt-2">
          <div className="flex gap-1.5">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="border-t border-border/40 pt-4">
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
