import { client } from "@/lib/sanity/client";
import {
  ALL_ARTICLES_QUERY,
  ALL_CATEGORIES_QUERY,
  ALL_SERIES_QUERY,
  PILLAR_CATEGORIES_QUERY,
} from "@/lib/sanity/queries";
import { Article, Category, Series } from "@/types/blog-types";
import { PageHeader } from "@/components/layout/PageHeader";
import { SeriesCard } from "@/components/blog/SeriesCard";
import { FieldGuidePillars } from "@/components/blog/FieldGuidePillars";
import { PostCard } from "@/components/blog/PostCard";
import { ArticleGrid } from "@/components/blog/ArticleParallaxGrid";
import {
  ArticlePagination,
  LEARN_PAGE_SIZE,
} from "@/components/blog/ArticlePagination";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { Accent } from "@/components/primitives/accent";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateCollectionPageSchema, getSeoBaseUrl } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";

export const revalidate = 3600;

/** Series cards visible before "See all". */
const SERIES_PREVIEW = 3;

const LEARN_DESCRIPTION =
  "Master the art of Indian specialty coffee. From origin stories to brewing guides, explore our curated field guide — articles, series, and research across five knowledge layers.";

export const metadata = generateSEOMetadata({
  title: "The Indian Coffee Field Guide",
  description: LEARN_DESCRIPTION,
  canonical: "/learn",
  keywords: [
    "Indian coffee guide",
    "specialty coffee India",
    "coffee brewing guides",
    "Indian coffee origins",
  ],
});

function buildArticleListItems(
  articles: Article[],
  baseUrl: string
): Array<Record<string, unknown>> {
  return articles.map((article, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Article",
      name: article.title,
      url: `${baseUrl}/learn/${article.slug}`,
      ...(article.excerpt ? { description: article.excerpt } : {}),
    },
  }));
}

export default async function LearnPage() {
  const [articles, _categories, series, pillarCategories] = await Promise.all([
    client.fetch<Article[]>(ALL_ARTICLES_QUERY),
    client.fetch<Category[]>(ALL_CATEGORIES_QUERY),
    client.fetch<Series[]>(ALL_SERIES_QUERY),
    client.fetch<Category[]>(PILLAR_CATEGORIES_QUERY),
  ]);

  const featuredArticles = articles.filter((a) => a.featured);
  const regularArticles = articles
    .filter((a) => !a.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const pageArticles = regularArticles.slice(0, LEARN_PAGE_SIZE);
  const totalPages = Math.ceil(regularArticles.length / LEARN_PAGE_SIZE);

  const baseUrl = getSeoBaseUrl();
  const learnUrl = `${baseUrl}/learn`;
  const articleItems = buildArticleListItems(
    [...featuredArticles, ...pageArticles],
    baseUrl
  );
  const collectionSchema = generateCollectionPageSchema(
    "The Indian Coffee Field Guide",
    LEARN_DESCRIPTION,
    learnUrl,
    articleItems
  );

  return (
    <>
      <StructuredData schema={collectionSchema} />
      <PageHeader
        title={
          <>
            The Indian Coffee <br />
            <Accent>Field Guide</Accent>
          </>
        }
        overline="Knowledge Base"
        description="Master the art of Indian specialty coffee. From origin stories to brewing guides, explore our curated intelligence layers."
        backgroundImage="/images/hero-learn.avif"
      />

      {/* The Five Layers — the field guide's information architecture. */}
      <Section
        contained={false}
        spacing="default"
        eyebrow="The Five Layers"
        title="From soil to"
        accentWord="your cup"
        description="Our field guide is structured into five distinct layers of knowledge, moving from the estate where the bean grows to the moment it lands in your cup."
      >
        <FieldGuidePillars categories={pillarCategories} />
      </Section>

      {/* The Feed — featured leads fold into the same section as the grid,
          so the page reads as one library, not two competing card walls. */}
      <Section
        contained={false}
        spacing="default"
        title="Latest from the"
        accentWord="field guide"
        description={`Curated stories, guides, and research from across the Indian coffee spectrum — ${articles.length} ${articles.length === 1 ? "entry" : "entries"} and counting.`}
      >
        <Stack gap="12">
          {featuredArticles.length > 0 && (
            <Stack gap="8">
              {featuredArticles.map((article) => (
                <PostCard key={article._id} article={article} featured />
              ))}
            </Stack>
          )}
          {pageArticles.length > 0 && (
            <div>
              <ArticleGrid articles={pageArticles} />
              <ArticlePagination page={1} totalPages={totalPages} />
            </div>
          )}
          {articles.length === 0 && (
            <p className="text-body text-muted-foreground">
              New field notes are being written. Check back soon.
            </p>
          )}
        </Stack>
      </Section>

      {/* Series — set apart by a hairline section break and generous space,
          not a tonal panel (the layout's PageShell would clip a warm band). */}
      {series.length > 0 && (
        <Section
          contained={false}
          spacing="default"
          eyebrow="Series"
          title="Structured"
          accentWord="learning"
          description="Reading paths through one topic, part by part, in the order the ideas build."
          className="border-t border-border/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {series.slice(0, SERIES_PREVIEW).map((s) => (
              <SeriesCard key={s._id} series={s} />
            ))}
          </div>
          {/* Native <details>: the rest stay in the HTML (crawlable), no JS.
              The toggle hides itself once open — expand is one-way. */}
          {series.length > SERIES_PREVIEW && (
            <details className="group mt-8">
              <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-lg border border-border/60 px-5 py-2.5 text-caption text-primary transition-colors hover:border-border hover:bg-muted group-open:hidden [&::-webkit-details-marker]:hidden">
                See all {series.length} series
                <span aria-hidden>↓</span>
              </summary>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {series.slice(SERIES_PREVIEW).map((s) => (
                  <SeriesCard key={s._id} series={s} />
                ))}
              </div>
            </details>
          )}
        </Section>
      )}
    </>
  );
}
