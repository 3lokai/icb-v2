"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import type { RoasterDetail } from "@/types/roaster-types";
import type { CoffeeSummary } from "@/types/coffee-types";
import { roasterImagePresets } from "@/lib/imagekit";
import { Icon } from "@/components/common/Icon";
import { useImageColor } from "@/hooks/useImageColor";

import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import CoffeeCard from "@/components/cards/CoffeeCard";

type RoasterCoffeesSelectionPageProps = {
  roaster: RoasterDetail;
  className?: string;
};

type RoastGroup = {
  id: string;
  label: string;
  description: string;
  icon: any;
  coffees: CoffeeSummary[];
};

export function RoasterCoffeesSelectionPage({
  roaster,
  className,
}: RoasterCoffeesSelectionPageProps) {
  const logoUrl = useMemo(() => {
    if (!roaster?.slug) return null;
    return roasterImagePresets.roasterLogo(`roasters/${roaster.slug}-logo`);
  }, [roaster]);

  const { isDark } = useImageColor(logoUrl);

  const defaultBg =
    "bg-[radial-gradient(circle_at_center,var(--muted)_0%,var(--background)_100%)]";
  const darkContrastBg =
    "bg-[radial-gradient(circle_at_center,oklch(0.24_0.014_59.46)_0%,oklch(0.195_0.01_59.58)_100%)]";
  const lightContrastBg =
    "bg-[radial-gradient(circle_at_center,oklch(0.965_0.015_79.92)_0%,oklch(0.982_0.009_79.92)_100%)]";

  const logoBgClass = isDark
    ? `${darkContrastBg} dark:${defaultBg}`
    : `${defaultBg} dark:${lightContrastBg}`;

  // Grouping logic
  const groups = useMemo(() => {
    const light: CoffeeSummary[] = [];
    const medium: CoffeeSummary[] = [];
    const dark: CoffeeSummary[] = [];
    const other: CoffeeSummary[] = [];

    roaster.coffees.forEach((coffee) => {
      const level = coffee.roast_level;
      if (level === "light" || level === "light_medium") {
        light.push(coffee);
      } else if (level === "medium") {
        medium.push(coffee);
      } else if (level === "medium_dark" || level === "dark") {
        dark.push(coffee);
      } else {
        other.push(coffee);
      }
    });

    const result: RoastGroup[] = [];

    if (light.length > 0) {
      result.push({
        id: "light",
        label: "Light",
        description:
          "Bright, acidic, and complex profiles that highlight the bean's origin flavors.",
        icon: "Sun",
        coffees: light,
      });
    }

    if (medium.length > 0) {
      result.push({
        id: "medium",
        label: "Medium",
        description:
          "Balanced body and acidity, bringing out sweetness and caramelization.",
        icon: "CloudSun",
        coffees: medium,
      });
    }

    if (dark.length > 0) {
      result.push({
        id: "dark",
        label: "Dark",
        description:
          "Bold, rich, and intense flavors with low acidity and deep chocolate notes.",
        icon: "Moon",
        coffees: dark,
      });
    }

    if (other.length > 0) {
      result.push({
        id: "other",
        label: "Unique",
        description:
          "Special releases, blends, and unique roasts outside the standard spectrum.",
        icon: "Sparkle",
        coffees: other,
      });
    }

    return result;
  }, [roaster.coffees]);

  return (
    <div className={cn("w-full bg-background min-h-screen", className)}>
      {/* Hero Section */}
      <Section
        spacing="default"
        className="pt-10 md:pt-16 pb-0 md:pb-0 lg:pb-0"
        contained
      >
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pb-16 border-b border-border/40">
          <div
            className={cn(
              "relative aspect-square w-32 md:w-40 overflow-hidden rounded-2xl border border-border/60 shadow-sm transition-transform hover:scale-105 duration-500",
              logoBgClass
            )}
          >
            {roaster.slug ? (
              <Image
                alt={`${roaster.name} logo`}
                className="object-contain p-4"
                fill
                priority
                src={roasterImagePresets.roasterLogo(
                  `roasters/${roaster.slug}-logo`
                )}
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
                <Icon name="Storefront" size={42} />
              </div>
            )}
          </div>

          <Stack gap="4" className="text-center md:text-left flex-1">
            <Stack gap="2">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="h-px w-6 bg-accent/60" />
                <p className="text-overline text-muted-foreground tracking-[0.15em]">
                  Roaster Collection
                </p>
              </div>
              <h1 className="text-display font-serif leading-[1.1] tracking-tight">
                {roaster.name}&apos;s{" "}
                <span className="text-accent italic">Selection.</span>
              </h1>
            </Stack>

            <p className="text-body-large text-muted-foreground max-w-2xl">
              Explore the full catalog of specialty coffees from {roaster.name}.
              Curated for quality, roasted for character.
            </p>

            <Cluster gap="3" className="justify-center md:justify-start pt-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="rounded-full"
              >
                <Link href={`/roasters/${roaster.slug}`}>
                  <Icon name="ArrowLeft" size={14} className="mr-2" />
                  Back to Profile
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="rounded-full text-muted-foreground"
              >
                <Link href="/coffees">Explore All Roasters</Link>
              </Button>
            </Cluster>
          </Stack>
        </div>
      </Section>

      {/* Grouped Content */}
      <div className="pb-24">
        {groups.length > 0 ? (
          groups.map((group) => (
            <Section
              key={group.id}
              id={group.id}
              spacing="default"
              className="scroll-mt-32 border-b border-border/40 last:border-b-0"
              contained
            >
              <Stack gap="12">
                {/* Group Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <Stack gap="4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-accent/10 text-accent">
                          <Icon name={group.icon as any} size={20} />
                        </div>
                        <p className="text-overline text-muted-foreground tracking-[0.15em]">
                          {group.coffees.length} Available
                        </p>
                      </div>
                      <h2 className="text-title font-serif leading-tight">
                        <span className="text-accent italic">
                          {group.label}
                        </span>{" "}
                        Roasts.
                      </h2>
                    </div>
                    <p className="text-body text-muted-foreground max-w-xl">
                      {group.description}
                    </p>
                  </Stack>
                </div>

                {/* Coffee Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {group.coffees.map((coffee) => (
                    <CoffeeCard key={coffee.coffee_id} coffee={coffee} />
                  ))}
                </div>
              </Stack>
            </Section>
          ))
        ) : (
          <Section contained spacing="loose">
            <div className="py-20 text-center bg-card/40 backdrop-blur-[2px] rounded-3xl border border-dashed border-border/60">
              <Icon
                name="Coffee"
                size={48}
                className="mx-auto mb-4 text-muted-foreground/40"
              />
              <h2 className="text-heading mb-2">No coffees found</h2>
              <p className="text-muted-foreground max-w-sm mx-auto">
                We currently don&apos;t have any active coffees listed for{" "}
                {roaster.name}. Check back soon for their latest roasts.
              </p>
            </div>
          </Section>
        )}
      </div>

      {/* Footer CTA */}
      <Section
        spacing="loose"
        className="bg-muted/30 border-t border-border/40 text-center"
        contained
      >
        <Stack gap="8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-3">
              <span className="h-px w-6 bg-accent/60" />
              <p className="text-overline text-muted-foreground tracking-[0.15em]">
                Discover More
              </p>
              <span className="h-px w-6 bg-accent/60" />
            </div>
            <h3 className="text-display font-serif leading-tight">
              Explore the <span className="text-accent italic">Directory.</span>
            </h3>
          </div>

          <p className="text-body-large text-muted-foreground max-w-md mx-auto">
            Discover exceptional beans from over 100+ specialty roasters across
            India in our full directory.
          </p>

          <div className="flex justify-center pt-4">
            <Button size="lg" asChild className="rounded-full px-8 hover-lift">
              <Link href="/coffees">
                Browse All Coffees
                <Icon name="ArrowRight" size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </Stack>
      </Section>
    </div>
  );
}
