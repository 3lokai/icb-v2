import { Accent } from "@/components/primitives/accent";
// src/app/tools/expert-recipes/page.tsx

import Link from "next/link";
import type { Metadata } from "next";
import { ExpertRecipesFAQ } from "@/components/faqs/ExpertRecipesFAQs";
import {
  CalculatorIcon,
  CoffeeIcon,
  FlaskIcon,
  TrophyIcon,
  UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import StructuredData from "@/components/seo/StructuredData";
import { ExpertRecipesClient } from "@/components/tools/RecipeClient";
import ExpertRecipesCta from "@/components/tools/ExpertRecipesCta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { generateMetadata as generateBaseMetadata } from "@/lib/seo/metadata";
import { generateHowToSchema, recipeTimeToIsoDuration } from "@/lib/seo/schema";
import { filterRecipes, RECIPES_ARRAY } from "@/lib/tools/expert-recipes";

const expertRecipeCount = filterRecipes({}).length;
const competitionRecipeCount = filterRecipes({
  recommendedUse: "competition",
}).length;
const everydayRecipeCount = filterRecipes({
  recommendedUse: "everyday",
}).length;
const experimentRecipeCount = filterRecipes({
  recommendedUse: "experiment",
}).length;

// SEO Metadata — static canonical so the route can prerender.
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
  const canonicalPath = "/tools/expert-recipes";
  const canonicalUrl = `${baseUrl}${canonicalPath}`;

  const baseMetadata = generateBaseMetadata({
    title: "Expert Coffee Recipes | Championship Brewing Methods & Techniques",
    description:
      "Master championship coffee brewing with recipes from world champions like James Hoffmann, Tetsu Kasuya, and Scott Rao. Step-by-step guides for V60, AeroPress, French Press, and more.",
    keywords: [
      "expert coffee recipes",
      "championship coffee brewing",
      "james hoffmann coffee recipe",
      "tetsu kasuya 4:6 method",
      "tetsu kasuya 10 pour method",
      "scott rao v60",
      "world barista champion recipes",
      "competition coffee brewing",
      "specialty coffee techniques",
      "pour over recipes",
      "aeropress recipes",
      "french press recipes",
      "brewing championship methods",
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

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
const expertRecipesImage = `${baseUrl}/images/hero-experts.avif`;

// Structured Data Schemas
const expertRecipesHowToSchema = generateHowToSchema({
  name: "How to Brew Coffee Using Expert Championship Recipes",
  description:
    "Learn to brew exceptional coffee using championship-winning techniques from world coffee experts and competition winners.",
  image: "/images/hero-experts.avif",
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
      text: "Each expert has signature techniques (Hoffmann's stirring, Kasuya's 4:6 or 10-pour method, Rao's agitation). Practice the specific movements.",
    },
    {
      name: "Taste and Adjust",
      text: "Compare your results to the expected flavor profile. Fine-tune grind size and timing for your setup and taste preferences.",
    },
  ],
});

const expertRecipesCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Expert Coffee Brewing Recipes Collection",
  description:
    "Curated collection of championship coffee brewing recipes from world experts and competition winners",
  url: `${baseUrl}/tools/expert-recipes`,
  numberOfItems: expertRecipeCount,
  // Generated from the recipe data so the schema can never drift from the list
  // the page actually renders (and numberOfItems always matches the entries).
  itemListElement: RECIPES_ARRAY.map((recipe, index) => {
    const totalTime = recipeTimeToIsoDuration(recipe.totalTime);

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Recipe",
        name: recipe.title,
        author: { "@type": "Person", name: recipe.expert.name },
        description: recipe.flavorProfile,
        image: expertRecipesImage,
        url: `${baseUrl}/tools/expert-recipes#${recipe.slug}`,
        ...(totalTime && { totalTime }),
        recipeYield: `${recipe.water} ml`,
        recipeInstructions: recipe.steps.map((step, stepIndex) => ({
          "@type": "HowToStep",
          position: stepIndex + 1,
          text: step.instruction,
        })),
      },
    };
  }),
};

