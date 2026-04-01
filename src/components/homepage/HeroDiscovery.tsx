"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Stack } from "@/components/primitives/stack";
import { Announcement, AnnouncementTitle } from "@/components/ui/announcement";
import { Icon } from "@/components/common/Icon";
import { HeroVideoBackground } from "./HeroVideoBackground";
import { getHeroDiscoveryPillRows } from "./hero-discovery-pills";
import { capture } from "@/lib/posthog";
import { cn } from "@/lib/utils";
import type { PublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";

const HeroSearch = dynamic(() =>
  import("./HeroSearch").then((mod) => ({ default: mod.HeroSearch }))
);

const HeroCTAs = dynamic(() =>
  import("./HeroCTAs").then((mod) => ({ default: mod.HeroCTAs }))
);

type HeroDiscoveryProps = {
  totals: PublicDirectoryTotals;
};

export function HeroDiscovery({ totals }: HeroDiscoveryProps) {
  const pillRows = getHeroDiscoveryPillRows();

  return (
    <section className="relative flex min-h-[90dvh] items-center justify-start overflow-x-hidden pb-24 pt-16 px-6 sm:px-12 md:px-24">
      <HeroVideoBackground />

      <div className="absolute inset-0 z-0 bg-gradient-to-l from-black/80 via-black/40 to-black/60" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.3)_0%,transparent_70%)]" />

      <div className="hero-content relative z-10 w-full max-w-4xl text-left">
        <Stack gap="8">
          <div className="flex items-center justify-center">
            <Announcement variant="onMedia">
              <AnnouncementTitle className="gap-2">
                <Icon className="text-accent" name="MapPin" size={16} />
                India&apos;s First Coffee Directory
                <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              </AnnouncementTitle>
            </Announcement>
          </div>

          <div className="lcp-optimized">
            <Stack gap="6" className="items-center text-center">
              <h1 className="text-hero text-balance leading-[1.1] text-white">
                Find your next{" "}
                <span className="text-accent italic">Indian coffee.</span>
              </h1>
              <p className="max-w-3xl text-pretty text-body-large leading-relaxed text-white">
                Search the directory and jump in by roast, brew method, or
                origin.
              </p>
            </Stack>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <HeroSearch />

            <div className="w-full animate-fade-in-scale delay-300">
              <div className="flex flex-wrap items-center gap-2 text-caption font-medium">
                <span className="font-semibold uppercase tracking-[0.15em] text-white/50 text-micro mr-1">
                  Quick links:
                </span>
                {pillRows
                  .flatMap((row) =>
                    row.pills.map((pill) => ({ ...pill, rowTitle: row.title }))
                  )
                  .map((pill) => (
                    <Link
                      key={pill.href}
                      href={pill.href}
                      className={cn(
                        "inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-0.5 text-white/80 backdrop-blur-[2px] transition-all duration-300",
                        "hover:border-accent/40 hover:bg-accent/10 hover:text-accent active:scale-95"
                      )}
                      onClick={() =>
                        capture("hero_discovery_pill_clicked", {
                          pill_label: pill.label,
                          pill_href: pill.href,
                          pill_row: pill.rowTitle,
                          hero_variant: "discovery",
                        })
                      }
                    >
                      {pill.label}
                    </Link>
                  ))}
              </div>
            </div>
          </div>

          <HeroCTAs heroVariant="discovery" totals={totals} />
        </Stack>
      </div>
    </section>
  );
}
