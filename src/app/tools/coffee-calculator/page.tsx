// src/app/tools/coffee-calculator/page.tsx
// Enhanced version with improved UX and micro-interactions

import Image from "next/image";
import Link from "next/link";
import { FAQ } from "@/components/common/FAQ";
import { Icon } from "@/components/common/Icon";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeeCalculatorContainer } from "@/components/tools/CoffeeCalculatorContainer";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateFAQSchema, generateHowToSchema } from "@/lib/seo/schema";

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

const calculatorFAQSchema = generateFAQSchema([
  {
    question: "What is the golden ratio for coffee brewing?",
    answer:
      "The golden ratio is 1:15 to 1:17 (1 gram coffee to 15-17 grams water), recommended by the Specialty Coffee Association. This translates to about 60-70g coffee per liter of water.",
  },
  {
    question: "How do I calculate coffee ratios for different brewing methods?",
    answer:
      "Different methods use different ratios: Pour over 1:15-1:17, French press 1:12-1:15, Espresso 1:2-1:3, Cold brew 1:4-1:8. Our calculator automatically adjusts for each method.",
  },
  {
    question: "Why does grind size matter for coffee ratios?",
    answer:
      "Grind size affects extraction speed. Finer grinds extract faster and may need coarser adjustments or shorter brew times. Coarser grinds need longer extraction times or stronger ratios.",
  },
  {
    question: "How accurate should my coffee measurements be?",
    answer:
      "Use a digital scale accurate to 0.1g for best results. Volumetric measurements (scoops, tablespoons) are inconsistent because coffee density varies by roast level and origin.",
  },
  {
    question: "What water temperature should I use for different roasts?",
    answer:
      "Light roasts: 95-100°C for full extraction, Medium roasts: 90-93°C for balanced flavor, Dark roasts: 87-90°C to avoid over-extraction and bitterness.",
  },
]);

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
    <>
      {/* Structured Data */}
      <StructuredData schema={calculatorHowToSchema} />
      <StructuredData schema={calculatorFAQSchema} />
      <StructuredData schema={calculatorToolSchema} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Enhanced Hero Section */}
        <section className="hero-wrapper">
          <Image
            alt="Coffee brewing setup"
            className="object-cover"
            fill
            priority
            src="/mocks/images/hero-bg.png"
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            {/* Hero badge - matching your LearnDirectoryHeader pattern */}
            <div className="mb-8 inline-flex animate-fade-in-scale items-center">
              <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm">
                  <Icon className="text-accent" name="Calculator" size={16} />
                  <span className="text-white/90">
                    Perfect Coffee Ratios & Brewing Timer
                  </span>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                </div>
              </div>
            </div>

            <h1 className="mb-6 animate-fade-in-scale text-display text-white delay-100">
              Perfect Brew Calculator
            </h1>

            <p className="mb-8 max-w-2xl animate-fade-in-scale text-white/90 text-xl leading-relaxed delay-200">
              Master your brewing technique with our step-by-step guide and
              precision calculator. Get perfect ratios, timing, and expert tips
              for every method.
            </p>

            {/* Feature highlights - using glass-panel properly */}
            <div className="glass-panel mx-auto mb-8 max-w-2xl animate-fade-in-scale rounded-2xl border border-white/20 p-6 delay-300">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="group flex items-center gap-2 text-white transition-colors hover:text-white/80">
                  <div className="h-3 w-3 rounded-full bg-primary shadow-sm transition-transform duration-300 group-hover:scale-125" />
                  <span className="font-medium drop-shadow-sm">
                    11 Brewing Methods
                  </span>
                </div>
                <div className="group flex items-center gap-2 text-white transition-colors hover:text-white/80">
                  <div className="h-3 w-3 rounded-full bg-accent shadow-sm transition-transform duration-300 group-hover:scale-125" />
                  <span className="font-medium drop-shadow-sm">
                    Interactive Timer
                  </span>
                </div>
                <div className="group flex items-center gap-2 text-white transition-colors hover:text-white/80">
                  <div className="h-3 w-3 rounded-full bg-chart-2 shadow-sm transition-transform duration-300 group-hover:scale-125" />
                  <span className="font-medium drop-shadow-sm">
                    Expert Tips
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons - matching your LearnDirectoryHeader pattern */}
            <div className="flex animate-fade-in-scale flex-col items-center justify-center gap-4 delay-400 sm:flex-row">
              <Button
                asChild
                className="btn-primary hover-lift group"
                size="lg"
              >
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
            </div>
          </div>
        </section>

        {/* Calculator Tool Section with scroll anchor */}
        <section className="section-spacing" id="calculator">
          <div className="container-default">
            {/* Enhanced glass modal with better visual hierarchy */}
            <div className="glass-panel card-padding relative rounded-3xl">
              {/* More sophisticated decorative elements */}
              <div className="-z-10 pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
              <div className="-z-10 pointer-events-none absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              <div className="-z-10 pointer-events-none absolute top-1/2 left-1/4 h-16 w-16 rounded-full bg-chart-2/5 blur-xl" />

              <div className="relative">
                <div className="mb-8 text-center">
                  <h2 className="mb-4 text-primary text-title">
                    Interactive Coffee Calculator
                  </h2>
                  <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
                  <p className="mx-auto max-w-lg text-muted-foreground">
                    Select your method, adjust strength, and get precise
                    measurements with real-time brewing guidance.
                  </p>
                </div>
                <CoffeeCalculatorContainer />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="section-spacing">
          <div className="container-default">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-primary text-title">
                Why Use Our Calculator?
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Take the guesswork out of coffee brewing with precise
                calculations, real-time guidance, and professional techniques.
              </p>
            </div>

            <div className="glass-panel card-padding rounded-2xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="glass-card card-padding card-hover group text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <Icon
                      className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110"
                      name="Calculator"
                    />
                  </div>
                  <h3 className="mb-2 text-heading transition-colors group-hover:text-accent">
                    Precise Calculations
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Get exact coffee and water measurements based on your
                    preferred strength and brewing method with real-time
                    adjustments.
                  </p>
                </div>

                <div className="glass-card card-padding card-hover group text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/20">
                    <Icon
                      className="h-6 w-6 text-accent transition-transform duration-300 group-hover:scale-110"
                      name="BookOpen"
                    />
                  </div>
                  <h3 className="mb-2 text-heading transition-colors group-hover:text-accent">
                    Method Guides
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Learn the nuances of 11 brewing methods including flavor
                    profiles, recommended roast levels, and traditional South
                    Indian filter coffee.
                  </p>
                </div>

                <div className="glass-card card-padding card-hover group text-center">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-chart-2/20">
                    <Icon
                      className="h-6 w-6 text-chart-2 transition-transform duration-300 group-hover:scale-110"
                      name="Timer"
                    />
                  </div>
                  <h3 className="mb-2 text-heading transition-colors group-hover:text-accent">
                    Interactive Timer
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Follow along with method-specific brewing timers, audio
                    notifications, and vibration alerts for perfect extraction
                    timing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Coffee Methods Overview */}
        <section className="section-spacing">
          <div className="container-default">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-primary text-title">
                Supported Brewing Methods
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
              <p className="mx-auto max-w-2xl text-muted-foreground">
                From traditional Indian filter coffee to modern specialty
                methods, our calculator supports all popular brewing techniques.
              </p>
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
                  className={`glass-card card-padding card-hover group relative text-center ${
                    method.popular ? "border-primary/30" : ""
                  }`}
                  key={method.name}
                >
                  {method.popular && (
                    <div className="-top-2 -right-2 absolute flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                  )}
                  <Icon
                    className="mx-auto mb-2 h-6 w-6 text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-accent"
                    name="Coffee"
                  />
                  <span className="font-medium text-sm transition-colors group-hover:text-accent">
                    {method.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clean FAQ Section (content-heavy, keeping minimal) */}
        <section className="section-spacing">
          <div className="container-default">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-primary text-title">
                Frequently Asked Questions
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Common questions about coffee ratios, brewing techniques, and
                our calculator.
              </p>
            </div>

            <FAQ
              items={[
                {
                  question: "What is the golden ratio for coffee brewing?",
                  answer:
                    "The golden ratio is 1:15 to 1:17 (1 gram coffee to 15-17 grams water), recommended by the Specialty Coffee Association. This translates to about 60-70g coffee per liter of water.",
                },
                {
                  question:
                    "How do I calculate coffee ratios for different brewing methods?",
                  answer:
                    "Different methods use different ratios: Pour over 1:15-1:17, French press 1:12-1:15, Espresso 1:2-1:3, Cold brew 1:4-1:8. Our calculator automatically adjusts for each method.",
                },
                {
                  question: "Why does grind size matter for coffee ratios?",
                  answer:
                    "Grind size affects extraction speed. Finer grinds extract faster and may need coarser adjustments or shorter brew times. Coarser grinds need longer extraction times or stronger ratios.",
                },
                {
                  question: "How accurate should my coffee measurements be?",
                  answer:
                    "Use a digital scale accurate to 0.1g for best results. Volumetric measurements (scoops, tablespoons) are inconsistent because coffee density varies by roast level and origin.",
                },
                {
                  question:
                    "What water temperature should I use for different roasts?",
                  answer:
                    "Light roasts: 95-100°C for full extraction, Medium roasts: 90-93°C for balanced flavor, Dark roasts: 87-90°C to avoid over-extraction and bitterness.",
                },
              ]}
            />
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="section-spacing">
          <div className="container-default">
            <div className="glass-modal card-padding relative overflow-hidden rounded-3xl">
              {/* Enhanced decorative elements */}
              <div className="absolute top-0 right-0 h-40 w-40 animate-float rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 animate-float rounded-full bg-accent/20 blur-2xl delay-700" />
              <div className="absolute top-1/3 right-1/3 h-20 w-20 animate-float rounded-full bg-chart-2/10 blur-xl delay-300" />

              <div className="relative z-10 py-8 text-center">
                <h2 className="mb-4 text-title">
                  Ready to Brew Better Coffee?
                </h2>
                <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
                <p className="mx-auto mb-8 max-w-2xl text-muted-foreground leading-relaxed">
                  Explore our directory of Indian coffee roasters and find the
                  perfect beans to use with your new brewing skills.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    asChild
                    className="glass-button hover-lift group"
                    size="lg"
                  >
                    <Link className="flex items-center gap-2" href="/roasters">
                      <Icon
                        className="h-4 w-4 transition-transform group-hover:scale-110"
                        name="MapPin"
                      />
                      Discover Roasters
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="hover-lift group backdrop-blur-sm hover:bg-background/50"
                    size="lg"
                    variant="outline"
                  >
                    <Link className="flex items-center gap-2" href="/coffees">
                      <Icon
                        className="h-4 w-4 transition-transform group-hover:scale-110"
                        name="Coffee"
                      />
                      Shop Coffee Beans
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
