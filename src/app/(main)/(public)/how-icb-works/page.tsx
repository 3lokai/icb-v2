// src/app/(main)/(public)/how-icb-works/page.tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import { Prose } from "@/components/primitives/prose";
import Link from "next/link";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo/metadata";
import {
  howICBWorksBreadcrumbSchema,
  howICBWorksPageSchema,
} from "@/lib/seo/schema";

export const metadata: Metadata = generateMetadata({
  title:
    "How IndianCoffeeBeans Works | Discovery, Reviews & Rankings Explained",
  description:
    "How IndianCoffeeBeans works — from structured coffee data and reviews to transparent discovery, rankings, and verification. No ads. No commissions.",
  keywords: ["how it works", "coffee directory", "transparency", "neutrality"],
  canonical: "/how-icb-works",
});

export default function HowICBWorksPage() {
  return (
    <>
      <StructuredData
        schema={[howICBWorksPageSchema, howICBWorksBreadcrumbSchema]}
      />
      <PageHeader
        overline="Transparency & Neutrality"
        title={
          <>
            How <span className="text-accent italic">IndianCoffeeBeans</span>{" "}
            Works
          </>
        }
        description="A clear, factual breakdown of what this platform is, how it operates, and why it remains independent."
      />

      <div className="container mx-auto px-4 -mt-20 relative z-30 pb-20">
        <Stack gap="16">
          {/* Section 1: The Essence */}
          <div className="bg-background rounded-3xl p-8 md:p-12 border border-border/50 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <Stack gap="4">
                  <h2 className="text-title text-primary italic">
                    The Essence
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                  <p className="text-body-large text-muted-foreground">
                    IndianCoffeeBeans.com is a specialized discovery
                    infrastructure for the Indian coffee ecosystem.
                  </p>
                </Stack>
              </div>
              <div className="lg:col-span-7">
                <Prose className="max-w-none">
                  <h3>What it is</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <li>A structured platform to discover, rate, and review</li>
                    <li>A tool to compare across taste, process, and roast</li>
                    <li>A long-term reference layer for coffee culture</li>
                    <li>Neutral, data-driven, and independent</li>
                  </ul>

                  <h3>What it is not</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 opacity-80">
                    <li>Not a marketplace or retailer</li>
                    <li>Not an ad platform</li>
                    <li>Not a "best coffee" curated list</li>
                    <li>Not influencer-driven or pay-to-rank</li>
                  </ul>

                  <div className="mt-8 rounded-xl border border-accent/20 border-l-4 border-l-accent bg-accent/5 p-6">
                    <p className="font-serif text-body-large text-accent-foreground leading-relaxed">
                      IndianCoffeeBeans does not sell coffee, run ads, or
                      promote brands algorithmically.
                    </p>
                  </div>
                </Prose>
              </div>
            </div>
          </div>

          {/* Section 2: How Discovery Works */}
          <Section spacing="default">
            <Stack gap="12">
              <Stack gap="4">
                <span className="text-micro font-bold uppercase tracking-widest text-accent">
                  Discovery
                </span>
                <h2 className="text-title text-primary">How Discovery Works</h2>
                <div className="h-px w-16 bg-accent/60" />
              </Stack>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <Stack gap="4">
                  <h3 className="text-heading text-primary font-serif italic">
                    1. Structured Coffee Data
                  </h3>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    Each coffee is documented using consistent attributes:
                    Origin, Region, Process, Roast, Profile, and Brew
                    compatibility. This allows for meaningful comparison across
                    roasters — not just brand pages.{" "}
                    <Link
                      href="/coffees"
                      className="text-accent hover:underline font-medium"
                    >
                      Explore the database.
                    </Link>
                  </p>
                </Stack>
                <Stack gap="4">
                  <h3 className="text-heading text-primary font-serif italic">
                    2. Ratings & Reviews
                  </h3>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    Users rate individual coffees based on taste and results,
                    and roasters based on ordering and consistency. Reviews are
                    tied to actual coffees, not vague brand hype.
                  </p>
                </Stack>
                <Stack gap="4">
                  <h3 className="text-heading text-primary font-serif italic">
                    3. Signal-Based Filters
                  </h3>
                  <p className="text-caption text-muted-foreground leading-relaxed">
                    Discovery is built around how people actually choose coffee:
                    brew method, flavor, roast, and region. There are no
                    "featured because paid" shortcuts.
                  </p>
                </Stack>
              </div>
            </Stack>
          </Section>

          {/* Section 3: Rankings & Neutrality */}
          <div className="bg-muted/5 rounded-3xl p-8 md:p-12 border border-border/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <Stack gap="6">
                <h2 className="text-title text-primary italic">
                  How Rankings Work
                </h2>
                <Prose>
                  <p>
                    There are no paid rankings on IndianCoffeeBeans. Coffee and
                    roaster visibility is driven entirely by:
                  </p>
                  <ul>
                    <li>Completeness of technical information</li>
                    <li>Community interaction (ratings, reviews, saves)</li>
                    <li>User-driven search and filter relevance</li>
                  </ul>
                  <p className="text-accent font-medium">
                    Paid partnerships do not influence ordering, scores, or
                    recommendations.
                  </p>
                </Prose>
              </Stack>

              <Stack gap="6">
                <h2 className="text-title text-primary italic">
                  What "Verified" Means
                </h2>
                <Prose>
                  <p>
                    Some roasters choose to become{" "}
                    <strong>Verified Partners</strong>. This indicates an active
                    partnership where they can claim and manage their profile
                    and support the platform financially.
                  </p>
                  <p className="text-muted-foreground italic">
                    Verification does not mean:
                  </p>
                  <ul className="text-caption">
                    <li>Better rankings or boosted visibility</li>
                    <li>Preferential treatment in search</li>
                    <li>Editorial endorsement or quality guarantee</li>
                  </ul>
                </Prose>
              </Stack>
            </div>
          </div>

          {/* Section 4: For Whom */}
          <Section spacing="default">
            <Stack gap="12" className="items-center text-center">
              <Stack gap="4" className="items-center">
                <h2 className="text-title text-primary italic">
                  For Whom is ICB Built?
                </h2>
                <div className="h-px w-24 bg-accent/40" />
              </Stack>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                {[
                  {
                    title: "Home Brewers",
                    desc: "Exploring the vast world of Indian beans.",
                  },
                  {
                    title: "Enthusiasts",
                    desc: "Comparing technical specs across roasters.",
                  },
                  {
                    title: "Data-Driven Buyers",
                    desc: "Wanting substance over marketing noise.",
                  },
                  {
                    title: "Quality Roasters",
                    desc: "Looking for a neutral place to be represented.",
                  },
                ].map((item) => (
                  <Stack
                    gap="2"
                    key={item.title}
                    className="p-6 rounded-2xl border border-border/20 bg-card/5"
                  >
                    <h3 className="text-heading text-primary font-serif italic text-body">
                      {item.title}
                    </h3>
                    <p className="text-caption text-muted-foreground">
                      {item.desc}
                    </p>
                  </Stack>
                ))}
              </div>
            </Stack>
          </Section>

          {/* Section 5: The Long View */}
          <Section
            spacing="default"
            className="border-t border-border/50 pt-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <Stack gap="4">
                  <h2 className="text-title text-primary italic">
                    The Long View
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                </Stack>
              </div>
              <div className="lg:col-span-7">
                <Prose className="max-w-none">
                  <p className="text-body-large">
                    Specialty coffee in India has grown faster than the tools to
                    understand it. ICB exists to reduce noise, improve
                    discovery, and build a long-term public resource.
                  </p>
                  <p>
                    We are building infrastructure, not a campaign. Over time,
                    we aim to document every region and estate, and serve as the
                    definitive reference layer for the Indian coffee landscape.
                  </p>
                </Prose>
              </div>
            </div>
          </Section>

          {/* Section 6: Trust as a Feature */}
          <Section
            spacing="default"
            className="border-t border-border/50 pt-16"
          >
            <Stack gap="12" className="items-center text-center">
              <Stack gap="4" className="items-center">
                <span className="text-micro font-bold uppercase tracking-[0.2em] text-accent">
                  The Protocol
                </span>
                <h2 className="text-display text-primary italic">
                  Transparency & Trust
                </h2>
              </Stack>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
                {[
                  {
                    title: "No Commissions",
                    desc: "Discovery is the goal, not a sales cut.",
                  },
                  {
                    title: "No Sponsored Rankings",
                    desc: "Scores are earned, never bought.",
                  },
                  {
                    title: "No Native Ads",
                    desc: "A clean interface focused on the bean.",
                  },
                ].map((item) => (
                  <Stack
                    gap="2"
                    key={item.title}
                    className="p-6 rounded-2xl border border-border/20 bg-muted/5 transition-colors hover:bg-muted/10"
                  >
                    <h3 className="text-heading text-primary font-serif italic text-body-large">
                      {item.title}
                    </h3>
                    <p className="text-caption text-muted-foreground">
                      {item.desc}
                    </p>
                  </Stack>
                ))}
              </div>

              <p className="text-body-large italic max-w-2xl text-muted-foreground">
                &quot;Trust is a feature. We don’t optimize it away.&quot;
              </p>
            </Stack>
          </Section>

          {/* Final Editorial Note */}
          <div className="text-center py-12">
            <p className="text-micro font-bold uppercase tracking-[0.2em] text-muted-foreground italic">
              Built for the community, powered by data.
            </p>
          </div>
        </Stack>
      </div>
    </>
  );
}
