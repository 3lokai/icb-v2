// src/app/tools/coffee-calculator/page.tsx
// Enhanced version with improved UX and micro-interactions

import Link from "next/link";
import {
  CoffeeCalculatorFAQ,
  coffeeCalculatorFAQs,
} from "@/components/faqs/CoffeeCalculatorFAQs";
import { Icon } from "@/components/common/Icon";
import { PageHeader } from "@/components/common/PageHeader";
import { Cluster } from "@/components/primitives/cluster";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeeCalculatorContainer } from "@/components/tools/CoffeeCalculatorContainer";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateFAQSchema, generateHowToSchema } from "@/lib/seo/schema";
import { cn } from "@/lib/utils"; // Ensure cn is imported

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
    <Stack gap="1">
      {/* Structured Data */}
      <StructuredData schema={calculatorHowToSchema} />
      <StructuredData schema={calculatorFAQSchema} />
      <StructuredData schema={calculatorToolSchema} />

      {/* Page Header */}
      <PageHeader
        backgroundImage="/images/hero-bg.png"
        backgroundImageAlt="Coffee beans background"
        description="Master your brewing technique with our step-by-step guide and precision calculator. Get perfect ratios, timing, and expert tips for every method."
        overline="Perfect Coffee Ratios & Brewing Timer"
        title="Perfect Brew Calculator"
      />

      {/* Feature highlights and action buttons */}
      <Section spacing="default" className="bg-muted/20">
        <Stack gap="8" className="items-center">
          {/* Feature highlights */}
          <div className="surface-1 card-padding mx-auto max-w-3xl rounded-2xl animate-fade-in-scale">
            <Cluster
              gap="6"
              align="center"
              className="justify-center text-caption"
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
          </div>

          {/* Action buttons */}
          <Cluster
            gap="4"
            align="center"
            className="justify-center animate-fade-in-scale"
          >
            <Button asChild className="btn-primary hover-lift group" size="lg">
              <Link className="flex items-center gap-2" href="#calculator">
                <Icon
                  className="transition-transform group-hover:scale-110"
                  name="Calculator"
                  size={18}
                />
                Start Brewing
              </Link>
            </Button>
            <Button
              asChild
              className="btn-secondary hover-lift group"
              size="lg"
              variant="outline"
            >
              <Link
                className="flex items-center gap-2"
                href="/tools/expert-recipes"
              >
                <Icon
                  className="transition-transform group-hover:scale-110"
                  name="BookOpen"
                  size={18}
                />
                View Expert Recipes
              </Link>
            </Button>
          </Cluster>
        </Stack>
      </Section>

      {/* Calculator Tool Section with scroll anchor */}
      <div id="calculator">
        <Section spacing="default">
          {/* Enhanced clean modal with better visual hierarchy */}
          <div className="surface-1 card-padding relative rounded-2xl border-l-4 border-l-primary/60">
            <Stack gap="8">
              <div className="text-center">
                <Stack gap="4" className="items-center">
                  <h2 className="text-primary text-title font-serif italic">
                    Interactive Coffee Calculator
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                  <p className="mx-auto max-w-lg text-muted-foreground text-body-large">
                    Select your method, adjust strength, and get precise
                    measurements with real-time brewing guidance.
                  </p>
                </Stack>
              </div>
              <CoffeeCalculatorContainer />
            </Stack>
          </div>
        </Section>
      </div>

      {/* Enhanced Features Section */}
      <Section spacing="default">
        <Stack gap="12">
          <div className="text-center">
            <Stack gap="4" className="items-center">
              <h2 className="text-primary text-title font-serif italic">
                Why Use Our Calculator?
              </h2>
              <div className="h-px w-16 bg-accent/60" />
              <p className="mx-auto max-w-2xl text-muted-foreground text-body-large">
                Take the guesswork out of coffee brewing with precise
                calculations, real-time guidance, and professional techniques.
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
                className="surface-1 card-padding card-hover group text-center rounded-xl border border-border/40"
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
                methods, our calculator supports all popular brewing techniques.
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
      <CoffeeCalculatorFAQ />
      {/* Enhanced CTA Section */}
      <Section spacing="loose">
        <div className="surface-1 relative overflow-hidden rounded-2xl border border-border/40 p-8 md:p-12">
          {/* Subtle background pattern instead of blurs */}
          <div className="absolute inset-0 bg-accent/5 opacity-50" />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <Stack gap="6" className="items-center">
              <h2 className="text-primary text-title font-serif italic">
                Ready to Brew Better Coffee?
              </h2>
              <p className="text-muted-foreground text-body-large">
                Join thousands of coffee enthusiasts who use our calculator
                daily. Explore our directory to find the best beans for your
                next brew.
              </p>

              <Cluster gap="4" align="center" className="justify-center">
                <Button asChild className="btn-primary hover-lift" size="lg">
                  <Link href="/coffees">Browse Coffee Beans</Link>
                </Button>
                <Button
                  asChild
                  className="btn-secondary hover-lift"
                  size="lg"
                  variant="outline"
                >
                  <Link href="/roasters">Find Roasters</Link>
                </Button>
              </Cluster>
            </Stack>
          </div>
        </div>
      </Section>
    </Stack>
  );
}
