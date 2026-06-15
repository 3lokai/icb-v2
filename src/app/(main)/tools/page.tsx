// src/app/tools/page.tsx
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { ToolSuggestionTrigger } from "@/components/tools/ToolSuggestionModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accent } from "@/components/primitives/accent";
import { Decor } from "@/components/primitives/decor";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateCollectionPageSchema, getSeoBaseUrl } from "@/lib/seo/schema";
import { cn } from "@/lib/utils";

const TOOLS_DESCRIPTION =
  "Free coffee brewing calculators, expert recipes, and professional tools for specialty coffee enthusiasts. Perfect your brew with precision tools.";

// SEO Metadata
export const metadata = generateMetadata({
  title: "Coffee Tools & Calculators",
  description: TOOLS_DESCRIPTION,
  keywords: [
    "coffee brewing tools India",
    "free coffee tools",
    "coffee ratio calculator",
  ],
  canonical: "/tools",
  type: "website",
});

const baseUrl = getSeoBaseUrl();
const toolsUrl = `${baseUrl}/tools`;

const toolItems = [
  {
    "@type": "ListItem",
    position: 1,
    item: {
      "@type": "SoftwareApplication",
      name: "Coffee Ratio Calculator",
      url: `${baseUrl}/tools/coffee-calculator`,
      description:
        "Interactive coffee brewing calculator with timer and method guides",
    },
  },
  {
    "@type": "ListItem",
    position: 2,
    item: {
      "@type": "WebApplication",
      name: "Expert Coffee Recipes",
      url: `${baseUrl}/tools/expert-recipes`,
      description: "Championship coffee brewing recipes from world experts",
    },
  },
  {
    "@type": "ListItem",
    position: 3,
    item: {
      "@type": "WebApplication",
      name: "Coffee Compass",
      url: `${baseUrl}/tools/coffee-compass`,
      description:
        "Deterministic brew diagnosis tool: pick symptoms, get precise corrective actions",
    },
  },
];

const toolsCollectionSchema = generateCollectionPageSchema(
  "Coffee Tools & Calculators",
  TOOLS_DESCRIPTION,
  toolsUrl,
  toolItems
);

// Featured tools data
const featuredTools = [
  {
    icon: "Calculator",
    title: "Perfect Brew Calculator",
    description:
      "Master your brewing technique with step-by-step precision calculations. Get precise ratio calculations for multiple brewing methods, interactive timer, and save custom recipes.",
    href: "/tools/coffee-calculator",
    cta: "Try Calculator",
  },
  {
    icon: "Trophy",
    title: "Expert Coffee Recipes",
    description:
      "Curated recipes from championship baristas and coffee innovators. Explore 9+ professional recipes with step-by-step guides, difficulty ratings, and method variations.",
    href: "/tools/expert-recipes",
    cta: "Browse Recipes",
  },
  {
    icon: "Compass",
    title: "Coffee Compass",
    description:
      "Diagnose your brew instantly. Pick the symptoms you taste, like sour, bitter, or watery, and get precise, method-specific fixes. No AI, just coffee physics.",
    href: "/tools/coffee-compass",
    cta: "Diagnose Brew",
  },
];

// Coming soon tools data
const comingSoonTools = [
  {
    icon: "Sliders",
    title: "Grind Size Visualizer",
    description:
      "Interactive guide to perfect grind sizes for every brewing method.",
    badge: "Coming Q1 2026",
  },
  {
    icon: "Circle",
    title: "Interactive Flavor Wheel",
    description: "Map and explore coffee flavor profiles visually.",
    badge: "Coming Q1 2026",
  },
  {
    icon: "MapPin",
    title: "India Roaster Map",
    description: "Discover specialty roasters across India geographically.",
    badge: "Coming Q2 2026",
  },
  {
    icon: "Timer",
    title: "Brew Timer & Logger",
    description: "Track and improve your brews with detailed logging.",
    badge: "Coming Q2 2026",
  },
];

// Value props data
const valueProps = [
  {
    icon: "Heart",
    title: "Built by Coffee Lovers",
    description:
      "Designed with input from baristas, roasters, and enthusiasts across India.",
  },
  {
    icon: "DeviceMobile",
    title: "Mobile-First",
    description:
      "Perfect on any device. Brew from your phone, tablet, or desktop.",
  },
  {
    icon: "Gift",
    title: "Always Free",
    description:
      "Core tools remain free forever. No subscriptions, no paywalls.",
  },
];

