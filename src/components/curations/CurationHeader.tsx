import Image from "next/image";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/common/Icon";
import { Curator } from "./types";

type CurationHeaderProps = {
  title: string;
  subtitle: string;
  curator: Curator;
};

export function CurationHeader({ subtitle, curator }: CurationHeaderProps) {
  return (
    <section className="relative flex min-h-[80vh] w-screen max-w-none items-center justify-center overflow-hidden md:min-h-[65vh] ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]">
      {/* Background Image - Full Bleed */}
      <div className="absolute inset-0 z-0 bg-black/80">
        <Image
          src="/curations/curation-header.avif"
          alt="Curated Selections Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center translate-y-[-10%] sm:translate-y-0"
        />
      </div>

      {/* Hero Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/85 via-black/65 to-black/95" />
      <div className="bg-noise absolute inset-0 opacity-[0.05] z-15 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <div className="mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start lg:items-end">
            {/* Left Column: Primary Content */}
            <div className="md:col-span-8 lg:col-span-8">
              <Stack gap="8">
                {/* Eyebrow */}
                <div className="flex items-center gap-4">
                  <span className="h-px w-12 bg-accent/60" />
                  <span className="text-overline tracking-[0.2em] uppercase !text-white/70">
                    Curated Selections
                  </span>
                </div>

                {/* Main Title Area: Logo + Name */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8">
                  <div className="relative h-24 w-24 md:h-28 md:w-28 overflow-hidden rounded-full border-2 border-white/30 p-1.5 bg-white/10 shadow-2xl shrink-0 group">
                    <div className="relative h-full w-full overflow-hidden rounded-full grayscale hover:grayscale-0 transition-all duration-700">
                      <Image
                        src={curator.logo}
                        alt={curator.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <h1 className="text-display sm:text-hero italic leading-tight tracking-tight text-balance !text-white">
                    {curator.name}
                    <span className="text-accent not-italic ml-1">.</span>
                  </h1>
                </div>

                {/* Subtext: Location & Tags */}
                <Stack gap="4">
                  <Cluster gap="2" align="center">
                    <Icon name="MapPin" size={16} className="!text-white/40" />
                    <span className="text-label-large font-light uppercase tracking-[0.1em] !text-white">
                      {curator.location}
                    </span>
                  </Cluster>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {curator.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="onMedia"
                        className="text-micro uppercase tracking-[0.2em] px-3 py-1.5 backdrop-blur-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Stack>
              </Stack>
            </div>

            {/* Right Column: Pull Quote */}
            <div className="md:col-span-12 lg:col-span-4 lg:pb-4">
              <div className="relative max-w-md lg:max-w-none ml-auto">
                <Icon
                  name="Quotes"
                  size={48}
                  className="absolute -top-8 -left-6 !text-white/10 rotate-180 -z-10"
                />
                <p className="text-body-large text-pretty font-serif italic border-l-2 border-white/20 pl-8 py-3 !text-white/80 leading-relaxed">
                  &quot;{subtitle}&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
