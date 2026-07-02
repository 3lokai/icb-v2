import { CoffeeCardSkeleton } from "@/components/cards/CoffeeCardSkeleton";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";

// Kept in sync with TopRatedSection.tsx's sectionSurfaceClassName.
const sectionSurfaceClassName =
  "bg-card relative overflow-hidden border-y border-border/60";

/** Suspense/dynamic fallback before TopRatedSection's JS chunk has even loaded —
 * mirrors the component's own isLoading state so there's no visual pop on mount.
 * Kept in its own file (not colocated with TopRatedSection) so statically
 * importing it for the fallback doesn't drag the heavy component + its data
 * hook into the eagerly-loaded route bundle. */
export function TopRatedSectionSkeleton() {
  return (
    <Section id="top-rated" spacing="loose" className={sectionSurfaceClassName}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-start relative z-10">
        <div className="md:col-span-5 lg:col-span-4 md:sticky md:top-32">
          <Stack gap="8">
            <Skeleton className="h-10 w-48" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
            </div>
            <Skeleton className="h-11 w-52" />
          </Stack>
        </div>
        <div className="md:col-span-7 lg:col-span-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <CoffeeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
