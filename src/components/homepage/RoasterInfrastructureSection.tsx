"use client";

import Link from "next/link";
import { useRoasterDirectory } from "@/hooks/useHomePageQueries";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import Image from "next/image";
import { roasterImagePresets } from "@/lib/imagekit";

export default function RoasterInfrastructureSection() {
  const { data } = useRoasterDirectory(100);
  const roasters = data?.items || [];
  const totalCount = data?.total || 0;

  // Duplicate list for seamless marquee
  const displayRoasters = [...roasters, ...roasters];

  return (
    <Section spacing="default" className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        {/* Left Column: Dense List (Visual) */}
        <div className="relative h-[500px] w-full overflow-hidden">
          {/* Gradient Overlays for smooth fade in/out */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

          {/* Marquee Content */}
          <div
            className="absolute inset-x-0 top-0 animate-marquee-vertical hover:[animation-play-state:paused]"
            style={{ "--duration": "60s" } as React.CSSProperties}
          >
            <div className="grid grid-cols-2 p-6 gap-4">
              {displayRoasters.map((roaster, i) => (
                <div
                  key={`${roaster.id}-${i}`}
                  className="flex flex-col gap-3 p-4 rounded-lg bg-surface-1/50 border border-border/40 hover:bg-surface-1 hover:border-accent/20 transition-all group select-none shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 shrink-0 overflow-hidden rounded bg-white p-1 border border-border/20">
                      <Image
                        alt={roaster.name}
                        className="object-contain"
                        fill
                        sizes="40px"
                        src={roasterImagePresets.roasterLogo(
                          `roasters/${roaster.slug}-logo`
                        )}
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-label font-medium text-foreground truncate">
                        {roaster.name}
                      </div>
                      <div className="text-micro text-muted-foreground truncate">
                        {[roaster.hq_city, roaster.hq_state]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Copy & Stats */}
        <div className="flex flex-col justify-center">
          <Stack gap="6">
            <div className="inline-flex items-center gap-4">
              <span className="h-px w-8 md:w-12 bg-accent/60" />
              <span className="text-overline text-muted-foreground tracking-[0.15em]">
                The Infrastructure
              </span>
            </div>

            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              India&apos;s Coffee
              <span className="text-accent italic"> Ecosystem.</span>
            </h2>

            <div className="py-4 flex items-baseline gap-3">
              <div className="text-display font-serif text-foreground leading-none">
                {totalCount > 0 ? totalCount : "150"}+
              </div>
              <div className="text-body-large text-muted-foreground">
                Active Roasters Listed
              </div>
            </div>

            <div className="space-y-4 max-w-md">
              <div className="p-6 rounded-lg bg-surface-1/50 border border-border/50">
                <p className="text-body text-foreground">
                  From small independent roasters to established specialty
                  brands, we track coffee roasters across India — spanning
                  regions, roast styles, and brewing cultures.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <Link href="/roasters">
                <Button variant="outline" className="group">
                  Explore Directory
                  <Icon
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    name="ArrowRight"
                  />
                </Button>
              </Link>

              <Link
                href="/roasters/partner"
                className="text-label text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
              >
                Are you a roaster?
                <Icon name="ArrowUpRight" className="w-3 h-3" />
              </Link>
            </div>
          </Stack>
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-vertical {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-50%);
          }
        }
        .animate-marquee-vertical {
          animation: marquee-vertical var(--duration) linear infinite;
        }
      `}</style>
    </Section>
  );
}
