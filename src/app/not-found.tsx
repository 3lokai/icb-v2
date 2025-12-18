// app/not-found.tsx
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useEffect, startTransition, useState } from "react";
import CoffeeFact from "@/components/common/CoffeeFact";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration issues
  useEffect(() => {
    startTransition(() => {
      setIsClient(true);
    });
  }, []);

  // Return an empty div during SSR to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background/50 p-4 backdrop-blur-sm" />
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background/50 p-4 backdrop-blur-sm">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mb-8">
          <h1 className="flex items-center justify-center font-bold text-hero text-accent">
            4
            <div className="inline-block size-20">
              <DotLottieReact
                autoplay
                loop
                speed={1}
                src="/animations/finding-bean.lottie"
                useFrameInterpolation={true}
              />
            </div>
            4
          </h1>

          <div className="-bottom-4 -translate-x-1/2 absolute left-1/2 size-3 rounded-full bg-accent/20 blur-sm" />
        </div>

        <h2 className="mb-4 font-bold text-title">Bean Not Found</h2>

        <p className="mb-8 text-muted-foreground">
          We searched high and low, but it seems this coffee bean has gone
          missing. Perhaps it got ground up in another batch?
        </p>

        <div className="space-y-3">
          <Button
            asChild
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/">Back to Home</Link>
          </Button>

          <div className="mt-6 flex justify-center gap-4">
            <Button asChild size="sm" variant="outline">
              <Link href="/coffees">Browse Coffees</Link>
            </Button>

            <Button asChild size="sm" variant="outline">
              <Link href="/roasters">Discover Roasters</Link>
            </Button>
          </div>
        </div>

        {/* Coffee fact */}
        <div className="mt-8">
          <CoffeeFact />
        </div>
      </div>
    </div>
  );
}
