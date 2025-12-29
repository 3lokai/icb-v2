"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";
import CoffeeFact from "@/components/common/CoffeeFact";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/primitives/stack";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background p-6">
      <div className="mx-auto max-w-2xl text-center">
        <Stack gap="8" className="items-center">
          <div className="inline-block size-20">
            <DotLottieReact
              autoplay
              loop
              speed={1}
              src="/animations/spilled-coffee.lottie"
              useFrameInterpolation={true}
            />
          </div>

          <Stack gap="4" className="items-center">
            <h1 className="font-bold text-title">Oops! Coffee Spill</h1>
            <p className="text-muted-foreground">
              Looks like we spilled the beans! Something went wrong while
              brewing your content.
            </p>
          </Stack>

          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={reset}
          >
            Try Again
          </Button>

          <div className="relative w-full overflow-hidden pt-8">
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
