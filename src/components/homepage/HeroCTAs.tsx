"use client";

import Link from "next/link";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import { useSearchContext } from "@/providers/SearchProvider";

export function HeroCTAs() {
  const { openSearch } = useSearchContext();

  return (
    <Stack gap="8" className="animate-fade-in-scale delay-300">
      <Cluster gap="4" align="center" className="justify-start">
        {/* Primary CTA - Start rating coffees */}
        <div className="flex flex-col gap-1">
          <Button
            onClick={() => openSearch(undefined, true)}
            className="hover-lift px-8"
            variant="default"
            size="lg"
          >
            <Icon className="mr-2" name="Coffee" size={18} />
            Start rating coffees
          </Button>
          <p className="text-micro text-white/60 text-center">
            No sign-up required
          </p>
        </div>

        {/* Secondary CTA - Explore coffees */}
        <Button
          asChild
          className="hover-lift px-8 whitespace-nowrap"
          variant="secondary"
          size="lg"
        >
          <Link href="/coffees">Explore coffees</Link>
        </Button>
      </Cluster>

      {/* Editorial Footer */}
      <div className="flex flex-wrap items-center justify-start gap-x-8 gap-y-4 pt-4">
        <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-[0.2em] font-medium">
          <span className="h-1 w-1 rounded-full bg-accent/60" />
          800+ coffees rated
        </div>
        <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-[0.2em] font-medium">
          <span className="h-1 w-1 rounded-full bg-accent/60" />
          60+ Indian roasters
        </div>
        <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-[0.2em] font-medium">
          <span className="h-1 w-1 rounded-full bg-accent/60" />
          Community-driven, not sponsored
          <span className="h-1 w-1 rounded-full bg-accent/60" />
        </div>
      </div>
    </Stack>
  );
}
