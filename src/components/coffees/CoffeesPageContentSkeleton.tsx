import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Skeleton } from "@/components/ui/skeleton";
import { CoffeeCardSkeleton } from "@/components/cards/CoffeeCardSkeleton";

/**
 * Layout-matched skeleton for the coffees page content.
 * Mirrors CoffeeDirectory structure (heading, faceted filter bar, results line, grid)
 * inside PageShell + Section. Used as Suspense fallback and route loading UI to prevent CLS.
 */
export function CoffeesPageContentSkeleton() {
  return (
    <PageShell maxWidth="7xl">
      <Section spacing="default" contained={false}>
        {/* Section heading */}
        <Skeleton className="mb-8 h-9 w-2/3 max-w-md" />

        {/* Mobile filter button placeholder */}
        <div className="mb-4 md:hidden">
          <Skeleton className="h-10 w-full rounded-md" />
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
      </Section>
    </PageShell>
  );
}
