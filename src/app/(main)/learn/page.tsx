import { client } from "@/lib/sanity/client";
import {
  ALL_ARTICLES_QUERY,
  FEATURED_ARTICLES_QUERY,
  ALL_CATEGORIES_QUERY,
  ALL_SERIES_QUERY,
} from "@/lib/sanity/queries";
import { Article, Category, Series } from "@/types/blog-types";
import { PageHeader } from "@/components/layout/PageHeader";
import { PageShell } from "@/components/primitives/page-shell";
import { PostCard } from "@/components/blog/PostCard";
import { SeriesCard } from "@/components/blog/SeriesCard";
import { Stack } from "@/components/primitives/stack";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LearnPage() {
  const [articles, featuredArticles, categories, series] = await Promise.all([
    client.fetch<Article[]>(ALL_ARTICLES_QUERY),
    client.fetch<Article[]>(FEATURED_ARTICLES_QUERY),
    client.fetch<Category[]>(ALL_CATEGORIES_QUERY),
    client.fetch<Series[]>(ALL_SERIES_QUERY),
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
        title="Knowledge Base"
        overline="Learn"
        description="Master the art of Indian specialty coffee. From origin stories to brewing guides, explore our curated knowledge base."
        backgroundImage="/images/hero-bg.avif"
      />

      <PageShell className="py-12 md:py-20">
        <Stack gap="16">
          {/* Featured Article */}
          {mainFeatured && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-title font-semibold tracking-tight">
                  Featured Story
                </h2>
              </div>
              <PostCard article={mainFeatured} featured />
            </div>
          )}

          {/* Categories Strip */}
          <div className="space-y-6">
            <h2 className="text-title font-semibold tracking-tight">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/learn/category/${cat.slug}`}
                  className="rounded-xl border bg-card px-6 py-4 transition-all hover:bg-accent hover:text-white"
                >
                  <div className="font-semibold">{cat.name}</div>
                  <div className="text-caption text-muted-foreground group-hover:text-white/80">
                    {cat.articleCount} articles
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Series Section */}
          {series.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-title font-semibold tracking-tight">
                Learning Series
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {series.map((s) => (
                  <SeriesCard key={s._id} series={s} />
                ))}
              </div>
            </div>
          )}

          {/* Recent Articles Grid */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-title font-semibold tracking-tight">
                Latest Articles
              </h2>
              <div className="text-caption font-medium text-muted-foreground">
                Showing {remainingArticles.length} articles
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {remainingArticles.map((article) => (
                <PostCard key={article._id} article={article} />
              ))}
            </div>

            {remainingArticles.length === 0 && !mainFeatured && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-20 text-center">
                <h3 className="text-title-large mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  Check back soon for more coffee knowledge!
                </p>
              </div>
            )}
          </div>
        </Stack>
      </PageShell>
    </>
  );
}
