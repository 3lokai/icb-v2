import { CoffeeCardSkeleton } from "@/components/cards/CoffeeCardSkeleton";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Suspense fallback for NewArrivalsSection. Height-matched to the real section
 * (header block + a 3-column card grid) so streaming it in does not shift the
 * sections below — the same mistake called out on FreshFromCommunitySkeleton.
 *
 * Kept in its own file so importing it for the fallback does not pull the
 * section's data fetch into the eagerly-loaded route bundle.
 */
export function NewArrivalsSectionSkeleton() {
  return (
    <Section id="new-arrivals" spacing="default" ground="warm">
      <Stack gap="8">
        <div className="space-y-3">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CoffeeCardSkeleton key={i} />
          ))}
        </div>
      </Stack>
    </Section>
  );
}
