import { client } from "@/lib/sanity/client";
import {
  ARTICLES_BY_SERIES_QUERY,
  SERIES_BY_SLUG_QUERY,
} from "@/lib/sanity/queries";
import { Article, Series } from "@/types/blog-types";
import { PageShell } from "@/components/primitives/page-shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/blog/PostCard";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { urlFor } from "@/lib/sanity/image";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await client.fetch<Series>(SERIES_BY_SLUG_QUERY, { slug });

  if (!series) return {};

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const defaultCanonical = `${baseUrl}/learn/series/${series.slug}`;

  return generateSEOMetadata({
    title: series.metadata?.metaTitle || series.name,
    description:
      series.metadata?.metaDescription ||
      series.description ||
      `Follow this series to master everything about ${series.name}`,
    keywords: series.metadata?.keywords,
    image: series.metadata?.ogImage
      ? urlFor(series.metadata.ogImage).width(1200).url()
      : series.cover
        ? urlFor(series.cover).width(1200).url()
        : undefined,
    type: "website",
    canonical: series.metadata?.canonicalUrl || defaultCanonical,
    noIndex: series.metadata?.noIndex,
  });
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;

  const series = await client.fetch<Series>(SERIES_BY_SLUG_QUERY, { slug });

  if (!series) {
    notFound();
  }

  const articles = await client.fetch<Article[]>(ARTICLES_BY_SERIES_QUERY, {
    seriesSlug: slug,
  });

  return (
    <>
      <PageHeader
        title={series.name}
        overline="Series"
        description={
          series.description ||
          `Follow this series to master everything about ${series.name}`
        }
        backgroundImage={
          series.cover
            ? urlFor(series.cover).width(1200).url()
            : "/images/hero-learn.avif"
        }
      />

      <PageShell className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          {articles.map((article, index) => (
            <div key={article._id} className="relative">
              {index < articles.length - 1 && (
                <div className="absolute left-[24px] top-[100px] bottom-[-100px] w-0.5 bg-muted hidden md:block" />
              )}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-white font-bold text-body-large relative z-10 shadow-md">
                  {article.series?.part || index + 1}
                </div>
                <div className="flex-1 w-full">
                  <PostCard article={article} featured={index === 0} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-20 text-center">
            <h3 className="text-title mb-2">Series coming soon</h3>
            <p className="text-muted-foreground">
              The first part of this series will be published shortly!
            </p>
          </div>
        )}
      </PageShell>
    </>
  );
}
