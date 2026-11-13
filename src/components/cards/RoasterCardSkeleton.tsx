import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton for RoasterCard (default variant): 4:3 tile, name, meta line, 44px rating row. */
export function RoasterCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <Skeleton className="mt-4 h-6 w-4/5" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <div className="mt-2 flex min-h-11 items-center justify-between border-t border-border/40">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
}
