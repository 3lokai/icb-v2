// src/app/tools/expert-recipes/page.tsx

import Link from "next/link";
import {
  ExpertRecipesFAQ,
  expertRecipesFAQs,
} from "@/components/faqs/ExpertRecipesFAQs";
import { Icon } from "@/components/common/Icon";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { Cluster } from "@/components/primitives/cluster";
import StructuredData from "@/components/seo/StructuredData";
import { ExpertRecipesClient } from "@/components/tools/RecipeClient";
import ExpertRecipesCta from "@/components/tools/ExpertRecipesCta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateFAQSchema, generateHowToSchema } from "@/lib/seo/schema";

// SEO Metadata
export const metadata = generateMetadata({
  title: "Expert Coffee Recipes | Championship Brewing Methods & Techniques",
  description:
    "Master championship coffee brewing with recipes from world champions like James Hoffmann, Tetsu Kasuya, and Scott Rao. Step-by-step guides for V60, AeroPress, French Press, and more.",
  keywords: [
    "expert coffee recipes",
    "championship coffee brewing",
    "james hoffmann coffee recipe",
    "tetsu kasuya 4:6 method",
    "scott rao v60",
    "world barista champion recipes",
    "competition coffee brewing",
    "specialty coffee techniques",
    "pour over recipes",
    "aeropress recipes",
    "french press recipes",
    "brewing championship methods",
  ],
  canonical: "/tools/expert-recipes",
  type: "website",
});

// Structured Data Schemas
const expertRecipesHowToSchema = generateHowToSchema({
  name: "How to Brew Coffee Using Expert Championship Recipes",
  description:
    "Learn to brew exceptional coffee using championship-winning techniques from world coffee experts and competition winners.",
  totalTime: "PT10M",
  equipment: [
    "Coffee brewing device (V60, AeroPress, French Press, etc.)",
    "Digital scale (accurate to 0.1g)",
    "Gooseneck kettle",
    "Timer",
    "Quality coffee grinder",
  ],
  ingredients: [
    "Fresh specialty coffee beans (7-30 days post-roast)",
    "Filtered water (150-300 TDS)",
    "Paper filters (method-specific)",
  ],
  steps: [
    {
      name: "Choose Expert Recipe",
      text: "Select a recipe from world champions like James Hoffmann, Tetsu Kasuya, or Carolina Garay based on your brewing method and skill level.",
    },
    {
      name: "Prepare Equipment",
      text: "Set up your brewing device, rinse filters, and ensure your grinder is calibrated to the recipe's recommended grind size.",
    },
    {
      name: "Measure Precisely",
      text: "Use exact measurements from the expert recipe. Championship recipes require precision - use a scale accurate to 0.1g.",
    },
    {
      name: "Follow Timing",
      text: "Championship recipes have specific timing. Use our integrated timer and follow pour schedules exactly as specified.",
    },
    {
      name: "Master the Technique",
      text: "Each expert has signature techniques (Hoffmann's stirring, Kasuya's 4:6 method, Rao's agitation). Practice the specific movements.",
    },
    {
      name: "Taste and Adjust",
      text: "Compare your results to the expected flavor profile. Fine-tune grind size and timing for your setup and taste preferences.",
    },
  ],
});

const expertRecipesFAQSchema = generateFAQSchema(expertRecipesFAQs);

const expertRecipesCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Expert Coffee Brewing Recipes Collection",
  description:
    "Curated collection of championship coffee brewing recipes from world experts and competition winners",
  url: "https://indiancoffeebeans.com/tools/expert-recipes",
  numberOfItems: 8,
  itemListElement: [
    {
      "@type": "Recipe",
      name: "James Hoffmann V60 Technique",
      author: "James Hoffmann",
      description:
        "World Barista Champion 2007 V60 brewing method focusing on clarity and even extraction",
    },
    {
      "@type": "Recipe",
      name: "Tetsu Kasuya 4:6 Method",
      author: "Tetsu Kasuya",
      description:
        "2016 World Brewers Cup Champion systematic brewing method for flavor control",
    },
    {
      "@type": "Recipe",
      name: "Scott Rao V60 Method",
      author: "Scott Rao",
      description:
        "Coffee consultant's uniform extraction technique for consistent results",
    },
  ],
};

