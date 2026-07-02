import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";

/** Suspense/dynamic fallback matching the editorial-card + stat-block layout.
 * Server-renderable — no client boundary. Kept in its own file so statically
 * importing it doesn't couple the fallback to CtaSection's data fetch. */
export function CtaSectionSkeleton() {
  return (
    <Section spacing="default">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="p-6 sm:p-10 md:p-14 lg:p-16">
            <div className="grid items-center gap-10 md:gap-16 md:grid-cols-12">
              <div className="md:col-span-7">
                <Stack gap="8">
                  <Skeleton className="h-4 w-40" />
                  <Stack gap="6">
                    <Skeleton className="h-10 w-full max-w-md" />
                    <Skeleton className="h-5 w-full max-w-xl" />
                  </Stack>
                  <div className="flex flex-wrap gap-5">
                    <Skeleton className="h-12 w-44" />
                    <Skeleton className="h-12 w-40" />
                  </div>
                </Stack>
              </div>
              <div className="md:col-span-12 lg:col-span-5">
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
