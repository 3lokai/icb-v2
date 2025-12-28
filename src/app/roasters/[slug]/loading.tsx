import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-default section-spacing">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Hero section skeleton */}
      <div className="card-shell card-padding mb-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          {/* Logo skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="h-32 w-32 rounded-lg md:h-40 md:w-40" />
          </div>

          {/* Content skeleton */}
          <div className="flex-1 space-y-4">
            {/* Name and location */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats section skeleton */}
      <div className="card-shell card-padding mb-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      {/* Coffees list skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-4 h-7 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-shell">
              <Skeleton className="aspect-[4/3] w-full rounded-t-lg" />
              <div className="card-padding space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About section skeleton */}
      <div className="card-shell card-padding mb-8">
        <Skeleton className="mb-4 h-7 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>

      {/* Location and social links skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card-shell card-padding">
          <Skeleton className="mb-4 h-7 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <div className="card-shell card-padding">
          <Skeleton className="mb-4 h-7 w-32" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
