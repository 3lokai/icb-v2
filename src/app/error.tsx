"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect } from "react";
import CoffeeFact from "@/components/common/CoffeeFact";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background/50 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 inline-block size-20">
          <DotLottieReact
            autoplay
            loop
            speed={1}
            src="/animations/spilled-coffee.lottie"
            useFrameInterpolation={true}
          />
        </div>
        <h1 className="mb-2 font-bold text-title">Oops! Coffee Spill</h1>

        <p className="mb-8 text-muted-foreground">
          Looks like we spilled the beans! Something went wrong while brewing
          your content.
        </p>

        <Button
          className="bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={reset}
        >
          Try Again
        </Button>

        {/* Coffee fact */}
        <div className="mt-8">
          <CoffeeFact />
        </div>
      </div>
    </div>
  );
}
