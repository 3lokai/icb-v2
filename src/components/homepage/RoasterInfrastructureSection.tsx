"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRoasterDirectory } from "@/hooks/useHomePageQueries";
import { useImageColor } from "@/hooks/useImageColor";
import { Accent } from "@/components/primitives/accent";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { Icon } from "@/components/common/Icon";
import Image from "next/image";
import { roasterImagePresets } from "@/lib/imagekit";
import { cn } from "@/lib/utils";
import type { RoasterSummary } from "@/types/roaster-types";

function RoasterLogoTile({ roaster }: { roaster: RoasterSummary }) {
  const logoUrl = useMemo(
    () =>
      roaster.slug
        ? roasterImagePresets.roasterLogo(`roasters/${roaster.slug}-logo`)
        : null,
    [roaster.slug]
  );
  // isDark = logo is light/white → needs a darker plate, and vice versa
  const { isDark } = useImageColor(logoUrl);

  const logoBgClass = isDark
    ? "bg-[radial-gradient(circle_at_center,oklch(0.24_0.014_59.46)_0%,oklch(0.195_0.01_59.58)_100%)] dark:bg-[radial-gradient(circle_at_center,var(--muted)_0%,var(--background)_100%)]"
    : "bg-[radial-gradient(circle_at_center,var(--muted)_0%,var(--background)_100%)] dark:bg-[radial-gradient(circle_at_center,oklch(0.965_0.015_79.92)_0%,oklch(0.982_0.009_79.92)_100%)]";

  return (
    <div
      className={cn(
        "group flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-sm border border-border/40 p-2 shadow-sm transition-colors hover:border-accent/20",
        logoBgClass
      )}
      title={roaster.name}
    >
      <div className="relative h-full w-full">
        {logoUrl && (
          <Image
            alt={roaster.name}
            className="object-contain"
            fill
            sizes="64px"
            src={logoUrl}
            unoptimized
          />
        )}
      </div>
    </div>
  );
}

export default function RoasterInfrastructureSection() {
  const { data } = useRoasterDirectory(100);
  const roasters = data?.items || [];
  const totalCount = data?.total || 0;

  const wallRoasters = roasters;

  return (
    <Section spacing="default" className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Column: Roaster logo wall - order-2 on mobile so copy appears first */}
        <div className="relative h-[280px] sm:h-[360px] md:h-[400px] w-full min-w-0 overflow-hidden order-2 md:order-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-[color-mix(in_oklch,var(--muted)_30%,var(--background))] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-[color-mix(in_oklch,var(--muted)_30%,var(--background))] to-transparent" />

          <Marquee
            vertical
            pauseOnHover
            repeat={2}
            className="p-0 [--duration:70s] [--gap:0.5rem]"
          >
            <div className="grid grid-cols-5 gap-2 justify-items-center">
              {wallRoasters.map((roaster) => (
                <RoasterLogoTile key={roaster.id} roaster={roaster} />
              ))}
            </div>
          </Marquee>
        </div>

        {/* Right Column: Copy & Stats - order-1 on mobile so copy appears first */}
        <div className="flex flex-col justify-center items-start text-left order-1 md:order-2">
          <Stack gap="6">
            <h2 className="text-title text-balance leading-[1.1] tracking-tight">
              India&apos;s Coffee <Accent>Ecosystem.</Accent>
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
    </Section>
  );
}
