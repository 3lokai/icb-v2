"use client";

import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { Icon } from "@/components/common/Icon";
import { TopProfileCard } from "@/components/cards/TopProfileCard";
import { Accent } from "@/components/primitives/accent";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/zustand/auth-store";
import type { TopProfile } from "@/lib/data/fetch-top-coffee-reviewers";

type TopProfilesSectionProps = {
  profiles: TopProfile[];
};

// Canonical scroll-in: opacity + 24px rise, ease-out-expo, fires once (matches <Reveal>).
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

function ProfileCta() {
  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const isAuthed = initialized && Boolean(user);

  return (
    <Button
      asChild
      variant={isAuthed ? "outline" : "default"}
      className="group/cta gap-2"
    >
      <Link href={isAuthed ? "/profile" : "/auth"}>
        {isAuthed ? "View your profile" : "Create your profile"}
        <Icon
          name="ArrowRight"
          size={16}
          className="transition-transform group-hover/cta:translate-x-1"
        />
      </Link>
    </Button>
  );
}

export default function TopProfilesSection({
  profiles,
}: TopProfilesSectionProps) {
  const hasProfiles = profiles.length > 0;

  return (
    <MotionConfig reducedMotion="user">
      <Section spacing="default" ground="warm" className="overflow-hidden">
        <Stack gap="12">
          {/* Header: title + intro on the left, CTA aligned right on desktop */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            >
              <Stack gap="4">
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Rated by the <Accent>Community.</Accent>
                </h2>
                <p className="max-w-xl text-pretty text-body-large leading-relaxed text-muted-foreground">
                  The people building this directory cup by cup — ranked by the
                  coffees they&apos;ve rated. Every score here is from a real,
                  signed-in palate.
                </p>
              </Stack>
            </motion.div>

            {hasProfiles ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
                className="shrink-0"
              >
                <ProfileCta />
              </motion.div>
            ) : null}
          </div>

          {hasProfiles ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profiles.map((profile, i) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                  transition={{
                    duration: 0.6,
                    delay: Math.min(i * 0.06, 0.4),
                    ease: EASE_OUT_EXPO,
                  }}
                >
                  <TopProfileCard profile={profile} rank={i + 1} />
                </motion.div>
              ))}
            </div>
          ) : (
            // Empty state — no ranked profiles yet (or RPC not applied). Still an invitation.
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
              className="surface-1 rounded-xl card-padding"
            >
              <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Icon name="Coffee" size={20} />
                </div>
                <Stack gap="2" className="items-center">
                  <h3 className="text-heading">Be the first name here</h3>
                  <p className="max-w-sm text-pretty text-body leading-relaxed text-muted-foreground">
                    Rate the coffees you&apos;ve tried and your profile climbs
                    the board — a personal record, not a leaderboard to win.
                  </p>
                </Stack>
                <ProfileCta />
              </div>
            </motion.div>
          )}
        </Stack>
      </Section>
    </MotionConfig>
  );
}
