import { client } from "@/lib/sanity/client";
import {
  ALL_ARTICLES_QUERY,
  ALL_CATEGORIES_QUERY,
  ALL_SERIES_QUERY,
  PILLAR_CATEGORIES_QUERY,
} from "@/lib/sanity/queries";
import { Article, Category, Series } from "@/types/blog-types";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageShell } from "@/components/primitives/page-shell";
import { SeriesCard } from "@/components/blog/SeriesCard";
import { FieldGuidePillars } from "@/components/blog/FieldGuidePillars";
import { PostCard } from "@/components/blog/PostCard";
import { ArticleGrid } from "@/components/blog/ArticleParallaxGrid";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";

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
            <span className="text-accent italic font-serif">Field Guide</span>
          </>
        }
        overline="Knowledge Base"
        description="Master the art of Indian specialty coffee. From origin stories to brewing guides, explore our curated intelligence layers."
        backgroundImage="/images/hero-learn.avif"
      />

      <PageShell className="py-0">
        <Stack gap="16">
          {/* 5 Pillars Section */}
          <Section contained={false} spacing="default">
            <Stack gap="12">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-4">
                  <span className="h-px w-8 md:w-12 bg-primary/70" />
                  <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                    Knowledge Layers
                  </span>
                </div>
                <h2 className="text-title font-semibold tracking-tight text-balance">
                  From soil to{" "}
                  <span className="text-accent italic font-serif">
                    your cup
                  </span>
                </h2>
                <p className="max-w-2xl text-body-large text-muted-foreground">
                  Our Field Guide is structured into five distinct layers of
                  knowledge, moving from the soil to your cup.
                </p>
              </div>
              <FieldGuidePillars categories={pillarCategories} />
            </Stack>
          </Section>

          {/* Featured Section */}
          {featuredArticles.length > 0 && (
            <Section contained={false} spacing="default">
              <Stack gap="12">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-primary/70" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                      Featured
                    </span>
                  </div>
                  <h2 className="text-title font-semibold tracking-tight text-balance">
                    Editor&apos;s{" "}
                    <span className="text-accent italic font-serif">picks</span>
                  </h2>
                </div>
                <div className="grid gap-8">
                  {featuredArticles.map((article) => (
                    <PostCard key={article._id} article={article} featured />
                  ))}
                </div>
              </Stack>
            </Section>
          )}

          {/* Field Guide Feed (Parallax Grid) */}
          <Section contained={false} spacing="default">
            <Stack gap="12">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/50 pb-6">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-primary/70" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                      Field Guide Feed
                    </span>
                  </div>
                  <h2 className="text-title font-semibold tracking-tight text-balance">
                    Latest{" "}
                    <span className="text-accent italic font-serif">
                      insights
                    </span>
                  </h2>
                  <p className="max-w-2xl text-body-large text-muted-foreground">
                    Our curated selection of stories, guides, and research from
                    across the coffee spectrum.
                  </p>
                </div>
                <div className="text-caption font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full self-start md:self-auto">
                  {articles.length} entries
                </div>
              </div>

              <ArticleGrid articles={regularArticles} />
            </Stack>
          </Section>

          {/* Series Section */}
          {series.length > 0 && (
            <Section
              contained={false}
              spacing="loose"
              className="bg-muted/20 rounded-3xl px-8 md:px-12 mb-20"
            >
              <Stack gap="12">
                <div className="flex flex-col gap-4 text-center">
                  <div className="inline-flex items-center justify-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-primary/70" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                      Multi-Part Guides
                    </span>
                  </div>
                  <h2 className="text-title font-semibold tracking-tight text-balance">
                    Structured{" "}
                    <span className="text-accent italic font-serif">
                      learning
                    </span>
                  </h2>
                  <p className="mx-auto max-w-2xl text-body-large text-muted-foreground">
                    Follow these curated series to master complex coffee topics
                    step by step.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {series.map((s) => (
                    <SeriesCard key={s._id} series={s} />
                  ))}
                </div>
              </Stack>
            </Section>
          )}
        </Stack>
      </PageShell>
    </>
  );
}
