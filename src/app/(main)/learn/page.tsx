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
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { Accent } from "@/components/primitives/accent";

export const revalidate = 3600;

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

  return (
    <>
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
          {regularArticles.length > 0 && (
            <ArticleGrid articles={regularArticles} />
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
          spacing="loose"
          align="center"
          title="Structured"
          accentWord="learning"
          description="Follow these curated series to master complex coffee topics, one step at a time."
          className="border-t border-border/60"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {series.map((s) => (
              <SeriesCard key={s._id} series={s} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
