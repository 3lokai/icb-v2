"use client";

import Link from "next/link";
import { ArrowRightIcon, CoffeeIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { TopProfileCard } from "@/components/cards/TopProfileCard";
import { Accent } from "@/components/primitives/accent";
import { Reveal } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";
import type { TopProfile } from "@/lib/data/fetch-top-coffee-reviewers";

type TopProfilesSectionProps = {
  profiles: TopProfile[];
};

function ProfileCta() {
  const { user, isLoading } = useAuth();
  const isAuthed = !isLoading && Boolean(user);

  return (
    <Button
      asChild
      variant={isAuthed ? "outline" : "default"}
      className="group/cta gap-2"
    >
      <Link href={isAuthed ? "/profile" : "/auth"}>
        {isAuthed ? "View your profile" : "Create your profile"}
        <Icon
          icon={ArrowRightIcon}
          size={16}
          aria-hidden
          className="pointer-events-none transition-transform group-hover/cta:translate-x-1"
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
    <Section spacing="default" ground="warm" className="overflow-hidden">
      <Stack gap="12">
        {/* Header: title + intro on the left, CTA aligned right on desktop */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
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
          </Reveal>

          {hasProfiles ? (
            <Reveal delay={0.1} className="shrink-0">
              <ProfileCta />
            </Reveal>
          ) : null}
        </div>

        {hasProfiles ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile, i) => (
              <Reveal key={profile.id} delay={Math.min(i * 0.06, 0.4)}>
                <TopProfileCard profile={profile} rank={i + 1} />
              </Reveal>
            ))}
          </div>
        ) : (
          // Empty state — no ranked profiles yet (or RPC not applied). Still an invitation.
          <Reveal className="surface-1 rounded-xl card-padding">
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Icon icon={CoffeeIcon} size={20} />
              </div>
              <Stack gap="2" className="items-center">
                <h3 className="text-heading">Be the first name here</h3>
                <p className="max-w-sm text-pretty text-body leading-relaxed text-muted-foreground">
                  Rate the coffees you&apos;ve tried and your profile climbs the
                  board — a personal record, not a leaderboard to win.
                </p>
              </Stack>
              <ProfileCta />
            </div>
          </Reveal>
        )}
      </Stack>
    </Section>
  );
}