export default function ExpertRecipesPage() {
  return (
    <div className="pb-20">
      {/* Structured Data */}
      <StructuredData
        schema={[expertRecipesHowToSchema, expertRecipesCollectionSchema]}
      />

      {/* Page Header */}
      <PageHeader
        backgroundImage="/images/hero-experts.avif"
        backgroundImageAlt="Coffee beans background"
        description="Learn from world champions and coffee experts. Master championship-winning techniques from James Hoffmann, Tetsu Kasuya, Scott Rao, and more."
        overline="Championship Brewing Techniques & Expert Recipes"
        title="Expert Coffee Recipes"
      />

      <div className="container mx-auto px-4 py-12 relative z-30">
        <Stack gap="8" className="gap-8 md:gap-12">
          {/* Overlapping Card with Recipe Tool */}
          <div id="recipes">
            <Stack gap="8">
              {/* Recipe tool — homepage-style section header */}
              <div className="border-b border-border/40 pb-8">
                <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
                  <div className="md:col-span-8">
                    <Stack gap="6">
                      <div className="inline-flex items-center gap-4">
                        <span className="h-px w-8 bg-accent/60 md:w-12" />
                        <span className="text-overline tracking-[0.15em] text-muted-foreground">
                          Recipe library
                        </span>
                      </div>
                      <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                        Browse championship <Accent>recipes.</Accent>
                      </h2>
                      <p className="max-w-2xl text-pretty text-body-muted leading-relaxed">
                        {expertRecipeCount} curated brew guides from world-class
                        experts. Search, filter by method and difficulty, then
                        open a card for full steps and timing.
                      </p>
                    </Stack>
                  </div>
                  <div className="flex justify-start pb-2 md:col-span-4 md:justify-end">
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
                          icon={CalculatorIcon}
                          size={16}
                        />
                        Try Calculator
                      </Link>
                    </Button>
                  </div>
                </div>
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
              <div className="mb-12">
                <Stack gap="6">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 bg-accent/60 md:w-12" />
                    <span className="text-overline tracking-[0.15em] text-muted-foreground">
                      The experts
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                    Featured <Accent>coffee experts.</Accent>
                  </h2>
                  <p className="max-w-2xl text-pretty text-body-muted leading-relaxed">
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
                    achievement: "Creator of 4:6 & 10-Pour Methods",
                    recipes: ["4:6 V60 Method", "10-Pour V60 Method"],
                    description:
                      "Systematic V60 techniques for flavor control and light-roast clarity",
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
                          <Icon
                            className="h-6 w-6 text-primary"
                            icon={UserIcon}
                          />
                        </div>
                        <div>
                          <h3 className="text-heading transition-colors group-hover:text-primary">
                            {expert.name}
                          </h3>
                          <p className="text-body-muted leading-relaxed">
                            {expert.title}
                          </p>
                        </div>
                      </div>

                      <Badge className="badge mb-4 border-border/50 bg-background/90 text-foreground text-overline">
                        {expert.achievement}
                      </Badge>

                      <p className="text-body-muted leading-relaxed transition-colors group-hover:text-foreground">
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
              <div className="mb-12">
                <Stack gap="6">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 bg-accent/60 md:w-12" />
                    <span className="text-overline tracking-[0.15em] text-muted-foreground">
                      How we group them
                    </span>
                  </div>
                  <h2 className="text-title text-balance leading-[1.1] tracking-tight">
                    Recipe <Accent>categories.</Accent>
                  </h2>
                  <p className="max-w-2xl text-pretty text-body-muted leading-relaxed">
                    Organized by difficulty and intended use so you can match a
                    recipe to your skill level and how you like to brew.
                  </p>
                </Stack>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="surface-1 card-padding hover-lift group text-center rounded-2xl border border-border/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7" icon={CoffeeIcon} />
                  </div>
                  <Stack gap="2">
                    <h3 className="text-heading transition-colors group-hover:text-primary">
                      Everyday Brewing
                    </h3>
                    <p className="text-body-muted leading-relaxed transition-colors group-hover:text-foreground">
                      Reliable, approachable recipes perfect for daily coffee
                      routine. Forgiving techniques that produce consistently
                      great results.
                    </p>
                    <div className="pt-2">
                      <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                        {everydayRecipeCount} Recipes
                      </Badge>
                    </div>
                  </Stack>
                </div>

                <div className="surface-1 card-padding hover-lift group relative overflow-hidden rounded-2xl border border-border/40 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-red-500/5 blur-2xl" />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7" icon={TrophyIcon} />
                    </div>
                    <Stack gap="2">
                      <h3 className="text-heading transition-colors group-hover:text-primary">
                        Competition Level
                      </h3>
                      <p className="text-body-muted leading-relaxed transition-colors group-hover:text-foreground">
                        Championship-winning techniques requiring precision and
                        practice. Used in actual coffee competitions worldwide.
                      </p>
                      <div className="pt-2">
                        <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                          {competitionRecipeCount} Recipes
                        </Badge>
                      </div>
                    </Stack>
                  </div>
                </div>

                <div className="surface-1 card-padding hover-lift group relative overflow-hidden rounded-2xl border border-border/40 text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="absolute top-0 left-0 h-24 w-24 rounded-full bg-blue-500/5 blur-2xl" />
                  <div className="relative z-10">
                    <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-7 w-7" icon={FlaskIcon} />
                    </div>
                    <Stack gap="2">
                      <h3 className="text-heading transition-colors group-hover:text-primary">
                        Experimental
                      </h3>
                      <p className="text-body-muted leading-relaxed transition-colors group-hover:text-foreground">
                        Innovative techniques for exploring new flavor profiles
                        and pushing brewing boundaries. For adventurous coffee
                        lovers.
                      </p>
                      <div className="pt-2">
                        <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                          {experimentRecipeCount} Recipe
                          {experimentRecipeCount === 1 ? "" : "s"}
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
          <ExpertRecipesCta context="recipes" />
        </Stack>
      </div>
    </div>
  );
}
