import { Section } from "@/components/primitives/section";
import { Skeleton } from "@/components/ui/skeleton";
import { CoffeeCardSkeleton } from "@/components/cards/CoffeeCardSkeleton";

/**
 * Layout-matched skeleton for the coffees page content.
 * Mirrors CollectionGrid + CoffeeDirectory structure and approximate height.
 * Used as Suspense fallback and route loading UI to prevent CLS.
 */
export function CoffeesPageContentSkeleton() {
  return (
    <>
      {/* CollectionGrid-shaped placeholder: same Section + grid as real content */}
      <Section spacing="default">
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-4">
                <Skeleton className="h-px w-8 md:w-12" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-10 w-3/4 max-w-md" />
              <Skeleton className="h-4 w-full max-w-2xl" />
            </div>
            <div className="md:col-span-4 flex justify-start md:justify-end pb-2">
              <Skeleton className="h-10 w-[140px]" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="aspect-square w-full max-w-[200px] rounded-lg"
            />
          ))}
        </div>
      </Section>

      {/* CoffeeDirectory-shaped placeholder: container, header, filter bar, results line, grid */}
      <div className="container mx-auto p-4 pt-16 md:pt-24">
        <div className="mb-12 space-y-6">
          <div className="inline-flex items-center gap-4">
            <Skeleton className="h-px w-8 md:w-12" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-10 w-2/3 max-w-md" />
          <Skeleton className="h-4 max-w-md" />
        </div>

        {/* Filter bar placeholder - fixed height to avoid shift when real bar hydrates */}
        <div className="w-full rounded-xl border border-border/60 bg-card p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-full sm:flex-1" />
            <Skeleton className="h-10 w-full sm:w-[180px]" />
          </div>
          <div className="mt-6 hidden grid-cols-1 gap-4 md:grid md:grid-cols-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Results count - reserve one line */}
        <div className="mt-6 min-h-[1.5rem] flex items-center justify-center">
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Coffee grid skeletons - same layout as CoffeeGrid */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CoffeeCardSkeleton key={i} variant="default" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
