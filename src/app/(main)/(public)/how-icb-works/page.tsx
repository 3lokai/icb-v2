// src/app/(main)/(public)/how-icb-works/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accent } from "@/components/primitives/accent";
import { Band } from "@/components/primitives/band";
import { Decor } from "@/components/primitives/decor";
import { Prose } from "@/components/primitives/prose";
import { Reveal } from "@/components/primitives/reveal";
import { Stack } from "@/components/primitives/stack";
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
    "How IndianCoffeeBeans works, from structured coffee data and reviews to transparent discovery, rankings, and verification. No ads. No commissions.",
  keywords: [
    "how IndianCoffeeBeans works",
    "independent coffee directory",
    "coffee curation India",
  ],
  canonical: "/how-icb-works",
});

const discoverySteps = [
  {
    num: "1",
    title: "Structured Coffee Data",
    body: (
      <>
        Each coffee is documented using consistent attributes: Origin, Region,
        Process, Roast, Profile, and Brew compatibility. This allows for
        meaningful comparison across roasters, not just brand pages.{" "}
        <Link
          href="/coffees"
          className="font-medium text-primary hover:underline"
        >
          Explore the database.
        </Link>
      </>
    ),
  },
  {
    num: "2",
    title: "Ratings & Reviews",
    body: "Users rate individual coffees based on taste and results, and roasters based on ordering and consistency. Reviews are tied to actual coffees, not vague brand hype.",
  },
  {
    num: "3",
    title: "Signal-Based Filters",
    body: 'Discovery is built around how people actually choose coffee: brew method, flavor, roast, and region. There are no "featured because paid" shortcuts.',
  },
];

const audiences = [
  { title: "Home Brewers", desc: "Exploring the vast world of Indian beans." },
  { title: "Enthusiasts", desc: "Comparing technical specs across roasters." },
  {
    title: "Data-Driven Buyers",
    desc: "Wanting substance over marketing noise.",
  },
  {
    title: "Quality Roasters",
    desc: "Looking for a neutral place to be represented.",
  },
];

