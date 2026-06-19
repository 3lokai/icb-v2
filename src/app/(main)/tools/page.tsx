// src/app/tools/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/common/Icon";
import { ToolSuggestionTrigger } from "@/components/tools/ToolSuggestionModal";
import { PageHeader } from "@/components/layout/PageHeader";
import { Accent } from "@/components/primitives/accent";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata } from "@/lib/seo/metadata";
import { generateCollectionPageSchema, getSeoBaseUrl } from "@/lib/seo/schema";

const TOOLS_DESCRIPTION =
  "Free brewing tools for specialty coffee: a ratio calculator, competition recipes, and a brew diagnosis compass.";

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
      description: "Coffee brewing calculator with timer and method guides",
    },
  },
  {
    "@type": "ListItem",
    position: 2,
    item: {
      "@type": "WebApplication",
      name: "Expert Coffee Recipes",
      url: `${baseUrl}/tools/expert-recipes`,
      description: "Competition coffee brewing recipes",
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
        "Brew diagnosis tool: pick symptoms, get method-specific fixes",
    },
  },
];

const toolsCollectionSchema = generateCollectionPageSchema(
  "Coffee Tools & Calculators",
  TOOLS_DESCRIPTION,
  toolsUrl,
  toolItems
);

// The workbench — three instruments, each with its own job. Presented as an
// editorial field-guide index (a ruled list with a screenshot of each tool),
// not a grid of identical cards.
type Tool = {
  /** Screenshot of the live tool, under /public/images/screens. */
  image: string;
  imageAlt: string;
  name: string;
  blurb: string;
  features: string[];
  href: string;
  cta: string;
};

const tools: Tool[] = [
  {
    image: "/images/screens/calculator.avif",
    imageAlt:
      "The Perfect Brew Calculator with method selector, dose and water fields, and a brew timer.",
    name: "Perfect Brew Calculator",
    blurb:
      "Set your method and cup size, then get dose, water volume, and brew timing. A timer tracks each pour step.",
    features: ["11 brew methods", "Live brew timer", "Shareable recipes"],
    href: "/tools/coffee-calculator",
    cta: "Open the calculator",
  },
  {
    image: "/images/screens/recipes2.avif",
    imageAlt:
      "The Expert Recipes library, showing championship brew recipes with filters by method and expert.",
    name: "Expert Recipes",
    blurb:
      "Competition recipes from championship brewers. Each entry lists pour steps, grind setting, ratio, and short notes on why it works.",
    features: [
      "Championship recipes",
      "Step-by-step pours",
      "Filter by method & expert",
    ],
    href: "/tools/expert-recipes",
    cta: "Browse the recipes",
  },
  {
    image: "/images/screens/compass.avif",
    imageAlt:
      "The Coffee Compass diagnosis wheel, mapping tasting symptoms to method-specific brewing fixes.",
    name: "Coffee Compass",
    blurb:
      "When a cup tastes off, pick the symptom (sour, bitter, thin) and get a fix for your brew method. Based on extraction, not guesswork.",
    features: [
      "Symptom-to-fix diagnosis",
      "Method-specific corrections",
      "Rule-based, no AI",
    ],
    href: "/tools/coffee-compass",
    cta: "Diagnose a brew",
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
        description="A ratio calculator, a recipe library, and a brew compass for when the cup isn't right. Free to use, no account needed."
        overline="Coffee Tools"
        title="Tools for a Better Cup"
      />

      {/* The workbench — editorial tool index, each entry framed by its own screenshot */}
      <Section spacing="default">
        <ol className="border-y border-border/60 divide-y divide-border/60">
          {tools.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="group grid items-center gap-6 py-10 md:grid-cols-12 md:gap-12 lg:py-12"
              >
                {/* Tool screenshot */}
                <div className="md:col-span-5">
                  <div className="image-hover-zoom relative aspect-[16/10] overflow-hidden rounded-lg border border-border/60 bg-card transition-shadow duration-500 group-hover:shadow-md">
                    <Image
                      src={tool.image}
                      alt={tool.imageAlt}
                      fill
                      sizes="(min-width: 768px) 42vw, 100vw"
                      className="object-cover object-top"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-7">
                  <Stack gap="4">
                    <h2 className="text-title text-balance">
                      <Accent>{tool.name}</Accent>
                    </h2>
                    <p className="max-w-2xl text-pretty text-body-large leading-relaxed text-muted-foreground">
                      {tool.blurb}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {tool.features.join("  ·  ")}
                    </p>
                    <span className="inline-flex items-center gap-2 font-medium text-primary transition-colors group-hover:text-accent">
                      {tool.cta}
                      <Icon
                        name="ArrowRight"
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      />
                    </span>
                  </Stack>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Section>

      {/* On the workbench next — quiet, honest, no ghost cards or dated promises */}
      <Section spacing="tight">
        <p className="max-w-2xl text-pretty text-body leading-relaxed text-muted-foreground">
          More tools are planned: a grind-size reference, a flavor wheel, and a
          map of specialty roasters in India. Missing something?{" "}
          <ToolSuggestionTrigger />
        </p>
      </Section>
    </div>
  );
}