export default function ToolsPage() {
  return (
    <div className="pb-20">
      {/* Structured Data */}
      <StructuredData schema={toolsCollectionSchema} />

      {/* Page Header */}
      <PageHeader
        backgroundImage="/images/hero-recipes.avif"
        backgroundImageAlt="Coffee tools background"
        description="Professional coffee tools and calculators to elevate your brewing game."
        overline="Professional Coffee Tools"
        title="Master Your Craft"
      />

      <Stack gap="12">
        {/* Featured Tools Grid */}
        <Section
          spacing="default"
          eyebrow="Free Forever"
          title="Start Here with"
          accentWord="Essential Tools"
        >
          <Stack gap="12">
            <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
              Our most popular tools for perfecting your brew.
            </p>

            <div className="grid-cards">
              {featuredTools.map((tool) => (
                <Card
                  key={tool.title}
                  className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110">
                        <Icon
                          className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
                          name={tool.icon as any}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-center text-heading">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-center text-caption leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <Button
                        asChild
                        className="hover-lift w-full sm:w-auto"
                        variant="default"
                      >
                        <Link href={tool.href}>
                          {tool.cta}
                          <Icon className="ml-2" name="ArrowRight" size={16} />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Stack>
        </Section>

        {/* Coming Soon Tools Section */}
        <Section spacing="default" title="More Tools" accentWord="Brewing...">
          <Stack gap="12">
            <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
              Exciting new tools are on the way to help you explore and perfect
              your coffee journey.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {comingSoonTools.map((tool) => (
                <Card
                  key={tool.title}
                  className={cn(
                    "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-md",
                    "opacity-60 border-border/30 bg-card/50"
                  )}
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted/30 transition-all duration-300 group-hover:scale-110 group-hover:bg-muted/50">
                        <Icon
                          className="h-6 w-6 text-muted-foreground"
                          name={tool.icon as any}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-center text-heading">
                      {tool.title}
                    </CardTitle>
                    <CardDescription className="text-center text-caption">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <Badge
                        variant="secondary"
                        className="text-overline border-border/50"
                      >
                        {tool.badge}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-caption text-muted-foreground">
                Have an idea for a tool? <ToolSuggestionTrigger />
              </p>
            </div>
          </Stack>
        </Section>

        {/* Why Our Tools Section */}
        <Section spacing="default" title="Why Our" accentWord="Tools?">
          <Stack gap="12">
            <p className="max-w-2xl text-pretty text-body-large text-muted-foreground leading-relaxed">
              Built with passion, designed for precision, and free forever.
            </p>

            <div className="grid-cards">
              {valueProps.map((prop) => (
                <Card
                  key={prop.title}
                  className="group text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <CardHeader>
                    <div className="mb-4 flex items-center justify-center">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110">
                        <Icon
                          className="h-7 w-7 transition-transform duration-300 group-hover:scale-110"
                          name={prop.icon as any}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-center text-heading transition-colors group-hover:text-accent">
                      {prop.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-caption leading-relaxed">
                      {prop.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Stack>
        </Section>

        {/* CTA Section */}
        <Section spacing="default">
          <div className="mx-auto max-w-6xl">
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow duration-500 hover:shadow-md">
              <Decor stripe texture="dots" wash />

              <div className="relative p-6 sm:p-10 md:p-14 lg:p-16">
                <div className="grid items-center gap-10 md:gap-16 md:grid-cols-12">
                  {/* Left: editorial copy */}
                  <div className="md:col-span-7">
                    <Stack gap="8">
                      <div className="inline-flex items-center gap-4">
                        <span className="h-px w-8 md:w-12 bg-accent/60" />
                        <span className="text-overline text-muted-foreground tracking-[0.15em]">
                          Ready to Level Up
                        </span>
                      </div>

                      <Stack gap="6">
                        <h2 className="text-title text-balance leading-[1.05] tracking-tight md:text-display">
                          Ready to Level Up Your <Accent>Coffee Game</Accent>?
                        </h2>
                        <p className="max-w-xl text-pretty text-body-large text-muted-foreground leading-relaxed">
                          Start with our most popular tool - the Perfect Brew
                          Calculator. Get precision ratios and timing for any
                          brewing method.
                        </p>
                      </Stack>

                      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-5">
                        <Button
                          asChild
                          className="hover-lift w-full sm:w-auto px-8"
                          variant="default"
                          size="lg"
                        >
                          <Link href="/tools/coffee-calculator">
                            <Icon
                              className="mr-2"
                              name="Calculator"
                              size={18}
                            />
                            Try Calculator
                          </Link>
                        </Button>

                        <Button
                          asChild
                          className="hover-lift w-full sm:w-auto px-8"
                          variant="secondary"
                          size="lg"
                        >
                          <Link href="/tools/expert-recipes">
                            <Icon className="mr-2" name="BookOpen" size={18} />
                            Browse Recipes
                          </Link>
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 text-micro text-muted-foreground/60 uppercase tracking-widest font-medium">
                        <span className="h-1 w-1 rounded-full bg-accent/40" />
                        Free Forever
                        <span className="h-1 w-1 rounded-full bg-accent/40" />
                        No Signup Required
                      </div>
                    </Stack>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </Stack>
    </div>
  );
}
