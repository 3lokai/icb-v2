import { client } from "@/lib/sanity/client";
import { ARTICLES_BY_SERIES_QUERY } from "@/lib/sanity/queries";
import { Article, Series } from "@/types/blog-types";
import { PageShell } from "@/components/primitives/page-shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/blog/PostCard";
import { notFound } from "next/navigation";

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const series = await client.fetch<Series>(
    `*[_type == "series" && slug.current == $slug][0] { _id, name, "slug": slug.current, description }`,
    { slug }
  );

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
