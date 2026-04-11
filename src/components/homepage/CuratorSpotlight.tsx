// src/components/homepage/CuratorSpotlight.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

import { Icon } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import type { CuratorDTO } from "@/data/curations";

type CuratorSpotlightProps = {
  curator: CuratorDTO | null;
};

export default function CuratorSpotlight({ curator }: CuratorSpotlightProps) {
  if (!curator) return null;

  const spotlightImage = curator.gallery?.[0] || curator.logo;

  return (
    <Section spacing="default" className="py-8 md:py-14 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card shadow-xl transition-all duration-500 hover:shadow-accent/5">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: Editorial Content (approx 70%) */}
            <div className="lg:col-span-8 relative z-10 flex flex-col justify-center p-6 md:p-10 lg:p-12 overflow-hidden">
              {/* Decorative Brand Stripe - matching homepage CtaSection */}
              <div className="absolute left-0 top-0 h-full w-1.5 md:w-2 bg-gradient-to-b from-primary via-accent to-primary/60 opacity-60" />

              {/* Background Noise Texture */}
              <div className="bg-noise absolute inset-0 opacity-[0.035] pointer-events-none" />

              <Stack gap="6" className="relative">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-4"
                >
                  <span className="h-px w-8 bg-accent/60" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                    COMMUNITY TESTED
                  </span>
                </motion.div>

                <Stack gap="4">
                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-title text-balance leading-[1.1] tracking-tight"
                  >
                    Cultivated{" "}
                    <span className="text-accent italic font-serif">
                      Taste.
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xl text-pretty text-body text-muted-foreground leading-relaxed"
                  >
                    Independent recommendations from people with a visible
                    tasting history. No trends, just genuine preference.
                  </motion.p>
                </Stack>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center gap-4 pt-2"
                >
                  <Button asChild variant="outline" size="lg" className="group">
                    <Link href="/curations">
                      Meet the Collective
                      <Icon
                        className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                        name="ArrowRight"
                      />
                    </Link>
                  </Button>
                </motion.div>
              </Stack>
            </div>

            {/* Right Column: Curator Showcase (approx 30%) */}
            <div className="lg:col-span-4 relative min-h-[350px] lg:min-h-full overflow-hidden">
              <Image
                src={spotlightImage}
                alt={`${curator.name} profile photography`}
                fill
                className="object-cover transition-transform duration-[20s] ease-linear group-hover:scale-110"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Sophisticated Scrim for legibility — More opaque as requested */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent lg:bg-gradient-to-l lg:from-black/80 lg:to-transparent" />

              {/* Clean Overlays (Name and Location only) — Bottom Left Aligned */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end items-start gap-3">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-overline uppercase tracking-widest text-white px-3 py-1 rounded-full mb-3">
                    Featured Curator
                  </Badge>
                  <h3 className="text-title font-bold text-white mb-1 leading-none">
                    {curator.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-white">
                    <Icon name="MapPin" size={14} className="opacity-80" />
                    <span className="text-caption font-medium uppercase tracking-wider">
                      {curator.location}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
