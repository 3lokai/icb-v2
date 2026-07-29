import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoffeeCompassLoading() {
  return (
    <>
      <div className="space-y-8 pb-20" aria-hidden="true">
        <Skeleton className="h-48 w-full" />
        <div className="container mx-auto px-4 space-y-8">
          <Skeleton className="h-96 w-full rounded-3xl" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
      <LoadingOverlay text="Loading Coffee Compass..." />
    </>
  );
}
