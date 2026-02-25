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
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Icon } from "@/components/common/Icon";
import { format } from "date-fns";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

  // Use all articles, featured articles will be highlighted in the grid
  // Sort by date to keep the feed chronological
  const displayArticles = [...articles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Helper to get icon for category
  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case "seed-to-farm":
        return "Plant";
      case "roasting-craft":
        return "Fire";
      case "brewing-science":
        return "Flask";
      case "tasting-sensory":
        return "Eye";
      case "industry-culture":
        return "Buildings";
      default:
        return "BookOpen";
    }
  };

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

          {/* Field Guide Feed (Bento Grid) */}
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
                  {displayArticles.length} entries
                </div>
              </div>

              <BentoGrid className="grid-flow-dense md:auto-rows-[22rem]">
                {displayArticles.map((article) => {
                  const isFeatured = article.featured;
                  const displayAuthor =
                    article.authorRef?.name || article.author.name;
                  return (
                    <BentoCard
                      key={article._id}
                      name={
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-caption opacity-70">
                            <span>
                              {format(new Date(article.date), "MMM d, yyyy")}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-current" />
                            <span>
                              {article.metadata?.readingTime || 5} min read
                            </span>
                          </div>
                          <div
                            className={cn(
                              "font-semibold tracking-tight leading-tight",
                              isFeatured ? "text-2xl md:text-3xl" : "text-xl"
                            )}
                          >
                            {article.title}
                          </div>
                          <div className="text-caption opacity-60 mt-1">
                            By {displayAuthor}
                          </div>
                        </div>
                      }
                      className={
                        isFeatured
                          ? "lg:col-span-2 md:col-span-2"
                          : "lg:col-span-1 md:col-span-1"
                      }
                      background={
                        <div className="absolute inset-0 z-0">
                          {article.cover && (
                            <Image
                              src={urlFor(article.cover)
                                .width(800)
                                .height(isFeatured ? 600 : 450)
                                .url()}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent transition-opacity duration-500 group-hover:via-background/40" />
                        </div>
                      }
                      Icon={(props) => (
                        <Icon
                          name={getCategoryIcon(article.category?.slug) as any}
                          color="accent"
                          {...props}
                        />
                      )}
                      href={`/learn/${article.slug}`}
                      cta="Read Article"
                    />
                  );
                })}
              </BentoGrid>
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
