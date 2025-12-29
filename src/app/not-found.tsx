// app/not-found.tsx
"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { useEffect, startTransition, useState } from "react";
import CoffeeFact from "@/components/common/CoffeeFact";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/primitives/stack";

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
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background p-6" />
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background p-6">
      <div className="mx-auto max-w-2xl text-center">
        <Stack gap="8" className="items-center">
          <div className="relative">
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

          <Stack gap="4" className="items-center">
            <h2 className="font-bold text-title">Bean Not Found</h2>
            <p className="text-muted-foreground">
              We searched high and low, but it seems this coffee bean has gone
              missing. Perhaps it got ground up in another batch?
            </p>
          </Stack>

          <Stack gap="4" className="items-center">
            <Button
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/">Back to Home</Link>
            </Button>

            <div className="flex justify-center gap-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/coffees">Browse Coffees</Link>
              </Button>

              <Button asChild size="sm" variant="outline">
                <Link href="/roasters">Discover Roasters</Link>
              </Button>
            </div>
          </Stack>

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
