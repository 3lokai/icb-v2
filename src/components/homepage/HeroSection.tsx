// Server component for optimal LCP
import Link from "next/link";
import dynamic from "next/dynamic";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/common/Icon";
import { HeroHeading } from "./HeroHeading";
import { HeroVideoBackground } from "./HeroVideoBackground";

// Dynamically import HeroSearch with SSR disabled since it requires SearchProvider context
const HeroSearch = dynamic(
  () => import("./HeroSearch").then((mod) => ({ default: mod.HeroSearch })),
  {
    ssr: false,
  }
);

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-x-hidden pb-8">
      {/* Background Video - Client component for lazy loading */}
      <HeroVideoBackground />

      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Main content container */}
      <div className="hero-content">
        <Stack gap="8">
          {/* Server-rendered heading for optimal LCP */}
          <HeroHeading />

          {/* Search section - Client component for interactivity, deferred for LCP */}
          <div className="hero-search-deferred">
            <HeroSearch />
          </div>

          {/* CTA Buttons - Server-rendered */}
          <Stack gap="8" className="animate-fade-in-scale delay-300">
            <Cluster gap="4" align="center" className="justify-center">
              <Button
                asChild
                className="hover-lift px-8"
                variant="default"
                size="lg"
              >
                <Link href="/coffees">
                  <Icon className="mr-2" name="Coffee" size={18} />
                  Explore Coffees
                </Link>
              </Button>
              <Button
                asChild
                className="hover-lift px-8 whitespace-nowrap"
                variant="secondary"
                size="lg"
              >
                <Link href="/roasters">
                  <Icon className="mr-2" name="Storefront" size={18} />
                  Meet Roasters
                </Link>
              </Button>
            </Cluster>

            {/* Editorial Footer */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-4">
              <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-[0.2em] font-medium">
                <span className="h-1 w-1 rounded-full bg-accent/60" />
                Updated Regularly
              </div>
              <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-[0.2em] font-medium">
                <span className="h-1 w-1 rounded-full bg-accent/60" />
                Manually Reviewed
              </div>
              <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-[0.2em] font-medium">
                <span className="h-1 w-1 rounded-full bg-accent/60" />
                Community Driven
                <span className="h-1 w-1 rounded-full bg-accent/60" />
              </div>
            </div>
          </Stack>
        </Stack>
      </div>
    </section>
  );
}
