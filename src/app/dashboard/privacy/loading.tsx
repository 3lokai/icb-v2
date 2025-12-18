import { Skeleton } from "@/components/ui/skeleton";

export default function PrivacyLoading() {
  return (
    <div className="container-default p-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96" />
    </div>
  );
}
