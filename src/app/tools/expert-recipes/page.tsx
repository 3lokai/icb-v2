// src/app/tools/expert-recipes/page.tsx

import Link from "next/link";
import { FAQ } from "@/components/common/FAQ";
import { Icon } from "@/components/common/Icon";
import { PageHeader } from "@/components/common/PageHeader";
import StructuredData from "@/components/seo/StructuredData";
import { ExpertRecipesClient } from "@/components/tools/RecipeClient";
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

const expertRecipesFAQSchema = generateFAQSchema([
  {
    question:
      "What makes these expert recipes different from regular coffee recipes?",
    answer:
      "These are championship-winning recipes used in international competitions by world barista champions and coffee experts. They've been tested under pressure and refined for exceptional flavor extraction.",
  },
  {
    question: "Do I need special equipment to follow expert recipes?",
    answer:
      "While basic brewing equipment works, expert recipes often require precision tools like accurate scales (0.1g), gooseneck kettles, and quality grinders. Some recipes specify particular filters or brewing devices.",
  },
  {
    question: "What is the Tetsu Kasuya 4:6 method?",
    answer:
      "The 4:6 method divides brewing water into phases: first 40% controls sweetness/acidity balance, remaining 60% controls strength. This systematic approach won the 2016 World Brewers Cup Championship.",
  },
  {
    question:
      "How do I choose between beginner, intermediate, and advanced recipes?",
    answer:
      "Beginner recipes are forgiving with simple techniques. Intermediate recipes require attention to timing and pour technique. Advanced recipes demand precision, specific equipment, and practiced movements.",
  },
  {
    question: "Can I modify expert recipes for my taste preferences?",
    answer:
      "Start by following recipes exactly to understand the intended flavor. Then make small adjustments: grind size for extraction, ratio for strength, or temperature for balance. Document changes for consistency.",
  },
]);

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
    <>
      {/* Structured Data */}
      <StructuredData schema={expertRecipesHowToSchema} />
      <StructuredData schema={expertRecipesFAQSchema} />
      <StructuredData schema={expertRecipesCollectionSchema} />

      <div>
        {/* Page Header */}
        <PageHeader
          description="Learn from world champions and coffee experts. Master championship-winning techniques from James Hoffmann, Tetsu Kasuya, Scott Rao, and more."
          icon="Trophy"
          iconLabel="Championship Brewing Techniques & Expert Recipes"
          title="Expert Coffee Recipes"
        />

        {/* Feature highlights and action buttons */}
        <section className="section-spacing bg-muted/20">
          <div className="container-default">
            {/* Feature highlights */}
            <div className="glass-panel mx-auto mb-8 max-w-2xl animate-fade-in-scale rounded-2xl border border-border/50 p-6">
              <div className="flex flex-wrap items-center justify-center gap-6 text-caption">
                <div className="group flex items-center gap-2 transition-colors hover:text-primary">
                  <div className="h-3 w-3 rounded-full bg-primary shadow-sm transition-transform duration-300 group-hover:scale-125" />
                  <span className="font-medium">8 Championship Recipes</span>
                </div>
                <div className="group flex items-center gap-2 transition-colors hover:text-accent">
                  <div className="h-3 w-3 rounded-full bg-accent shadow-sm transition-transform duration-300 group-hover:scale-125" />
                  <span className="font-medium">World-Class Experts</span>
                </div>
                <div className="group flex items-center gap-2 transition-colors hover:text-chart-2">
                  <div className="h-3 w-3 rounded-full bg-chart-2 shadow-sm transition-transform duration-300 group-hover:scale-125" />
                  <span className="font-medium">Step-by-Step Guides</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex animate-fade-in-scale flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                className="btn-primary hover-lift group"
                size="lg"
              >
                <Link className="flex items-center gap-2" href="#recipes">
                  <Icon
                    className="transition-transform group-hover:scale-110"
                    name="BookOpen"
                    size={18}
                  />
                  Explore Recipes
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
                  href="/tools/coffee-calculator"
                >
                  <Icon
                    className="transition-transform group-hover:scale-110"
                    name="Calculator"
                    size={18}
                  />
                  Try Calculator
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Expert Recipes Tool */}
        <section className="section-spacing" id="recipes">
          <div className="container-default">
            <ExpertRecipesClient />
          </div>
        </section>

        {/* Featured Experts Section */}
        <section className="section-spacing bg-muted/30">
          <div className="container-default">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-primary text-title">
                Featured Coffee Experts
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Learn from world champions, industry leaders, and coffee
                innovators who have shaped modern specialty coffee culture.
              </p>
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
                  description: "Focus on scientific extraction and consistency",
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
                  className="glass-card card-padding hover-lift group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                  key={expert.name}
                >
                  <div className="absolute top-0 right-0 h-12 w-12 rounded-full bg-primary/5 blur-xl" />
                  <div className="relative z-10">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-6 w-6 text-primary" name="User" />
                      </div>
                      <div>
                        <h3 className="font-semibold transition-colors group-hover:text-primary">
                          {expert.name}
                        </h3>
                        <p className="text-muted-foreground text-caption">
                          {expert.title}
                        </p>
                      </div>
                    </div>

                    <Badge className="badge mb-3 border-border/50 bg-background/90 text-foreground text-overline">
                      {expert.achievement}
                    </Badge>

                    <p className="mb-4 text-muted-foreground text-caption leading-relaxed transition-colors group-hover:text-foreground">
                      {expert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recipe Categories */}
        <section className="section-spacing">
          <div className="container-default">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-primary text-title">
                Recipe Categories
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Organized by brewing method, difficulty level, and intended use
                to help you find the perfect recipe for your skill level.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="glass-card card-padding hover-lift group text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-600 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" name="Coffee" />
                </div>
                <h3 className="mb-2 text-heading transition-colors group-hover:text-primary">
                  Everyday Brewing
                </h3>
                <p className="mb-4 text-muted-foreground text-caption transition-colors group-hover:text-foreground">
                  Reliable, approachable recipes perfect for daily coffee
                  routine. Forgiving techniques that produce consistently great
                  results.
                </p>
                <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                  4 Recipes
                </Badge>
              </div>

              <div className="glass-card card-padding hover-lift group relative overflow-hidden text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute top-0 right-0 h-12 w-12 rounded-full bg-red-500/5 blur-xl" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-red-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" name="Trophy" />
                  </div>
                  <h3 className="mb-2 text-heading transition-colors group-hover:text-primary">
                    Competition Level
                  </h3>
                  <p className="mb-4 text-muted-foreground text-caption leading-relaxed transition-colors group-hover:text-foreground">
                    Championship-winning techniques requiring precision and
                    practice. Used in actual coffee competitions worldwide.
                  </p>
                  <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                    3 Recipes
                  </Badge>
                </div>
              </div>

              <div className="glass-card card-padding hover-lift group relative overflow-hidden text-center transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute top-0 left-0 h-12 w-12 rounded-full bg-blue-500/5 blur-xl" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6" name="Flask" />
                  </div>
                  <h3 className="mb-2 text-heading transition-colors group-hover:text-primary">
                    Experimental
                  </h3>
                  <p className="mb-4 text-muted-foreground text-caption leading-relaxed transition-colors group-hover:text-foreground">
                    Innovative techniques for exploring new flavor profiles and
                    pushing brewing boundaries. For adventurous coffee lovers.
                  </p>
                  <Badge className="badge border-border/50 bg-background/90 text-foreground text-overline">
                    1 Recipe
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section-spacing">
          <div className="container-default">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-primary text-title">
                Frequently Asked Questions
              </h2>
              <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Common questions about expert recipes, championship techniques,
                and brewing mastery.
              </p>
            </div>

            <FAQ
              items={[
                {
                  question:
                    "What makes these expert recipes different from regular coffee recipes?",
                  answer:
                    "These are championship-winning recipes used in international competitions by world barista champions and coffee experts. They've been tested under pressure and refined for exceptional flavor extraction.",
                },
                {
                  question:
                    "Do I need special equipment to follow expert recipes?",
                  answer:
                    "While basic brewing equipment works, expert recipes often require precision tools like accurate scales (0.1g), gooseneck kettles, and quality grinders. Some recipes specify particular filters or brewing devices.",
                },
                {
                  question: "What is the Tetsu Kasuya 4:6 method?",
                  answer:
                    "The 4:6 method divides brewing water into phases: first 40% controls sweetness/acidity balance, remaining 60% controls strength. This systematic approach won the 2016 World Brewers Cup Championship.",
                },
                {
                  question:
                    "How do I choose between beginner, intermediate, and advanced recipes?",
                  answer:
                    "Beginner recipes are forgiving with simple techniques. Intermediate recipes require attention to timing and pour technique. Advanced recipes demand precision, specific equipment, and practiced movements.",
                },
                {
                  question:
                    "Can I modify expert recipes for my taste preferences?",
                  answer:
                    "Start by following recipes exactly to understand the intended flavor. Then make small adjustments: grind size for extraction, ratio for strength, or temperature for balance. Document changes for consistency.",
                },
              ]}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-spacing">
          <div className="container-default">
            <div className="glass-modal card-padding relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 h-32 w-32 animate-float rounded-full bg-primary/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-24 w-24 animate-float rounded-full bg-accent/20 blur-2xl delay-700" />

              <div className="relative z-10 py-8 text-center">
                <h2 className="mb-4 text-title">
                  Ready to Master Expert Techniques?
                </h2>
                <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-accent" />
                <p className="mx-auto mb-8 max-w-2xl text-muted-foreground leading-relaxed">
                  Combine expert recipes with our precision calculator and find
                  the perfect Indian coffee beans to showcase these championship
                  techniques.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button
                    asChild
                    className="glass-button hover-lift group"
                    size="lg"
                  >
                    <Link href="/tools/coffee-calculator">
                      <Icon
                        className="mr-2 h-4 w-4 transition-transform group-hover:scale-110"
                        name="Calculator"
                      />
                      Try the Calculator
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="glass-button hover-lift group"
                    size="lg"
                    variant="outline"
                  >
                    <Link href="/coffees">
                      <Icon
                        className="mr-2 h-4 w-4 transition-transform group-hover:scale-110"
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