export default function ExpertRecipesPage() {
  return (
    <div className="pb-20">
      {/* Structured Data */}
      <StructuredData schema={expertRecipesHowToSchema} />
      <StructuredData schema={expertRecipesFAQSchema} />
      <StructuredData schema={expertRecipesCollectionSchema} />

      {/* Page Header */}
      <PageHeader
        backgroundImage="/images/hero-experts.jpg"
        backgroundImageAlt="Coffee beans background"
        description="Learn from world champions and coffee experts. Master championship-winning techniques from James Hoffmann, Tetsu Kasuya, Scott Rao, and more."
        overline="Championship Brewing Techniques & Expert Recipes"
        title="Expert Coffee Recipes"
      />

      <div className="container mx-auto px-4 -mt-20 relative z-30">
        <Stack gap="12">
          {/* Overlapping Card with Recipe Tool */}
          <div
            className="bg-background rounded-3xl p-6 md:p-10 border border-border/50 shadow-xl"
            id="recipes"
          >
            <Stack gap="8">
              {/* Header / Highlights Overlay */}
              <div className="flex flex-col md:flex-row gap-6 items-center justify-between pb-8 border-b border-border/40">
                <Cluster
                  gap="6"
                  align="center"
                  className="justify-center md:justify-start text-caption"
                >
                  <div className="group flex items-center gap-2 transition-colors hover:text-primary">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm transition-transform duration-300 group-hover:scale-125" />
                    <span className="font-medium">8 Championship Recipes</span>
                  </div>
                  <div className="group flex items-center gap-2 transition-colors hover:text-accent">
                    <div className="h-2.5 w-2.5 rounded-full bg-accent shadow-sm transition-transform duration-300 group-hover:scale-125" />
                    <span className="font-medium">World-Class Experts</span>
                  </div>
                  <div className="group flex items-center gap-2 transition-colors hover:text-chart-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-chart-2 shadow-sm transition-transform duration-300 group-hover:scale-125" />
                    <span className="font-medium">Step-by-Step Guides</span>
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
                    href="/tools/coffee-calculator"
                  >
                    <Icon
                      className="transition-transform group-hover:scale-110"
                      name="Calculator"
                      size={16}
                    />
                    Try Calculator
                  </Link>
                </Button>
              </div>

              {/* Recipes Client Tool */}
              <div className="pt-2">
                <ExpertRecipesClient />
              </div>
            </Stack>
          </div>

          {/* Featured Experts Section */}
          <Section spacing="tight">
            <Stack gap="12">
              <div className="text-center">
                <Stack gap="4" className="items-center">
                  <h2 className="text-primary text-title font-serif italic">
                    Featured Coffee Experts
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                  <p className="mx-auto max-w-2xl text-muted-foreground text-body-large">
                    Learn from world champions, industry leaders, and coffee
                    innovators who have shaped modern specialty coffee culture.
                  </p>
                </Stack>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    name: "James Hoffmann",
                    title: "World Barista Champion 2007",
                    achievement: "YouTube Coffee Educator",
                    recipes: ["V60 Technique", "French Press", "Chemex"],
                    description:
                      "Renowned for scientific approach to coffee and educational content",
                  },
                  {
                    name: "Tetsu Kasuya",
                    title: "World Brewers Cup Champion 2016",
                    achievement: "Creator of 4:6 Method",
                    recipes: ["4:6 V60 Method"],
                    description:
                      "Revolutionary systematic brewing method for flavor control",
                  },
                  {
                    name: "Scott Rao",
                    title: "Coffee Consultant & Author",
                    achievement: "Industry Expert",
                    recipes: ["V60 Uniform Extraction"],
                    description:
                      "Focus on scientific extraction and consistency",
                  },
                  {
                    name: "Carolina Garay",
                    title: "World AeroPress Champion 2018",
                    achievement: "Temperature Innovation",
                    recipes: ["Championship AeroPress"],
                    description:
                      "Known for innovative low-temperature brewing techniques",
                  },
                  {
                    name: "George Stanica",
                    title: "World AeroPress Champion 2024",
                    achievement: "Software Engineer Brewer",
                    recipes: ["Modern AeroPress"],
                    description:
                      "Precision-focused approach with specialized water composition",
                  },
                  {
                    name: "Intelligentsia Coffee",
                    title: "Third Wave Pioneer",
                    achievement: "Industry Leader",
                    recipes: ["Systematic Pour Over"],
                    description:
                      "Established third-wave coffee standards and techniques",
                  },
                ].map((expert) => (
                  <div
                    className="surface-1 card-padding hover-lift group relative overflow-hidden rounded-2xl border border-border/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    key={expert.name}
                  >
                    <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors" />
                    <div className="relative z-10">
                      <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-6 w-6 text-primary" name="User" />
                        </div>
                        <div>
                          <h3 className="text-subheading transition-colors group-hover:text-primary">
                            {expert.name}
                          </h3>
                          <p className="text-muted-foreground text-caption">
                            {expert.title}
                          </p>
                        </div>
                      </div>

                      <Badge className="badge mb-4 border-border/50 bg-background/90 text-foreground text-overline">
                        {expert.achievement}
                      </Badge>

                      <p className="text-caption leading-relaxed transition-colors group-hover:text-foreground">
                        {expert.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Stack>
          </Section>

          {/* Recipe Categories */}
          <Section spacing="default">
            <Stack gap="12">
              <div className="text-center">
                <Stack gap="4" className="items-center">
                  <h2 className="text-primary text-title font-serif italic">
                    Recipe Categories
                  </h2>
                  <div className="h-px w-16 bg-accent/60" />
                  <p className="mx-auto max-w-2xl text-muted-foreground text-body-large">
                    Organized by brewing method, difficulty level, and intended
                    use to help you find the perfect recipe for your skill
                    level.
                  </p>
                </Stack>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="surface-1 card-padding hover-lift group text-center rounded-2xl border border-border/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" name="Coffee" />
                  </div>
                  <Stack gap="2">
                    <h3 className="text-heading transition-colors group-hover:text-primary">
                      Everyday Brewing
                    </h3>
                    <p className="text-muted-foreground text-caption leading-relaxed transition-colors group-hover:text-foreground">
                      Reliable, approachable recipes perfect for daily coffee
                      routine. Forgiving techniques that produce consistently
                      great results.
                    </p>
                    <div className="pt-2">
                      <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                        4 Recipes
                      </Badge>
                    </div>
                  </Stack>
                </div>

                <div className="surface-1 card-padding hover-lift group relative overflow-hidden rounded-2xl border border-border/40 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-red-500/5 blur-2xl" />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7" name="Trophy" />
                    </div>
                    <Stack gap="2">
                      <h3 className="text-heading transition-colors group-hover:text-primary">
                        Competition Level
                      </h3>
                      <p className="text-muted-foreground text-caption leading-relaxed transition-colors group-hover:text-foreground">
                        Championship-winning techniques requiring precision and
                        practice. Used in actual coffee competitions worldwide.
                      </p>
                      <div className="pt-2">
                        <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                          3 Recipes
                        </Badge>
                      </div>
                    </Stack>
                  </div>
                </div>

                <div className="surface-1 card-padding hover-lift group relative overflow-hidden rounded-2xl border border-border/40 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="absolute top-0 left-0 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl" />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7" name="Flask" />
                    </div>
                    <Stack gap="2">
                      <h3 className="text-heading transition-colors group-hover:text-primary">
                        Experimental
                      </h3>
                      <p className="text-muted-foreground text-caption leading-relaxed transition-colors group-hover:text-foreground">
                        Innovative techniques for exploring new flavor profiles
                        and pushing brewing boundaries. For adventurous coffee
                        lovers.
                      </p>
                      <div className="pt-2">
                        <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                          1 Recipe
                        </Badge>
                      </div>
                    </Stack>
                  </div>
                </div>
              </div>
            </Stack>
          </Section>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto w-full">
            <ExpertRecipesFAQ />
          </div>

          {/* CTA Section */}
          <ExpertRecipesCta />
        </Stack>
      </div>
    </div>
  );
}
