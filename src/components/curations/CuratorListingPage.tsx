"use client";

import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { CuratorCard } from "@/components/cards/CuratorCard";
import type { Curator } from "./types";

type CuratorListingPageProps = {
  curators: Curator[];
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

export function CuratorListingPage({ curators }: CuratorListingPageProps) {
  return (
    <PageShell maxWidth="7xl">
      <Section spacing="default">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Stack gap="6">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 md:w-12 bg-accent/60" />
                  <span className="text-overline text-accent tracking-[0.15em] uppercase">
                    The ICB Philosophy
                  </span>
                </div>
                <h2 className="text-display leading-tight">
                  Taste over <span className="italic">trends.</span>
                </h2>
                <div className="h-0.5 w-10 bg-border/40" />
              </Stack>
            </motion.div>
          </div>

          <div className="md:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <Stack gap="6" className="max-w-xl">
                <p className="text-body-large text-muted-foreground">
                  Curations are personal coffee recommendations from cafés,
                  baristas, and community voices with a clear point of view.
                </p>
                <p className="text-body text-muted-foreground/80">
                  Each curator shares coffees they&apos;ve brewed, enjoyed, and
                  stand behind — based on personal taste, consistent
                  preferences, and brewing history.
                </p>
                <div className="pt-2">
                  <div className="h-px w-10 bg-border/40" />
                </div>
              </Stack>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Main Curator Listing */}
      <Section spacing="default">
        <Stack gap="12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <Stack gap="3">
              <div className="inline-flex items-center gap-4">
                <span className="h-px w-8 md:w-12 bg-accent/60" />
                <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                  EXPLORE CURATORS
                </span>
              </div>
              <h2 className="text-title text-balance leading-none">
                Discover your next{" "}
                <span className="text-accent italic">Favorite.</span>
              </h2>
            </Stack>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {curators.length === 0 ? (
              <p className="text-body text-muted-foreground col-span-full py-12 text-center">
                No curators yet. Check back soon for curated recommendations.
              </p>
            ) : (
              curators.map((curator) => (
                <motion.div key={curator.id} variants={itemVariants}>
                  <CuratorCard curator={curator} />
                </motion.div>
              ))
            )}
          </motion.div>
        </Stack>
      </Section>

      {/* Integrity note — tone anchor */}
      <div className="mx-auto max-w-4xl py-12 md:py-20">
        <div className="border-l border-accent/30 pl-8 md:pl-12">
          <Stack gap="6">
            <Stack gap="3">
              <span className="text-micro font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                Independent by design
              </span>
              <p className="text-body-large font-serif italic text-muted-foreground leading-relaxed text-pretty">
                &quot;Curations on ICB aren&apos;t sponsored or influenced by
                brands. Every recommendation reflects the curator&apos;s own
                brewing preferences.&quot;
              </p>
            </Stack>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-border/40" />
              <p className="text-label text-muted-foreground/60 italic">
                The ICB Manifesto
              </p>
            </div>
          </Stack>
        </div>
      </div>

      {/* CTA Section — Join the Collective */}
      <Section spacing="default">
        <div className="mx-auto max-w-6xl">
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-border/60 bg-card shadow-sm transition-shadow duration-500 hover:shadow-md">
            {/* Magazine Accents & Textures */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              {/* Brand Stripe */}
              <div className="absolute left-0 top-0 h-full w-1.5 md:w-2 bg-gradient-to-b from-primary via-accent to-primary/60 opacity-60" />

              {/* Subtle Dot Matrix */}
              <div className="absolute inset-0 opacity-[0.2]">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              {/* Soft decorative color washes */}
              <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent/5 blur-[80px]" />
              <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/5 blur-[80px]" />
            </div>

            <div className="relative p-6 sm:p-10 md:p-14 lg:p-16">
              <div className="grid items-center gap-10 md:gap-16 lg:grid-cols-12">
                {/* Left: Editorial Copy */}
                <div className="lg:col-span-7">
                  <Stack gap="8">
                    <div className="inline-flex items-center gap-4">
                      <span className="h-px w-8 md:w-12 bg-accent/60" />
                      <span className="text-overline text-muted-foreground tracking-[0.15em]">
                        JOIN THE COLLECTIVE
                      </span>
                    </div>

                    <Stack gap="6">
                      <h2 className="text-display text-balance leading-tight">
                        Want to share your{" "}
                        <span className="text-accent italic">Favorite</span>{" "}
                        coffees?
                      </h2>
                      <div className="space-y-4">
                        <p className="max-w-xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                          Curations on ICB come from people with a visible
                          tasting history — cafés, baristas, and community
                          contributors with consistent preferences.
                        </p>
                        <p className="max-w-xl text-body text-muted-foreground/80 italic">
                          If you care deeply about specialty coffee, start by
                          building your profile and share what you&apos;re
                          brewing.
                        </p>
                      </div>
                    </Stack>

                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-5 pt-2">
                      <Button
                        asChild
                        className="hover-lift w-full sm:w-auto px-8"
                        variant="default"
                        size="lg"
                      >
                        <Link href="/profile">Build your profile</Link>
                      </Button>

                      <Button
                        asChild
                        className="hover-lift w-full sm:w-auto px-8"
                        variant="secondary"
                        size="lg"
                      >
                        <Link href="/coffees">Explore coffees</Link>
                      </Button>
                    </div>
                  </Stack>
                </div>

                {/* Right: The Criteria Block */}
                <div className="lg:col-span-5 flex flex-col items-start lg:mt-0 mt-4">
                  <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-background/40 p-6 md:p-8 transition-all hover:bg-background/60 hover:border-border/80">
                    <Stack gap="6">
                      <div className="flex items-center justify-between">
                        <span className="text-overline text-muted-foreground font-semibold tracking-[0.15em] uppercase">
                          The Verification Path
                        </span>
                        <div className="h-2 w-2 rounded-full bg-accent/40 animate-pulse" />
                      </div>

                      <Stack gap="6">
                        <div className="flex items-start gap-4">
                          <div className="mt-1 h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="text-micro font-bold text-accent">
                              1
                            </span>
                          </div>
                          <div>
                            <p className="text-label-large">Verified History</p>
                            <p className="text-caption text-muted-foreground">
                              Consistently rate and review the beans you brew.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="mt-1 h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="text-micro font-bold text-accent">
                              2
                            </span>
                          </div>
                          <div>
                            <p className="text-label-large">
                              Public Perspective
                            </p>
                            <p className="text-caption text-muted-foreground">
                              Build a visible taste profile and share your
                              preferences.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="mt-1 h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                            <span className="text-micro font-bold text-accent">
                              3
                            </span>
                          </div>
                          <div>
                            <p className="text-label-large">Community Merit</p>
                            <p className="text-caption text-muted-foreground">
                              Invitations are sent based on consistent community
                              logic.
                            </p>
                          </div>
                        </div>
                      </Stack>

                      <div className="mt-2 pt-2 border-t border-border/40">
                        <p className="text-micro text-muted-foreground italic text-center">
                          Transparency first. Recommendations by people, for
                          people.
                        </p>
                      </div>
                    </Stack>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
