// src/app/tools/coffee-calculator/page.tsx
// Enhanced version with improved UX and micro-interactions

import Link from "next/link";
import {
  CoffeeCalculatorFAQ,
  coffeeCalculatorFAQs,
} from "@/components/faqs/CoffeeCalculatorFAQs";
import { Icon } from "@/components/common/Icon";
import { PageHeader } from "@/components/layout/PageHeader";
import { Cluster } from "@/components/primitives/cluster";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeeCalculatorContainer } from "@/components/tools/CoffeeCalculatorContainer";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateFAQSchema, generateHowToSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";
import ExpertRecipesCta from "../../../components/tools/ExpertRecipesCta";

// SEO Metadata (keeping your existing metadata)
export const metadata = generateMetadata({
  title: "Coffee Ratio Calculator | Perfect Brew Calculator with Timer",
  description:
    "Master coffee brewing with our interactive ratio calculator. Get precise measurements, step-by-step timer, and expert tips for pour over, French press, espresso, and 11 brewing methods.",
  keywords: [
    "coffee ratio calculator",
    "coffee brewing calculator",
    "pour over calculator",
    "coffee water ratio",
    "brewing timer",
    "coffee extraction calculator",
    "French press ratio",
    "espresso ratio",
    "Indian filter coffee",
    "coffee brewing guide",
    "specialty coffee calculator",
    "brew strength calculator",
  ],
  canonical: "/tools/coffee-calculator",
  type: "website",
});

// Your existing schemas...
const calculatorHowToSchema = generateHowToSchema({
  name: "How to Calculate Perfect Coffee Ratios",
  description:
    "Learn to calculate perfect coffee-to-water ratios for any brewing method with our step-by-step guide.",
  totalTime: "PT5M",
  equipment: [
    "Digital kitchen scale",
    "Coffee grinder",
    "Brewing device (pour over, French press, etc.)",
    "Timer",
  ],
  ingredients: ["Fresh coffee beans", "Filtered water"],
  steps: [
    {
      name: "Select Brewing Method",
      text: "Choose your preferred brewing method from pour over, French press, espresso, or other options. Each method has optimal ratio ranges.",
    },
    {
      name: "Determine Water Amount",
      text: "Decide how much coffee you want to make. Start with 300ml (10 fl oz) for a standard cup.",
    },
    {
      name: "Choose Strength Level",
      text: "Select mild (1:16-1:18), medium (1:15-1:16), or strong (1:12-1:15) based on your taste preference.",
    },
    {
      name: "Calculate Coffee Amount",
      text: "Divide water amount by ratio number. For 300ml at 1:15 ratio: 300÷15 = 20g coffee needed.",
    },
    {
      name: "Adjust Temperature",
      text: "Use appropriate water temperature: Light roast 95-100°C, Medium roast 90-93°C, Dark roast 87-90°C.",
    },
    {
      name: "Follow Timing",
      text: "Use the brewing timer for your method. Pour over: 3-4 minutes, French press: 4-5 minutes, Espresso: 25-30 seconds.",
    },
  ],
});

const calculatorFAQSchema = generateFAQSchema(coffeeCalculatorFAQs);

const calculatorToolSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Coffee Ratio Calculator",
  description:
    "Interactive coffee brewing calculator with timer and method guides for perfect coffee ratios",
  url: "https://indiancoffeebeans.com/tools/coffee-calculator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  featureList: [
    "Coffee ratio calculation for 11 brewing methods",
    "Interactive brewing timer with notifications",
    "Method-specific temperature and grind recommendations",
    "Step-by-step brewing instructions",
    "Unit conversion (ml, oz, cups)",
    "Strength adjustment (mild, medium, strong)",
  ],
};

