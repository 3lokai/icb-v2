import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { client } from "@/lib/sanity/client";
import {
  ARTICLES_BY_SERIES_QUERY,
  SERIES_BY_SLUG_QUERY,
} from "@/lib/sanity/queries";
import { Article, Series } from "@/types/blog-types";
import { PageShell } from "@/components/primitives/page-shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Icon } from "@/components/common/Icon";
import { buttonVariants } from "@/components/ui/button";
import StructuredData from "@/components/seo/StructuredData";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
} from "@/lib/seo/schema";
import { urlFor } from "@/lib/sanity/image";

type Props = {
  params: Promise<{ slug: string }>;
};

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

const LEVEL_LABEL = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

function fallbackDescription(series: Series) {
  return `${series.name}: a field-guide series, read in order.`;
}

/** 45 → "45 min", 120 → "about 2 hours", 150 → "about 2.5 hours". */
function formatTotalTime(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.round((minutes / 60) * 2) / 2;
  return `about ${hours} ${hours === 1 ? "hour" : "hours"}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = await client.fetch<Series>(SERIES_BY_SLUG_QUERY, { slug });

  if (!series) return {};

  return generateSEOMetadata({
    title: series.metadata?.metaTitle || series.name,
    description:
      series.metadata?.metaDescription ||
      series.description ||
      fallbackDescription(series),
    keywords: series.metadata?.keywords,
    image: series.metadata?.ogImage
      ? urlFor(series.metadata.ogImage).width(1200).url()
      : series.cover
        ? urlFor(series.cover).width(1200).url()
        : undefined,
    type: "website",
    canonical:
      series.metadata?.canonicalUrl || `${baseUrl}/learn/series/${series.slug}`,
    noIndex: series.metadata?.noIndex,
  });
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;

  const [series, articles] = await Promise.all([
    client.fetch<Series>(SERIES_BY_SLUG_QUERY, { slug }),
    client.fetch<Article[]>(ARTICLES_BY_SERIES_QUERY, { seriesSlug: slug }),
  ]);

  if (!series) {
    notFound();
  }

  const seriesUrl = `${baseUrl}/learn/series/${series.slug}`;
  const description = series.description || fallbackDescription(series);
  const totalMinutes = articles.reduce(
    (sum, a) => sum + (a.metadata?.readingTime || 0),
    0
  );
  const lastUpdated = articles
    .map((a) => a.updatedAt || a.date)
    .filter(Boolean)
    .sort()
    .at(-1);
  const stats = [
    articles.length > 0 &&
      `${articles.length} ${articles.length === 1 ? "part" : "parts"}`,
    totalMinutes > 0 && `${formatTotalTime(totalMinutes)} of reading`,
    lastUpdated && `Updated ${format(new Date(lastUpdated), "MMM yyyy")}`,
  ].filter(Boolean);
  const hasIntro =
    series.audience || series.whyFinish || (series.outcomes?.length ?? 0) > 0;
  const hasNext = series.nextSeries || series.nextAction?.href;

  const collectionSchema = generateCollectionPageSchema(
    series.name,
    description,
    seriesUrl,
    articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/learn/${article.slug}`,
      name: article.title,
    }))
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Field Guide", url: `${baseUrl}/learn` },
    { name: series.name, url: seriesUrl },
  ]);

  return (
    <>
      <StructuredData schema={[collectionSchema, breadcrumbSchema]} />
      <PageHeader
        title={series.name}
        overline={
          series.level ? `Series · ${LEVEL_LABEL[series.level]}` : "Series"
        }
        description={
          <div className="space-y-6">
            <p>{description}</p>
            {stats.length > 0 && (
              <p className="text-caption font-medium uppercase tracking-[0.12em] !text-white/85">
                {stats.join(" · ")}
              </p>
            )}
            {articles[0] && (
              <Link
                href={`/learn/${articles[0].slug}`}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "rounded-xl bg-accent px-6 font-semibold"
                )}
              >
                Start with Part 1
                <Icon
                  icon={ArrowRightIcon}
                  size={18}
                  className="ml-2"
                  data-icon="inline-end"
                />
              </Link>
            )}
          </div>
        }
        backgroundImage={
          series.cover
            ? urlFor(series.cover).width(1600).url()
            : "/images/hero-learn.avif"
        }
        backgroundImageAlt={series.cover?.alt || ""}
      />

      <PageShell className="py-12 md:py-20">
        <div className="mx-auto max-w-4xl space-y-16">
          {hasIntro && (
            <section className="grid gap-10 md:grid-cols-5">
              <div className="space-y-8 md:col-span-3">
                {series.audience && (
                  <div className="space-y-2">
                    <h2 className="text-overline text-accent">
                      Who it&apos;s for
                    </h2>
                    <p className="text-body-large text-foreground">
                      {series.audience}
                    </p>
                  </div>
                )}
                {series.whyFinish && (
                  <div className="space-y-2">
                    <h2 className="text-overline text-accent">
                      Why read it in order
                    </h2>
                    <p className="text-body text-muted-foreground leading-relaxed">
                      {series.whyFinish}
                    </p>
                  </div>
                )}
              </div>
              {series.outcomes && series.outcomes.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card p-6 md:col-span-2">
                  <h2 className="mb-4 text-heading font-semibold">
                    What you&apos;ll learn
                  </h2>
                  <ul className="space-y-3">
                    {series.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-3">
                        <Icon
                          icon={CheckIcon}
                          size={18}
                          className="mt-0.5 shrink-0 text-accent"
                        />
                        <span className="text-body text-foreground">
                          {outcome}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {articles.length > 0 ? (
            <section aria-labelledby="series-parts">
              <h2 id="series-parts" className="mb-6 text-title font-semibold">
                In this series
              </h2>
              <ol className="divide-y divide-border/60 border-y border-border/60">
                {articles.map((article, index) => (
                  <li key={article._id}>
                    <SeriesPartRow article={article} part={index + 1} />
                  </li>
                ))}
              </ol>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-20 text-center">
              <h3 className="text-heading mb-2">Series coming soon</h3>
              <p className="text-muted-foreground">
                The first part of this series is being written.
              </p>
            </div>
          )}

          {hasNext && (
            <section className="space-y-6 rounded-2xl border border-accent/20 bg-accent/5 p-6 md:p-8">
              <h2 className="text-title font-semibold">After this series</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {series.nextSeries && (
                  <Link
                    href={`/learn/series/${series.nextSeries.slug}`}
                    className="group flex gap-4 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border"
                  >
                    {series.nextSeries.cover?.asset && (
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={urlFor(series.nextSeries.cover)
                            .width(128)
                            .height(128)
                            .url()}
                          alt={
                            series.nextSeries.cover.alt ||
                            series.nextSeries.name
                          }
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-overline text-accent">Next series</p>
                      <p className="text-heading font-semibold group-hover:text-primary transition-colors">
                        {series.nextSeries.name}
                      </p>
                      {series.nextSeries.description && (
                        <p className="mt-1 line-clamp-2 text-caption text-muted-foreground">
                          {series.nextSeries.description}
                        </p>
                      )}
                    </div>
                  </Link>
                )}
                {series.nextAction?.href && (
                  <div className="flex flex-col justify-center gap-3 rounded-xl border border-border/60 bg-card p-4">
                    <p className="text-overline text-accent">Put it to use</p>
                    <Link
                      href={series.nextAction.href}
                      className="group flex items-center gap-2 text-heading font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {series.nextAction.label || "Explore on ICB"}
                      <Icon
                        icon={ArrowRightIcon}
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </PageShell>
    </>
  );
}

function SeriesPartRow({ article, part }: { article: Article; part: number }) {
  const summary = article.excerpt || article.description;
  return (
    <Link
      href={`/learn/${article.slug}`}
      className="group flex items-start gap-4 py-5 md:gap-6"
    >
      <span className="w-8 shrink-0 pt-1 text-body-large font-semibold tabular-nums text-accent">
        {String(part).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="text-heading font-semibold text-balance group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {summary && (
          <p className="line-clamp-2 text-body text-muted-foreground">
            {summary}
          </p>
        )}
        {article.metadata?.readingTime && (
          <p className="text-caption text-muted-foreground">
            {article.metadata.readingTime} min read
          </p>
        )}
      </div>
      {article.cover?.asset && (
        <div className="relative hidden aspect-[4/3] w-32 shrink-0 overflow-hidden rounded-lg sm:block">
          <Image
            src={urlFor(article.cover).width(256).height(192).url()}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="128px"
          />
        </div>
      )}
    </Link>
  );
}
