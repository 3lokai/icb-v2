"use client";

import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

export function UserProfileTeaser() {
  return (
    <Section spacing="default" className="overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-24">
          {/* Left: Copy */}
          <div className="md:col-span-5 relative z-10">
            <Stack gap="8">
              <Stack gap="6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-accent/60" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em]">
                      Your Coffee Profile
                    </span>
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-title text-balance leading-[1.1] tracking-tight"
                >
                  All Your Coffee.
                  <br />
                  <span className="text-accent italic">In One Place.</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-md text-pretty text-body-large text-muted-foreground leading-relaxed"
                >
                  Your reccomendations, brews, gear, and coffee station — built
                  quietly over time, cup by cup.
                </motion.p>
              </Stack>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Button
                  asChild
                  variant="link"
                  className="group/link gap-2 text-muted-foreground hover:text-accent"
                >
                  <Link href="/auth" className="flex items-center gap-2">
                    Start building your profile
                    <Icon
                      name="ArrowRight"
                      size={16}
                      className="transition-transform group-hover/link:translate-x-1"
                    />
                  </Link>
                </Button>
              </motion.div>
            </Stack>
          </div>

          {/* Right: Visual - Floating Composition */}
          <div className="md:col-span-12 lg:col-span-7 relative h-[500px] w-full mt-8 md:mt-0">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-primary/10 to-transparent blur-3xl rounded-full mix-blend-screen" />
            </div>

            {/* Connective Hints (SVG Arcs) */}
            <svg
              className="absolute inset-0 h-full w-full pointer-events-none z-0"
              viewBox="0 0 700 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M 320 250 Q 450 150 500 120"
                stroke="currentColor"
                className="text-accent/10"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M 320 250 Q 400 350 500 400"
                stroke="currentColor"
                className="text-primary/10"
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.7, ease: "easeInOut" }}
              />
            </svg>

            {/* 1. The Anchor: User Profile Card (Center-Left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-[10%] -translate-y-1/2 z-20"
            >
              <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-background/80 backdrop-blur-md shadow-2xl p-6 w-[280px]">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border-2 border-background shadow-sm">
                      <Icon
                        name="User"
                        size={32}
                        className="text-foreground/70"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-accent border-2 border-background flex items-center justify-center">
                      <Icon
                        name="Coffee"
                        size={12}
                        className="text-accent-foreground"
                      />
                    </div>
                  </div>
                  <div className="text-body-large font-bold">@arjun_brews</div>
                  <div className="text-micro text-muted-foreground uppercase tracking-wider mb-4">
                    Coffee Explorer
                  </div>

                  <div className="w-full h-px bg-border/50 my-2" />

                  <div className="grid grid-cols-3 gap-2 w-full pt-2">
                    {[
                      { label: "Ratings", val: "42" },
                      { label: "Beans", val: "15" },
                      { label: "Recipes", val: "8" },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-caption font-bold text-foreground">
                          {stat.val}
                        </div>
                        <div className="text-micro uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grid Overlay Texture */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
              </div>
            </motion.div>

            {/* 2. The Station: "My Setup" (Top Right) */}
            <motion.div
              className="absolute top-[10%] right-[5%] z-10 w-[220px]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                default: { duration: 0.6, delay: 0.2 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-3 shadow-xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-black opacity-90" />
                  <div className="absolute bottom-0 right-4 h-16 w-12 rounded-t-sm bg-white/10 blur-[2px]" />
                  <div className="absolute bottom-2 left-6 h-8 w-8 rounded-full bg-white/5 blur-sm" />

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-micro font-medium text-white/80 backdrop-blur-md">
                    Home Setup
                  </div>
                </div>
                <div className="flex items-center justify-between px-1">
                  <span className="text-caption font-medium">
                    Morning Corner
                  </span>
                  <Icon
                    name="Camera"
                    size={14}
                    className="text-muted-foreground"
                  />
                </div>
              </div>
            </motion.div>

            {/* 3. The Taste: Flavor Profile (Bottom Right) */}
            <motion.div
              className="absolute bottom-[15%] right-[10%] z-20 w-[240px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                default: { duration: 0.6, delay: 0.4 },
                y: {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
            >
              <div className="rounded-2xl border border-border/40 bg-card/90 backdrop-blur-md p-4 shadow-xl">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Icon name="Sparkle" size={12} className="text-accent" />
                  </div>
                  <span className="text-label font-bold uppercase tracking-wider">
                    Taste Profile
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-micro uppercase font-medium mb-1">
                      <span>Fruity</span>
                      <span className="text-accent">High</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[85%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-micro uppercase font-medium mb-1">
                      <span>Nutty/Choco</span>
                      <span className="text-primary">Medium</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 w-[40%]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 4. The Badge: "Verified" (Floating Abstract) */}
            <motion.div
              className="absolute bottom-[25%] left-[0%] z-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="h-32 w-32 border border-dashed border-accent/20 rounded-full flex items-center justify-center">
                <div className="h-24 w-24 border border-dashed border-primary/20 rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}
