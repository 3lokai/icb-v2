import { Section } from "@/components/primitives/section";
import { Skeleton } from "@/components/ui/skeleton";

/** Suspense/dynamic fallback matching the wide editorial-card layout. Kept in
 * its own file so statically importing it doesn't drag CuratorSpotlight's
 * motion/react usage into the eagerly-loaded route bundle. */
export function CuratorSpotlightSkeleton() {
  return (
    <Section spacing="default" className="py-8 md:py-14 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-8 flex flex-col justify-center gap-6 p-6 md:p-10 lg:p-12">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-full max-w-xl" />
              <Skeleton className="h-5 w-3/4 max-w-xl" />
              <Skeleton className="h-11 w-44" />
            </div>
            <Skeleton className="lg:col-span-4 min-h-[350px] lg:min-h-full rounded-none" />
          </div>
        </div>
      </div>
    </Section>
  );
}
