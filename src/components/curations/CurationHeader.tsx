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

export function CurationHeader({
  title,
  subtitle,
  curator,
}: CurationHeaderProps) {
  return (
    <section className="relative pt-16 pb-8 md:pt-24 md:pb-10 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent -z-10" />
      <div className="bg-noise absolute inset-0 opacity-[0.03] -z-10" />

      <div className="mx-auto max-w-6xl w-full px-4 md:px-6 lg:px-8">
        <Stack gap="12">
          {/* Top Row: Curator Profile Hub */}
          <Cluster className="justify-between" align="end" gap="6">
            <Stack gap="6">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 bg-accent/60" />
                <span className="text-overline text-accent tracking-[0.15em] uppercase">
                  Editorial feature
                </span>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative h-20 w-20 md:h-24 md:w-24 overflow-hidden rounded-full border-2 border-accent/20 p-1 bg-background shadow-xl">
                  <div className="relative h-full w-full overflow-hidden rounded-full grayscale hover:grayscale-0 transition-all duration-700">
                    <Image
                      src={curator.logo}
                      alt={curator.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <Stack gap="1">
                  <p className="text-subheading tracking-tight">Curated by</p>
                  <p className="text-heading italic text-accent leading-none">
                    {curator.name}
                  </p>
                  <Cluster gap="2" align="center" className="mt-1">
                    <Icon
                      name="MapPin"
                      size={12}
                      className="text-muted-foreground"
                    />
                    <span className="text-label font-bold uppercase text-muted-foreground/80">
                      {curator.location}
                    </span>
                  </Cluster>
                </Stack>
              </div>
            </Stack>

            <div className="hidden lg:flex flex-wrap gap-2 justify-end max-w-xs">
              {curator.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-micro uppercase tracking-widest bg-accent/5 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </Cluster>

          {/* Main Title Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
            <div className="lg:col-span-8">
              <h1 className="text-hero text-balance leading-[1.05] tracking-tighter">
                {title.split(" × ").map((part, i) => (
                  <span key={part} className="block last:inline">
                    {i > 0 && (
                      <span className="text-accent/30 mx-2 font-serif font-light">
                        ×
                      </span>
                    )}
                    {part}
                  </span>
                ))}
                <span className="text-accent">.</span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:pt-4">
              <div className="relative">
                <Icon
                  name="Quotes"
                  size={40}
                  className="absolute -top-6 -left-4 text-accent/10 rotate-180 -z-10"
                />
                <p className="text-body-large text-pretty text-muted-foreground leading-relaxed font-serif italic border-l-2 border-accent/20 pl-6 py-2">
                  &quot;{subtitle}&quot;
                </p>
              </div>
            </div>
          </div>
        </Stack>
      </div>
    </section>
  );
}
