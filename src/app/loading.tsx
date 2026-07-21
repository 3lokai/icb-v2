// app/loading.tsx

import CoffeeFact from "@/components/common/CoffeeFact";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Stack } from "@/components/primitives/stack";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-6 z-50">
      <div className="mx-auto text-center">
        <Stack gap="12" className="items-center">
          <LoadingSpinner size="xl" text="Steeping the perfect read..." />

          {/* Reserve stable space: CoffeeFact renders null on first paint then
              pops in a variable-height card post-mount. Without a reserved slot,
              that grows this centered column and re-centers it → CLS (measured
              0.10–0.36 on slower-hydrating routes). min-h holds the space so the
              spinner above never moves. */}
          <div className="relative w-full overflow-hidden pt-12 min-h-[320px]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-24 bg-accent/40" />
            <CoffeeFact />
          </div>

          <p className="text-micro font-bold uppercase tracking-[0.2em] text-muted-foreground/60 italic">
            Quality takes time. One bean at a time.
          </p>
        </Stack>
      </div>
    </div>
  );
}
