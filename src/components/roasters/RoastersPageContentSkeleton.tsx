import { Skeleton } from "@/components/ui/skeleton";
import { RoasterCardSkeleton } from "@/components/cards/RoasterCardSkeleton";

/**
 * Layout-matched skeleton for the roasters page content.
 * Mirrors RoasterDirectory structure (header, results line, filter bar, sidebar + grid).
 * Used as Suspense fallback and route loading UI to prevent CLS.
 */
export function RoastersPageContentSkeleton() {
  return (
    <div className="container mx-auto p-4 pt-16 md:pt-24">
      {/* Section header */}
      <div className="mb-12 space-y-6">
        <div className="inline-flex items-center gap-4">
          <Skeleton className="h-px w-8 md:w-12" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-4 max-w-md" />
      </div>

      {/* Results count - reserve one line */}
      <div className="mb-6 min-h-[1.5rem] flex items-center justify-center text-center">
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Mobile filter button placeholder */}
      <div className="mb-4 md:hidden">
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Filter bar placeholder - Quick filters row */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {/* Main area: sidebar + grid */}
      <div className="flex flex-col gap-12 md:flex-row md:gap-16">
        {/* Sidebar placeholder - hidden on mobile, w-64 on md+ */}
        <aside className="hidden w-full flex-col gap-4 md:flex md:w-64">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </aside>

        {/* Grid placeholder - same layout as RoasterGrid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RoasterCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
