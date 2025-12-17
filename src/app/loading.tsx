// app/loading.tsx

import CoffeeFact from "@/components/common/CoffeeFact";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background/50 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-md text-center">
        <LoadingSpinner size="lg" text="Steeping the perfect read..." />

        <div className="mt-8">
          <CoffeeFact />
        </div>
      </div>
    </div>
  );
}
