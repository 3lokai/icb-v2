// src/app/(main)/tools/coffee-compass/page.tsx
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo/metadata";
import { Icon } from "@/components/common/Icon";
import { CoffeeCompassClient } from "@/components/tools/CoffeeCompassClient";
import {
  getRoastersForDropdown,
  getCoffeesForCompass,
} from "@/app/actions/forms";

export const metadata = generateMetadata({
  title: "Coffee Compass — Diagnose Your Brew | IndianCoffeeBeans",
  description:
    "Fix your coffee instantly. Pick your tasting symptoms, choose your brewing method, and get precise, method-specific corrections. No AI — pure coffee science.",
  keywords: [
    "coffee compass",
    "coffee troubleshoot",
    "under-extracted coffee",
    "over-extracted coffee",
    "coffee fix sour bitter",
    "coffee tasting guide",
    "brew diagnosis",
    "coffee compass barista hustle",
    "extraction score",
    "coffee strength calculator",
  ],
  canonical: "/tools/coffee-compass",
  type: "website",
});

const compassSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Coffee Compass",
  description:
    "Deterministic coffee brew diagnosis tool. Select symptoms, get precise corrective actions for pour-over, espresso, AeroPress, French press and more.",
  url: "https://www.indiancoffeebeans.com/tools/coffee-compass",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  featureList: [
    "Symptom-to-extraction scoring",
    "Method-specific corrective actions",
    "Roast-aware guardrails",
    "Uneven extraction detection",
    "Visual extraction wheel position",
    "Recommended move vector",
  ],
};

const howItWorksSteps = [
  {
    icon: "Target",
    title: "Pick Your Symptoms",
    desc: "Select what you taste — sour, bitter, watery, heavy. Choose as many as apply.",
  },
  {
    icon: "Coffee",
    title: "Choose Your Method",
    desc: "Pour-over, espresso, AeroPress, French press — the engine tailors advice to your gear.",
  },
  {
    icon: "Compass",
    title: "Get Precise Fixes",
    desc: "Instantly see your extraction position and method-specific corrective actions. No guessing.",
  },
];

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CoffeeCompassPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const coffeeId =
    typeof params.coffeeId === "string" ? params.coffeeId : undefined;

  const [roastersResult, coffeesResult] = await Promise.all([
    getRoastersForDropdown(),
    getCoffeesForCompass(),
  ]);

  const roasters =
    Array.isArray(roastersResult) && !("error" in roastersResult)
      ? roastersResult.map((r) => ({ id: r.id, name: r.name }))
      : [];
  const coffees =
    Array.isArray(coffeesResult) && !("error" in coffeesResult)
      ? coffeesResult
      : [];

  return (
    <div className="pb-20">
      <StructuredData schema={compassSchema} />

      <PageHeader
        backgroundImage="/images/hero-recipes.avif"
        backgroundImageAlt="Coffee Compass"
        description="Tell us what you taste. We'll tell you what went wrong and exactly how to fix it."
        overline="Brew Diagnosis Tool"
        title="Coffee Compass"
      />

      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <Stack gap="12">
          {/* Main Tool Card */}
          <div
            className="bg-background rounded-3xl p-6 md:p-10 border border-border/50 shadow-xl overflow-hidden"
            id="compass"
          >
            <Stack gap="8">
              {/* Header bar */}
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between pb-8 border-b border-border/40">
                <div className="flex flex-wrap items-center gap-6 text-caption">
                  {[
                    { color: "bg-primary", label: "Deterministic Engine" },
                    { color: "bg-accent", label: "No AI / No API" },
                    { color: "bg-chart-2", label: "Method-Aware" },
                  ].map((feat) => (
                    <div
                      key={feat.label}
                      className="group flex items-center gap-2 transition-colors hover:text-primary"
                    >
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${feat.color} shadow-sm transition-transform duration-300 group-hover:scale-125`}
                      />
                      <span className="font-medium">{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Component (interactive) */}
              <div className="pt-2">
                <Stack gap="8">
                  <div className="text-center">
                    <h2 className="text-primary text-title font-serif italic mb-2">
                      Diagnose Your Brew
                    </h2>
                    <p className="mx-auto max-w-lg text-muted-foreground text-body-large">
                      Select your symptoms and brewing method to pinpoint
                      exactly what needs to change.
                    </p>
                  </div>
                  <CoffeeCompassClient
                    roasters={roasters}
                    coffees={coffees}
                    initialCoffeeId={coffeeId}
                  />
                </Stack>
              </div>
            </Stack>
          </div>

          {/* How it works */}
          <Section spacing="tight">
            <Stack gap="12">
              <div className="text-center">
                <Stack gap="4" className="items-center">
                  <h2 className="text-primary text-title font-serif italic">
                    How It Works
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                  <p className="mx-auto max-w-2xl text-muted-foreground text-body-large">
                    Pure coffee physics — no AI, no guesswork. The same model
                    Barista Hustle uses to build their compass.
                  </p>
                </Stack>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {howItWorksSteps.map((step) => (
                  <div
                    key={step.title}
                    className="surface-1 card-padding card-hover group text-center rounded-2xl border border-border/40"
                  >
                    <Stack gap="4" className="items-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110">
                        <Icon
                          className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110"
                          name={step.icon as any}
                        />
                      </div>
                      <Stack gap="2">
                        <h3 className="text-heading font-serif transition-colors group-hover:text-accent">
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
        </Stack>
      </div>
    </div>
  );
}
