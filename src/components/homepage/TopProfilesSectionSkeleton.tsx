import { TopProfileCardSkeleton } from "@/components/cards/TopProfileCardSkeleton";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";

/** Suspense/dynamic fallback matching the section's header + card-grid layout.
 * Kept in its own file so statically importing it doesn't drag TopProfilesSection's
 * motion/react usage into the eagerly-loaded route bundle. */
export function TopProfilesSectionSkeleton() {
  return (
    <Section spacing="default" ground="warm" className="overflow-hidden">
      <Stack gap="12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Stack gap="4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </Stack>
          <Skeleton className="h-11 w-44 shrink-0" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TopProfileCardSkeleton key={i} />
          ))}
        </div>
      </Stack>
    </Section>
  );
}