export default function CoffeeCalculatorPage() {
  return (
    <div className="pb-20">
      {/* Structured Data */}
      <StructuredData
        schema={[
          calculatorHowToSchema,
          calculatorFAQSchema,
          calculatorToolSchema,
        ]}
      />

      {/* Page Header */}
      <PageHeader
        backgroundImage="/images/hero-recipes.avif"
        backgroundImageAlt="Coffee calculator background"
        description="Master your brewing technique with our step-by-step guide and precision calculator. Get perfect ratios, timing, and expert tips for every method."
        overline="Perfect Coffee Ratios & Brewing Timer"
        title="Perfect Brew Calculator"
      />

      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <Stack gap="12">
          {/* Overlapping Card with Calculator */}
          <div
            className="bg-background rounded-3xl p-6 md:p-10 border border-border/50 shadow-xl"
            id="calculator"
          >
            <Stack gap="8">
              {/* Feature Highlights Overlay */}
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between pb-8 border-b border-border/40">
                <Cluster
                  gap="6"
                  align="center"
                  className="justify-center md:justify-start text-caption"
                >
                  <div className="group flex items-center gap-2 transition-colors hover:text-primary">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm transition-transform duration-300 group-hover:scale-125" />
                    <span className="font-medium">11 Brewing Methods</span>
                  </div>
                  <div className="group flex items-center gap-2 transition-colors hover:text-accent">
                    <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-sm transition-transform duration-300 group-hover:scale-125" />
                    <span className="font-medium">Interactive Timer</span>
                  </div>
                  <div className="group flex items-center gap-2 transition-colors hover:text-chart-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-chart-2 shadow-sm transition-transform duration-300 group-hover:scale-125" />
                    <span className="font-medium">Expert Tips</span>
                  </div>
                </Cluster>

                <Button
                  asChild
                  className="btn-secondary hover-lift group"
                  size="sm"
                  variant="outline"
                >
                  <Link
                    className="flex items-center gap-2"
                    href="/tools/expert-recipes"
                  >
                    <Icon
                      className="transition-transform group-hover:scale-110"
                      name="BookOpen"
                      size={16}
                    />
                    View Expert Recipes
                  </Link>
                </Button>
              </div>

              {/* Calculator Container */}
              <div className="pt-2">
                <Stack gap="8">
                  <div className="text-center">
                    <h2 className="text-primary text-title font-serif italic mb-2">
                      Interactive Coffee Calculator
                    </h2>
                    <p className="mx-auto max-w-lg text-muted-foreground text-body-large">
                      Select your method, adjust strength, and get precise
                      measurements with real-time brewing guidance.
                    </p>
                  </div>
                  <CoffeeCalculatorContainer />
                </Stack>
              </div>
            </Stack>
          </div>

          {/* Enhanced Features Section */}
          <Section spacing="tight">
            <Stack gap="12">
              <div className="text-center">
                <Stack gap="4" className="items-center">
                  <h2 className="text-primary text-title font-serif italic">
                    Why Use Our Calculator?
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                  <p className="mx-auto max-w-2xl text-muted-foreground text-body-large">
                    Take the guesswork out of coffee brewing with precise
                    calculations, real-time guidance, and professional
                    techniques.
                  </p>
                </Stack>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[
                  {
                    icon: "Calculator",
                    title: "Precise Calculations",
                    desc: "Get exact coffee and water measurements based on your preferred strength and brewing method.",
                    color: "text-primary",
                    bgColor: "bg-primary/10",
                  },
                  {
                    icon: "BookOpen",
                    title: "Method Guides",
                    desc: "Learn the nuances of 11 brewing methods including flavor profiles and recommended roast levels.",
                    color: "text-accent",
                    bgColor: "bg-accent/10",
                  },
                  {
                    icon: "Timer",
                    title: "Interactive Timer",
                    desc: "Follow along with method-specific brewing timers, audio notifications, and vibration alerts.",
                    color: "text-chart-2",
                    bgColor: "bg-chart-2/10",
                  },
                ].map((feature) => (
                  <div
                    className="surface-1 card-padding card-hover group text-center rounded-2xl border border-border/40"
                    key={feature.title}
                  >
                    <Stack gap="4" className="items-center">
                      <div
                        className={cn(
                          "inline-flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
                          feature.bgColor
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
                            feature.color
                          )}
                          name={feature.icon as any}
                        />
                      </div>
                      <Stack gap="2">
                        <h3
                          className={cn(
                            "text-heading font-serif transition-colors group-hover:text-accent"
                          )}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-caption leading-relaxed">
                          {feature.desc}
                        </p>
                      </Stack>
                    </Stack>
                  </div>
                ))}
              </div>
            </Stack>
          </Section>

          {/* Enhanced Coffee Methods Overview */}
          <Section spacing="default">
            <Stack gap="12">
              <div className="text-center">
                <Stack gap="4" className="items-center">
                  <h2 className="text-primary text-title font-serif italic">
                    Supported Brewing Methods
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                  <p className="mx-auto max-w-2xl text-muted-foreground text-body-large">
                    From traditional Indian filter coffee to modern specialty
                    methods, our calculator supports all popular brewing
                    techniques.
                  </p>
                </Stack>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                {[
                  { name: "Pour Over", popular: true },
                  { name: "French Press", popular: true },
                  { name: "Chemex", popular: false },
                  { name: "AeroPress", popular: true },
                  { name: "Espresso", popular: true },
                  { name: "Moka Pot", popular: false },
                  { name: "Cold Brew", popular: true },
                  { name: "Siphon", popular: false },
                  { name: "Turkish Coffee", popular: false },
                  { name: "South Indian Filter", popular: true },
                  { name: "Auto Drip", popular: false },
                ].map((method) => (
                  <div
                    className={cn(
                      "surface-1 card-padding card-hover group relative text-center rounded-xl transition-all",
                      method.popular ? "border-primary/40 bg-primary/5" : ""
                    )}
                    key={method.name}
                  >
                    {method.popular && (
                      <div className="-top-1.5 -right-1.5 absolute flex h-4 w-4 items-center justify-center rounded-full bg-primary shadow-sm ring-2 ring-background">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    )}
                    <Icon
                      className="mx-auto mb-3 h-6 w-6 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-accent"
                      name="Coffee"
                    />
                    <span className="font-medium text-caption transition-colors group-hover:text-accent">
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>
            </Stack>
          </Section>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto w-full">
            <CoffeeCalculatorFAQ />
          </div>

          {/* CTA Section */}
          <ExpertRecipesCta />
        </Stack>
      </div>
    </div>
  );
}
