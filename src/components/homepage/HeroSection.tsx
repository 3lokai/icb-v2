// Server component for optimal LCP
import dynamic from "next/dynamic";
import { Stack } from "@/components/primitives/stack";
import { HeroHeading } from "./HeroHeading";
import { HeroVideoBackground } from "./HeroVideoBackground";

// Dynamic import for client-side search component (code splitting)
const HeroSearch = dynamic(() =>
  import("./HeroSearch").then((mod) => ({ default: mod.HeroSearch }))
);

// Dynamic import for client-side CTA buttons
const HeroCTAs = dynamic(() =>
  import("./HeroCTAs").then((mod) => ({ default: mod.HeroCTAs }))
);

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[100dvh] items-center justify-start overflow-x-hidden pb-12 pt-16 px-6 sm:px-12 md:px-24">
      {/* Background Video - Client component for lazy loading */}
      <HeroVideoBackground />

      {/* Overlay - Refined for dark video with left-anchored focus */}
      <div className="absolute inset-0 z-0 bg-gradient-to-l from-black/80 via-black/40 to-black/60" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.3)_0%,transparent_70%)]" />

      {/* Main content container - Left aligned */}
      <div className="hero-content relative z-10 text-left w-full max-w-2xl">
        <Stack gap="8">
          {/* Server-rendered heading for optimal LCP */}
          <HeroHeading />

          {/* Client-side search component - dynamically loaded */}
          <HeroSearch />

          {/* CTA Buttons - Client-side for search interaction */}
          <HeroCTAs />
        </Stack>
      </div>
    </section>
  );
}
