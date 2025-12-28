import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left: Image carousel skeleton */}
        <div>
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Right: Details skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>

          {/* Details */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>

          {/* Flavor notes */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-20 rounded-full" />
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>

          {/* Buy button */}
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
