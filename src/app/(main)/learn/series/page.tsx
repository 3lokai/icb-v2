import { client } from "@/lib/sanity/client";
import { ALL_SERIES_QUERY } from "@/lib/sanity/queries";
import { Series } from "@/types/blog-types";
import { PageHeader } from "@/components/layout/PageHeader";
import { SeriesCard } from "@/components/blog/SeriesCard";
import { Section } from "@/components/primitives/section";
import { Accent } from "@/components/primitives/accent";
import StructuredData from "@/components/seo/StructuredData";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  getSeoBaseUrl,
} from "@/lib/seo/schema";

export const revalidate = 3600;

const SERIES_DESCRIPTION =
  "Reading paths through Indian specialty coffee, one topic at a time: buying your first bags, brewing, processing, regions, prices and the state of the industry, part by part in the order the ideas build.";

export const metadata = generateSEOMetadata({
  title: "Field Guide Series: Reading Paths",
  description: SERIES_DESCRIPTION,
  canonical: "/learn/series",
  keywords: [
    "Indian coffee guide",
    "specialty coffee India",
    "coffee reading list",
    "learn about coffee",
  ],
});

/** Levels in reading order; a series without a level falls into the last group. */
const GROUPS: {
  level: Series["level"] | undefined;
  eyebrow: string;
  title: string;
  accentWord: string;
  description: string;
}[] = [
  {
    level: "beginner",
    eyebrow: "Beginner",
    title: "Start",
    accentWord: "here",
    description:
      "No prior knowledge assumed. What specialty coffee is, how to buy it, what it costs and how to brew it.",
  },
  {
    level: "intermediate",
    eyebrow: "Intermediate",
    title: "Go",
    accentWord: "deeper",
    description:
      "Processing, regions, extraction and the industry, for readers who already brew at home.",
  },
  {
    level: "advanced",
    eyebrow: "Advanced",
    title: "Specialist",
    accentWord: "topics",
    description: "Specialist topics that build on the earlier series.",
  },
  {
    level: undefined,
    eyebrow: "More series",
    title: "Also in the",
    accentWord: "field guide",
    description: "Reading paths on further topics.",
  },
];

// ponytail: pinned by slug because series have no order field; add one in
// studio-icb (schemaTypes/series.ts) if more than one series needs pinning.
const START_SERIES = "your-first-month-with-indian-specialty-coffee";

export default async function SeriesIndexPage() {
  const series = await client.fetch<Series[]>(ALL_SERIES_QUERY);
  // A series with no published parts has nothing to read yet. The query
  // orders by name; the starting series moves to the front of its group.
  const live = series
    .filter((s) => (s.parts?.length ?? 0) > 0)
    .sort(
      (a, b) =>
        Number(b.slug === START_SERIES) - Number(a.slug === START_SERIES)
    );
  const partCount = live.reduce((n, s) => n + (s.parts?.length ?? 0), 0);

  const baseUrl = getSeoBaseUrl();
  const pageUrl = `${baseUrl}/learn/series`;
  const collectionSchema = generateCollectionPageSchema(
    "Field Guide Series: Reading Paths",
    SERIES_DESCRIPTION,
    pageUrl,
    live.map((s, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/learn/series/${s.slug}`,
      name: s.name,
    }))
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Field Guide", url: `${baseUrl}/learn` },
    { name: "Series", url: pageUrl },
  ]);

  return (
    <>
      <StructuredData schema={[collectionSchema, breadcrumbSchema]} />
      <PageHeader
        title={
          <>
            Reading paths through <br />
            <Accent>Indian coffee</Accent>
          </>
        }
        overline="Series"
        description={`${live.length} series, ${partCount} parts. Each one takes a single topic from the basics to the detail, in the order the ideas build. Pick a starting point and read part by part.`}
        backgroundImage="/images/hero-learn.avif"
      />

      {live.length === 0 ? (
        <Section contained={false} spacing="default">
          <p className="text-body text-muted-foreground">
            The first series is being written. Check back soon.
          </p>
        </Section>
      ) : (
        GROUPS.map((group) => {
          const items = live.filter((s) =>
            group.level
              ? s.level === group.level
              : !GROUPS.some((g) => g.level && g.level === s.level)
          );
          if (items.length === 0) return null;
          return (
            <Section
              key={group.eyebrow}
              contained={false}
              spacing="default"
              eyebrow={group.eyebrow}
              title={group.title}
              accentWord={group.accentWord}
              description={group.description}
            >
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {items.map((s) => (
                  <SeriesCard key={s._id} series={s} />
                ))}
              </div>
            </Section>
          );
        })
      )}
    </>
  );
}
