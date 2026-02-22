import { client } from "@/lib/sanity/client";
import {
  ALL_ARTICLES_QUERY,
  FEATURED_ARTICLES_QUERY,
  ALL_CATEGORIES_QUERY,
  ALL_SERIES_QUERY,
  PILLAR_CATEGORIES_QUERY,
} from "@/lib/sanity/queries";
import { Article, Category, Series } from "@/types/blog-types";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageShell } from "@/components/primitives/page-shell";
import { PostCard } from "@/components/blog/PostCard";
import { SeriesCard } from "@/components/blog/SeriesCard";
import { FieldGuidePillars } from "@/components/blog/FieldGuidePillars";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const [articles, featuredArticles, _categories, series, pillarCategories] =
    await Promise.all([
      client.fetch<Article[]>(ALL_ARTICLES_QUERY),
      client.fetch<Article[]>(FEATURED_ARTICLES_QUERY),
      client.fetch<Category[]>(ALL_CATEGORIES_QUERY),
      client.fetch<Series[]>(ALL_SERIES_QUERY),
      client.fetch<Category[]>(PILLAR_CATEGORIES_QUERY),
    ]);

  const mainFeatured = featuredArticles[0] || articles[0];

  // If we have very few articles, show all of them in the latest list as well
  // Otherwise, filter out the featured one to avoid redundancy
  const remainingArticles =
    articles.length <= 3
      ? articles
      : articles.filter((a) => a._id !== mainFeatured?._id);

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
        backgroundImage="/images/hero-bg.avif"
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

          {/* Featured Article */}
          {mainFeatured && (
            <Section contained={false} spacing="tight">
              <Stack gap="8">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-primary/70" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                      Editor&apos;s Pick
                    </span>
                  </div>
                  <h2 className="text-title font-semibold tracking-tight text-balance">
                    Don&apos;t miss{" "}
                    <span className="text-accent italic font-serif">
                      this story
                    </span>
                  </h2>
                  <p className="max-w-2xl text-body-large text-muted-foreground">
                    Our top pick from the Field Guide—deep dives and essential
                    reads.
                  </p>
                </div>
                <PostCard article={mainFeatured} featured />
              </Stack>
            </Section>
          )}

          {/* Recent Articles Grid */}
          <Section contained={false} spacing="default">
            <Stack gap="12">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/50 pb-6">
                <div className="flex flex-col gap-4">
                  <div className="inline-flex items-center gap-4">
                    <span className="h-px w-8 md:w-12 bg-primary/70" />
                    <span className="text-overline text-muted-foreground tracking-[0.15em] uppercase">
                      Fresh from the Field
                    </span>
                  </div>
                  <h2 className="text-title font-semibold tracking-tight text-balance">
                    Latest{" "}
                    <span className="text-accent italic font-serif">
                      entries
                    </span>
                  </h2>
                  <p className="max-w-2xl text-body-large text-muted-foreground">
                    Freshly ground insights and stories from the field.
                  </p>
                </div>
                <div className="text-caption font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full self-start md:self-auto">
                  {remainingArticles.length} articles
                </div>
              </div>

              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                {remainingArticles.map((article) => (
                  <PostCard key={article._id} article={article} />
                ))}
              </div>
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
