import { Stack } from "@/components/primitives/stack";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Suspense/dynamic fallback matching DiscoveryAccordionGrid's 6-column row layout.
 * Kept in its own file so statically importing it doesn't drag
 * DiscoveryAccordionGrid's motion/react usage into the eagerly-loaded route bundle. */
export function DiscoveryAccordionGridSkeleton({
  className,
  showHeading = true,
}: {
  className?: string;
  showHeading?: boolean;
}) {
  return (
    <div className={cn("w-full", className)}>
      {showHeading ? (
        <div className="mb-12">
          <Stack gap="6">
            <div className="inline-flex items-center gap-4">
              <Skeleton className="h-px w-8 md:w-12" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </Stack>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border/40 shadow-sm">
        <div className="flex flex-col md:h-[440px] md:flex-row">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative flex min-h-[110px] flex-1 border-b border-border/30 bg-muted/10 md:border-b-0 md:border-r md:last:border-r-0"
            >
              <div className="relative z-10 mt-auto flex w-full flex-col p-4 sm:p-5">
                <Skeleton className="mb-3 h-9 w-9 rounded-lg" />
                <Skeleton className="mb-2 h-7 w-24" />
                <div className="my-2 h-0.5 w-8 rounded-full bg-border/40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
