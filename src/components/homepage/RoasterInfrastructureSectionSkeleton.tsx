import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";

/** Suspense/dynamic fallback matching the logo-wall + copy/stat column layout.
 * Kept in its own file so statically importing it doesn't drag
 * RoasterInfrastructureSection's data hook + Marquee into the eagerly-loaded
 * route bundle. */
export function RoasterInfrastructureSectionSkeleton() {
  return (
    <Section spacing="default" className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <Skeleton className="h-[280px] sm:h-[360px] md:h-[400px] w-full rounded-lg order-2 md:order-1" />
        <div className="flex flex-col items-start order-1 md:order-2">
          <Stack gap="6" className="w-full">
            <Skeleton className="h-10 w-full max-w-sm" />
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-24 w-full max-w-md rounded-lg" />
            <div className="pt-4 flex items-center gap-6">
              <Skeleton className="h-11 w-40" />
            </div>
          </Stack>
        </div>
      </div>
    </Section>
  );
}