const trustPledges = [
  { title: "No Commissions", desc: "Discovery is the goal, not a sales cut." },
  { title: "No Sponsored Rankings", desc: "Scores are earned, never bought." },
  { title: "No Native Ads", desc: "A clean interface focused on the bean." },
];

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
            How <Accent>IndianCoffeeBeans</Accent> Works
          </>
        }
        description="A clear, factual breakdown of what this platform is, how it operates, and why it remains independent."
      />

      {/* The Essence — floated card lifting over the hero */}
      <div className="container relative z-30 mx-auto -mt-20 px-4">
        <Reveal>
          <div className="rounded-3xl border border-border/60 bg-background p-8 shadow-xl md:p-12">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Stack gap="4">
                  <h2 className="text-title">The Essence</h2>
                  <p className="text-body-large text-muted-foreground">
                    IndianCoffeeBeans.com is a specialized discovery
                    infrastructure for the Indian coffee ecosystem.
                  </p>
                </Stack>
              </div>
              <div className="lg:col-span-7">
                <Prose className="max-w-none">
                  <h3>What it is</h3>
                  <ul className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                    <li>A structured platform to discover, rate, and review</li>
                    <li>A tool to compare across taste, process, and roast</li>
                    <li>A long-term reference layer for coffee culture</li>
                    <li>Neutral, data-driven, and independent</li>
                  </ul>

                  <h3>What it is not</h3>
                  <ul className="grid grid-cols-1 gap-x-8 opacity-80 md:grid-cols-2">
                    <li>Not a marketplace or retailer</li>
                    <li>Not an ad platform</li>
                    <li>Not a &quot;best coffee&quot; curated list</li>
                    <li>Not influencer-driven or pay-to-rank</li>
                  </ul>

                  <div className="relative mt-8 overflow-hidden rounded-xl border border-accent/30 bg-accent/5 p-6">
                    <Decor stripe />
                    <p className="relative font-serif text-body-large leading-relaxed text-accent-foreground">
                      IndianCoffeeBeans does not sell coffee, run ads, or
                      promote brands algorithmically.
                    </p>
                  </div>
                </Prose>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* How Discovery Works — cream ground; the spec card carries the surface */}
      <Band ground="cream" maxWidth="6xl">
        <Stack gap="8">
          <Reveal>
            <Stack gap="3" className="max-w-2xl">
              <h2 className="text-title">How Discovery Works</h2>
              <p className="text-body text-muted-foreground">
                Three layers turn scattered brand pages into something you can
                actually compare.
              </p>
            </Stack>
          </Reveal>

          <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
            {discoverySteps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.06}>
                <Stack gap="3">
                  <div className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="text-heading text-primary"
                    >
                      {step.num}
                    </span>
                    <h3 className="text-heading">{step.title}</h3>
                  </div>
                  <p className="text-body leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </Stack>
              </Reveal>
            ))}
          </div>

          {/* Proof: a real coffee record, straight from a live product page */}
          <Reveal>
            <figure className="mx-auto max-w-3xl space-y-4">
              <figcaption className="flex items-baseline justify-between gap-4">
                <h3 className="text-heading">
                  What one coffee record looks like
                </h3>
                <span className="text-label">From a live product page</span>
              </figcaption>

              <div className="overflow-hidden rounded-xl border border-border/60 shadow-sm">
                <Image
                  src="/images/screens/production-details.avif"
                  alt="A coffee's production details on ICB — roast, process, region, species, suggested brew methods, and tags, each as a structured field."
                  width={884}
                  height={379}
                  className="h-auto w-full"
                  sizes="(min-width: 768px) 48rem, 100vw"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-border/60 shadow-sm">
                  <Image
                    src="/images/screens/flavor-map.avif"
                    alt="The flavor profile radar for a coffee, mapping acidity, sweetness, body, bitterness, aftertaste, and clarity."
                    width={982}
                    height={573}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 24rem, 100vw"
                  />
                </div>
                <div className="overflow-hidden rounded-xl border border-border/60 shadow-sm">
                  <Image
                    src="/images/screens/pricing-details.avif"
                    alt="Pricing and availability for a coffee — bag size, grind setting for each brew method, current price, and stock status."
                    width={764}
                    height={372}
                    className="h-auto w-full"
                    sizes="(min-width: 768px) 24rem, 100vw"
                  />
                </div>
              </div>
            </figure>
          </Reveal>
        </Stack>
      </Band>

      {/* How Rankings Work / What Verified Means — warm band, prose only */}
      <Band ground="warm" texture="grain" maxWidth="6xl">
        <Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <Stack gap="6">
              <h2 className="text-title">How Rankings Work</h2>
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
                <p className="font-medium text-foreground">
                  Paid partnerships do not influence ordering, scores, or
                  recommendations.
                </p>
              </Prose>
            </Stack>

            <Stack gap="6">
              <h2 className="text-title">What &quot;Verified&quot; Means</h2>
              <Prose>
                <p>
                  Some roasters choose to become{" "}
                  <strong>Verified Partners</strong>. This indicates an active
                  partnership where they can claim and manage their profile and
                  support the platform financially.
                </p>
                <p className="italic text-muted-foreground">
                  Verification does not mean:
                </p>
                <ul>
                  <li>Better rankings or boosted visibility</li>
                  <li>Preferential treatment in search</li>
                  <li>Editorial endorsement or quality guarantee</li>
                </ul>
              </Prose>
            </Stack>
          </div>
        </Reveal>
      </Band>

      {/* For Whom — cream band, surface cards pop */}
      <Band ground="cream" maxWidth="7xl">
        <Stack gap="8" className="items-center text-center">
          <Reveal>
            <h2 className="text-title">For Whom is ICB Built?</h2>
          </Reveal>

          <div className="grid w-full grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <Stack
                  gap="2"
                  className="h-full rounded-2xl border border-border/60 bg-card p-6"
                >
                  <h3 className="text-heading">{item.title}</h3>
                  <p className="text-caption text-muted-foreground">
                    {item.desc}
                  </p>
                </Stack>
              </Reveal>
            ))}
          </div>
        </Stack>
      </Band>

      {/* The Long View — warm band, prose only; carries the developer CTA */}
      <Band
        ground="warm"
        texture="grain-coarse"
        maxWidth="6xl"
        className="py-16 md:py-24"
      >
        <Reveal>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-title">The Long View</h2>
            </div>
            <div className="lg:col-span-7">
              <Prose className="max-w-none">
                <p className="text-body-large">
                  Specialty coffee in India has grown faster than the tools to
                  understand it. ICB exists to reduce noise, improve discovery,
                  and build a long-term public resource.
                </p>
                <p>
                  We are building infrastructure, not a campaign. Over time, we
                  aim to document every region and estate, and serve as the
                  definitive reference layer for the Indian coffee landscape.
                </p>
                <p>
                  That data layer is open by design.{" "}
                  <Link
                    href="/developers"
                    className="font-medium text-primary hover:underline"
                  >
                    Explore the developer API
                  </Link>{" "}
                  to build on the same structured records that power discovery
                  here.
                </p>
              </Prose>
            </div>
          </div>
        </Reveal>
      </Band>

      {/* Transparency & Trust — cream band, surface cards pop */}
      <Band ground="cream" maxWidth="6xl">
        <Stack gap="8" className="items-center text-center">
          <Reveal>
            <h2 className="text-title">Transparency &amp; Trust</h2>
          </Reveal>

          <div className="grid w-full grid-cols-1 gap-6 text-left md:grid-cols-3">
            {trustPledges.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <Stack
                  gap="2"
                  className="h-full rounded-2xl border border-border/60 bg-card p-6 transition-colors hover:border-border"
                >
                  <h3 className="text-heading">{item.title}</h3>
                  <p className="text-caption text-muted-foreground">
                    {item.desc}
                  </p>
                </Stack>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="max-w-2xl text-body-large italic text-muted-foreground">
              &quot;Trust is a feature. We don&rsquo;t optimize it away.&quot;
            </p>
          </Reveal>
        </Stack>
      </Band>

      {/* Closing note */}
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-label text-muted-foreground">
          Built for the community, powered by data.
        </p>
      </div>
    </>
  );
}
