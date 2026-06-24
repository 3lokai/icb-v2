// src/app/(main)/tools/grind-size-converter/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import { Icon } from "@/components/common/Icon";
import { GrindConverterFAQ } from "@/components/faqs/GrindConverterFAQs";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accent } from "@/components/primitives/accent";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { GrindConverterClient } from "@/components/tools/GrindConverterClient";
import ExpertRecipesCta from "@/components/tools/ExpertRecipesCta";
import { generateMetadata as generateBaseMetadata } from "@/lib/seo/metadata";
import { generateHowToSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

// Static canonical so the route can prerender (reading searchParams happens in
// the client island, behind a Suspense boundary).
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
  const canonicalPath = "/tools/grind-size-converter";
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  const baseMetadata = generateBaseMetadata({
    title: "Coffee Grind Size Converter & Chart",
    description:
      "Convert any brew method to a grinder setting. Pick your brew method and grinder — Timemore, 1Zpresso, Baratza, Hario — and get the clicks or numbers to dial in, plus a full grind-size chart in microns.",
    keywords: [
      "coffee grind size chart",
      "grind size converter",
      "grinder settings",
      "coffee grind size by brew method",
      "espresso grind size",
      "French press grind size",
      "pour over grind size",
      "Timemore grind settings",
      "1Zpresso grind settings",
      "Baratza Encore grind settings",
      "coffee grind microns",
    ],
    canonical: canonicalPath,
    type: "website",
  });

  return {
    ...baseMetadata,
    alternates: {
      ...baseMetadata.alternates,
      canonical: canonicalUrl,
      languages: { en: canonicalUrl, "x-default": canonicalUrl },
    },
  };
}

const grindHowToSchema = generateHowToSchema({
  name: "How to Choose the Right Grind Size for Your Coffee",
  description:
    "Match your brew method to the correct grinder setting in a few steps.",
  totalTime: "PT2M",
  equipment: ["Coffee grinder", "Brewing device"],
  steps: [
    {
      name: "Select your brew method",
      text: "Choose how you brew — espresso, V60, pour over, AeroPress, French press, cold brew and more each call for a different grind size.",
    },
    {
      name: "Select your grinder",
      text: "Pick your grinder model so the recommended setting is shown in its own units (clicks, numbers, or rotations).",
    },
    {
      name: "Read the setting and micron range",
      text: "Use the suggested click/number range as a starting point, with the particle size shown in microns.",
    },
    {
      name: "Dial in by taste",
      text: "Brew, taste, and adjust: go finer if it's sour or thin, coarser if it's bitter or harsh. Change one or two clicks at a time.",
    },
  ],
});

const grindToolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Coffee Grind Size Converter",
  description:
    "Interactive grind size chart and converter mapping brew methods to grinder settings in microns and clicks.",
  url: "https://www.indiancoffeebeans.com/tools/grind-size-converter",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  featureList: [
    "Grind size by brew method (12 methods)",
    "Per-grinder setting conversion (Timemore, 1Zpresso, Baratza, Hario)",
    "Particle size in microns",
    "Visual grind-size chart",
    "Shareable grind setups",
  ],
};

const STEPS = [
  {
    icon: "Coffee" as const,
    title: "Pick your brew",
    desc: "12 brew methods from espresso to cold brew, each with its own grind window.",
  },
  {
    icon: "Gear" as const,
    title: "Pick your grinder",
    desc: "Get the answer in your grinder's units — clicks, numbers, or rotations.",
  },
  {
    icon: "Ruler" as const,
    title: "Dial in by taste",
    desc: "Start from the suggested setting and microns, then adjust to your cup.",
  },
];

export default function GrindSizeConverterPage() {
  return (
    <div className="pb-20">
      <StructuredData schema={[grindHowToSchema, grindToolSchema]} />

      <PageHeader
        backgroundImage="/images/hero-recipes.avif"
        backgroundImageAlt="Coffee grind size converter background"
        description="Translate any brew method into a real grinder setting. Pick your method and grinder, get the clicks to dial in, and see the whole grind-size chart in microns."
        overline="Grind Size by Brew Method & Grinder"
        title="Grind Size Converter"
      />

      <div className="container mx-auto px-4 py-12 relative z-30">
        <Stack gap="8" className="gap-8 md:gap-12">
          {/* Converter */}
          <div id="converter">
            <Stack gap="8">
              <div className="border-b border-border/40 pb-8">
                <Stack gap="6">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 bg-accent/60 md:w-12" />
                    <span className="text-overline tracking-[0.15em] text-muted-foreground">
                      Grind Converter
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                    The right grind,{" "}
                    <Accent>in your grinder&apos;s units.</Accent>
                  </h2>
                  <p className="max-w-2xl text-pretty text-body-muted leading-relaxed">
                    Every grinder labels its dial differently. Pick your brew
                    method and grinder to get the setting that lands the right
                    particle size — measured in microns under the hood.
                  </p>
                </Stack>
              </div>

              <Suspense
                fallback={
                  <div className="h-96 animate-pulse rounded-xl bg-muted" />
                }
              >
                <GrindConverterClient />
              </Suspense>
            </Stack>
          </div>

          {/* How it works */}
          <Section contained={false} spacing="default">
            <Stack gap="8">
              <Stack gap="6">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 bg-accent/60 md:w-12" />
                  <span className="text-overline tracking-[0.15em] text-muted-foreground">
                    How It Works
                  </span>
                </div>
                <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                  Three steps to a <Accent>better grind.</Accent>
                </h2>
              </Stack>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {STEPS.map((step) => (
                  <div
                    className="surface-1 card-padding card-hover group text-center rounded-2xl border border-border/40"
                    key={step.title}
                  >
                    <Stack gap="4" className="items-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110">
                        <Icon
                          className={cn(
                            "h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110"
                          )}
                          name={step.icon}
                        />
                      </div>
                      <Stack gap="2">
                        <h3 className="text-heading transition-colors group-hover:text-accent">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground text-caption leading-relaxed">
                          {step.desc}
                        </p>
                      </Stack>
                    </Stack>
                  </div>
                ))}
              </div>
            </Stack>
          </Section>

          {/* FAQ */}
          <div className="max-w-4xl mx-auto w-full">
            <GrindConverterFAQ />
          </div>

          {/* CTA */}
          <ExpertRecipesCta sectionContained={false} />
        </Stack>
      </div>
    </div>
  );
}
