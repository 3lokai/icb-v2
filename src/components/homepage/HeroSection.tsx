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
    <section className="relative flex min-h-[80vh] items-start overflow-x-hidden pb-8 pt-12">
      {/* Background Video - Client component for lazy loading */}
      <HeroVideoBackground />

      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Main content container */}
      <div className="hero-content text-left">
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
