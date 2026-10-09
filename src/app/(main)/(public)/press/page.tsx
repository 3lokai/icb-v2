import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  DownloadSimpleIcon,
  EnvelopeSimpleIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { PostCard } from "@/components/blog/PostCard";
import { SeriesCard } from "@/components/blog/SeriesCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { CopyText, TrackClicks } from "@/components/press/PressClient";
import { Prose } from "@/components/primitives/prose";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";
import StructuredData from "@/components/seo/StructuredData";
import { Button } from "@/components/ui/button";
import { fetchCommunityCoffeeReviewCount } from "@/lib/data/fetch-community-coffee-review-count";
import { fetchInsightsStats } from "@/lib/data/fetch-insights-stats";
import { fetchPublicDirectoryTotals } from "@/lib/data/fetch-public-directory-totals";
import {
  BRAND_GUIDELINES,
  DATA_ATTRIBUTION,
  DESCRIPTIONS,
  FEATURED_ARTICLES,
  FEATURED_SERIES,
  FOUNDER_BIO,
  FOUNDER_PHOTO,
  INSIGHTS_HREF,
  LOGO_ASSETS,
  MEDIA_KIT_HREF,
  PRESS_CONTACT_EMAIL,
  PRESS_COVERAGE,
  SCREENSHOT_ASSETS,
  STORY_ANGLES,
  type PressAsset,
} from "@/lib/press/content";
import { client } from "@/lib/sanity/client";
import { ALL_ARTICLES_QUERY, ALL_SERIES_QUERY } from "@/lib/sanity/queries";
import { generateMetadata } from "@/lib/seo/metadata";
import { FOUNDER, pressPageSchema } from "@/lib/seo/schema";
import type { Article, Series } from "@/types/blog-types";

export const revalidate = 3600;

export const metadata: Metadata = generateMetadata({
  title: "Press & Media Kit",
  description:
    "Access IndianCoffeeBeans brand assets, founder information, media resources, specialty coffee industry insights, editorial research, and press coverage.",
  keywords: [
    "IndianCoffeeBeans press",
    "IndianCoffeeBeans media kit",
    "Indian specialty coffee data",
    "Indian coffee industry research",
  ],
  canonical: "/press",
  type: "website",
});

/** Each source fails independently — a missing metric is omitted, never guessed. */
async function settle<T>(label: string, p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch (e) {
    console.error(`[PressPage] ${label}`, e);
    return null;
  }
}

const count = (n: number) => `${n.toLocaleString("en-IN")}+`;

function pickBySlug<T extends { slug: string }>(
  items: T[] | null,
  slugs: readonly string[]
): T[] {
  if (!items) return [];
  return slugs.flatMap((s) => items.find((i) => i.slug === s) ?? []);
}

export default async function PressPage() {
  const [totals, reviewCount, insights, allSeries, allArticles] =
    await Promise.all([
      settle("totals", fetchPublicDirectoryTotals()),
      settle("reviews", fetchCommunityCoffeeReviewCount()),
      settle("insights", fetchInsightsStats()),
      settle("series", client.fetch<Series[]>(ALL_SERIES_QUERY)),
      settle("articles", client.fetch<Article[]>(ALL_ARTICLES_QUERY)),
    ]);

  const stats = [
    totals?.roasters && {
      value: count(totals.roasters),
      label: "Active roasters indexed",
    },
    totals?.coffees && {
      value: count(totals.coffees),
      label: "Specialty coffees listed",
    },
    reviewCount && {
      value: count(reviewCount),
      label: "Community coffee ratings",
    },
    insights?.origin_regions && {
      value: String(insights.origin_regions),
      label: "Origin regions tagged",
    },
    allArticles?.length && {
      value: String(allArticles.length),
      label: "Published guides & articles",
    },
  ].filter(Boolean) as { value: string; label: string }[];

  const lastUpdated = totals?.asOf
    ? new Date(totals.asOf).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Factual highlights straight from the Insights aggregates.
  const highlights: string[] = [];
  if (insights?.process.length) {
    const known = insights.process.reduce((sum, p) => sum + p.skus, 0);
    const top = insights.process.reduce((a, b) => (b.skus > a.skus ? b : a));
    highlights.push(
      `${top.label} is the most common process, at ${Math.round((top.skus / known) * 100)}% of listed coffees with a known processing method.`
    );
  }
  if (insights?.origin_regions && insights.states.length) {
    highlights.push(
      `Listed coffees are tagged to ${insights.origin_regions} origin regions across ${insights.states.length} states.`
    );
  }
  if (insights?.roaster_cities.length) {
    highlights.push(
      `Active roasters are based in ${insights.roaster_cities.length} cities.`
    );
  }

  const series = pickBySlug(allSeries, FEATURED_SERIES);
  const articles = pickBySlug(allArticles, FEATURED_ARTICLES);

  return (
    <>
      <StructuredData schema={pressPageSchema} />

      <PageHeader
        overline="Press & Media"
        title={<>Discover the Story Behind IndianCoffeeBeans</>}
        description="IndianCoffeeBeans is an independent platform helping people explore India's specialty coffee ecosystem through coffee discovery, community reviews, industry data, and educational content."
        rightSideContent={
          <div className="flex flex-col gap-3">
            <TrackClicks
              event="press_kit_downloaded"
              props={{ location: "hero" }}
            >
              <Button asChild size="lg">
                <a download href={MEDIA_KIT_HREF}>
                  <Icon icon={DownloadSimpleIcon} size={18} color="white" />
                  Download Media Kit
                </a>
              </Button>
            </TrackClicks>
            <TrackClicks
              event="press_insights_clicked"
              props={{ location: "hero" }}
            >
              <Button asChild size="lg" variant="secondary">
                <Link href={INSIGHTS_HREF}>Explore Industry Insights</Link>
              </Button>
            </TrackClicks>
          </div>
        }
      />

      {/* ICB at a glance */}
      {stats.length > 0 && (
        <Section
          contained={false}
          spacing="tight"
          eyebrow="At a glance"
          title="ICB in numbers"
        >
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border/40 py-8 md:grid-cols-3 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1">
                <dt className="text-caption">{s.label}</dt>
                <dd className="text-title font-sans font-medium tracking-tight text-foreground">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-caption">
            Live counts from the ICB catalogue
            {lastUpdated && <>, catalogue last refreshed {lastUpdated}</>}.
            Coffees are active, publicly listed products; ratings are one per
            person per coffee.
          </p>
        </Section>
      )}

      {/* About the platform */}
      <Section
        contained={false}
        eyebrow="About the platform"
        title="Approved descriptions"
        description="Use these as written, or trim to fit. Please don't describe ICB as a marketplace — it links to roasters and doesn't sell coffee."
      >
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {DESCRIPTIONS.map((d) => (
            <article
              key={d.key}
              className="surface-1 flex flex-col gap-4 rounded-xl p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-heading">{d.label}</h3>
                <CopyText descriptionKey={d.key} text={d.text} />
              </div>
              <div className="space-y-3 text-body text-muted-foreground">
                {d.text.split("\n\n").map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Data & industry insights */}
      <Section
        contained={false}
        id="insights"
        eyebrow="Data & Industry Insights"
        title="Explore India's Specialty Coffee"
        accentWord="Landscape"
        className="border-t border-border/60"
      >
        <div className="surface-1 grid grid-cols-1 overflow-hidden rounded-xl md:grid-cols-2">
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-80">
            <Image
              alt="The IndianCoffeeBeans Industry Insights dashboard, showing how India processes its specialty coffee"
              className="object-cover object-bottom"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/press/screenshots/icb-industry-insights.jpg"
            />
          </div>
          <Stack className="p-6 md:p-10" gap="6">
            <h3 className="text-title">Industry Insights</h3>
            <p className="text-body text-muted-foreground">
              Original, regularly refreshed data from the ICB catalogue:
              processing methods, origin regions and states, pricing benchmarks,
              varieties, and where India's roasters are based.
            </p>
            {highlights.length > 0 && (
              <ul className="space-y-2 text-body">
                {highlights.map((h) => (
                  <li key={h} className="border-l-2 border-accent/60 pl-3">
                    {h}
                  </li>
                ))}
              </ul>
            )}
            <TrackClicks
              event="press_insights_clicked"
              props={{ location: "insights_card" }}
            >
              <Button asChild>
                <Link href={INSIGHTS_HREF}>
                  Explore Industry Insights
                  <Icon icon={ArrowRightIcon} size={16} color="white" />
                </Link>
              </Button>
            </TrackClicks>
          </Stack>
        </div>
        <div className="mt-6 space-y-2 text-caption">
          <p>
            Suggested attribution:{" "}
            <Link
              className="font-medium text-foreground underline underline-offset-4"
              href={INSIGHTS_HREF}
            >
              {DATA_ATTRIBUTION}
            </Link>
          </p>
          <p>
            You're welcome to cite published, aggregated insights with
            attribution. The underlying dataset isn't licensed for reproduction.
            For custom data, bulk exports or licensing, see the{" "}
            <Link className="underline underline-offset-4" href="/developers">
              ICB API
            </Link>{" "}
            or{" "}
            <a
              className="underline underline-offset-4"
              href={`mailto:${PRESS_CONTACT_EMAIL}`}
            >
              get in touch
            </a>
            .
          </p>
        </div>
      </Section>

      {/* Editorial */}
      {(series.length > 0 || articles.length > 0) && (
        <Section
          contained={false}
          eyebrow="Editorial"
          title="Stories, Guides & Research"
          description="Multi-part series and in-depth articles from the ICB field guide."
          className="border-t border-border/60"
        >
          <Stack gap="12">
            {series.length > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {series.map((s) => (
                  <TrackClicks
                    key={s._id}
                    event="press_series_clicked"
                    props={{ series_slug: s.slug }}
                  >
                    <SeriesCard series={s} />
                  </TrackClicks>
                ))}
              </div>
            )}
            {articles.length > 0 && (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {articles.map((a) => (
                  <TrackClicks
                    key={a._id}
                    event="press_article_clicked"
                    props={{ article_slug: a.slug }}
                  >
                    <PostCard article={a} />
                  </TrackClicks>
                ))}
              </div>
            )}
            <Link
              className="inline-flex items-center gap-2 text-caption text-primary hover:underline"
              href="/learn"
            >
              Explore all articles
              <Icon icon={ArrowRightIcon} size={14} />
            </Link>
          </Stack>
        </Section>
      )}

      {/* Story angles */}
      <Section
        contained={false}
        eyebrow="For journalists"
        title="Stories Worth Exploring"
        description="Starting points drawn from ICB's research and editorial — ideas to investigate, not findings."
        className="border-t border-border/60"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {STORY_ANGLES.map((angle) => (
            <article
              key={angle.title}
              className="surface-1 flex flex-col gap-4 rounded-xl p-6"
            >
              <h3 className="text-heading">{angle.title}</h3>
              <p className="text-body text-muted-foreground">{angle.premise}</p>
              <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2">
                {angle.links.map((l) => (
                  <li key={l.href}>
                    <TrackClicks
                      event={
                        l.href.startsWith(INSIGHTS_HREF)
                          ? "press_insights_clicked"
                          : "press_article_clicked"
                      }
                      props={{ location: "story_angle", href: l.href }}
                    >
                      <Link
                        className="text-caption text-primary underline-offset-4 hover:underline"
                        href={l.href}
                      >
                        {l.label} →
                      </Link>
                    </TrackClicks>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* Brand assets */}
      <Section
        contained={false}
        id="assets"
        eyebrow="Media kit"
        title="Download Brand Assets"
        className="border-t border-border/60"
      >
        <Stack gap="12">
          <TrackClicks
            event="press_kit_downloaded"
            props={{ location: "assets" }}
          >
            <Button asChild size="lg">
              <a download href={MEDIA_KIT_HREF}>
                <Icon icon={DownloadSimpleIcon} size={18} color="white" />
                Download Complete Media Kit (.zip)
              </a>
            </Button>
          </TrackClicks>

          <AssetGroup assets={LOGO_ASSETS} kind="logo" title="Logos" />
          <AssetGroup
            assets={SCREENSHOT_ASSETS}
            kind="screenshot"
            title="Product screenshots"
          />

          <div>
            <h3 className="mb-4 text-heading">Brand usage</h3>
            <ul className="max-w-3xl list-disc space-y-2 pl-5 text-body text-muted-foreground">
              {BRAND_GUIDELINES.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        </Stack>
      </Section>

      {/* Founder */}
      <Section
        contained={false}
        id="founder"
        eyebrow="Founder"
        title="Meet the Founder"
        className="border-t border-border/60"
      >
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
          <Stack className="md:col-span-4" gap="3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border/40">
              <Image
                alt={FOUNDER.imageAlt}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                src={FOUNDER.imageSrc}
              />
            </div>
            <TrackClicks
              event="press_asset_downloaded"
              props={{ asset: "founder_photo", format: "JPG" }}
            >
              <a
                className="inline-flex items-center gap-2 text-caption text-primary hover:underline"
                download
                href={FOUNDER_PHOTO.href}
              >
                <Icon icon={DownloadSimpleIcon} size={14} />
                Download portrait (JPG)
              </a>
            </TrackClicks>
          </Stack>
          <div className="md:col-span-8">
            <Prose className="text-foreground">
              <p className="text-body-large font-medium">
                {FOUNDER.name}, {FOUNDER.jobTitle}
              </p>
              {FOUNDER_BIO.long.map((p) => (
                <p key={p.slice(0, 24)} className="text-muted-foreground">
                  {p}
                </p>
              ))}
              <blockquote>
                <p className="font-serif text-heading text-pretty">
                  {FOUNDER_BIO.why}
                </p>
              </blockquote>
            </Prose>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CopyText
                descriptionKey="founder_bio_short"
                text={FOUNDER_BIO.short}
              />
              <span className="text-caption">Copy short bio</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a
                  href={FOUNDER.linkedInHref}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Icon icon={LinkedinLogoIcon} size={16} />
                  LinkedIn
                </a>
              </Button>
              <Button asChild variant="ghost">
                <Link href={FOUNDER.aboutHref}>
                  More on the About page
                  <Icon icon={ArrowRightIcon} size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Coverage — hidden until something is actually published */}
      {PRESS_COVERAGE.length > 0 && (
        <Section
          contained={false}
          eyebrow="Coverage"
          title="In the News"
          className="border-t border-border/60"
        >
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {PRESS_COVERAGE.map((c) => (
              <li key={c.url}>
                <TrackClicks
                  event="press_coverage_clicked"
                  props={{ publication: c.publication, type: c.type }}
                >
                  <a
                    className="surface-1 flex h-full flex-col gap-2 rounded-xl p-6 transition-colors hover:bg-muted"
                    href={c.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="text-overline tracking-[0.15em]">
                      {c.publication} ·{" "}
                      {new Date(c.date).toLocaleDateString("en-GB", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-heading">{c.headline}</span>
                    {c.description && (
                      <span className="text-body text-muted-foreground">
                        {c.description}
                      </span>
                    )}
                    <span className="mt-auto inline-flex items-center gap-1 text-caption text-primary">
                      Read on {c.publication}{" "}
                      <Icon icon={ArrowUpRightIcon} size={14} />
                    </span>
                  </a>
                </TrackClicks>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Contact */}
      <Section
        contained={false}
        id="contact"
        eyebrow="Media enquiries"
        title="Get in Touch"
        className="border-t border-border/60"
      >
        <div className="surface-1 flex flex-col gap-6 rounded-xl p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-body-large">
              For interviews, quotes, data questions, speaking and events, or
              collaborations, email {FOUNDER.name} directly.
            </p>
            <p className="text-caption">
              Data licensing and API access: see the{" "}
              <Link className="underline underline-offset-4" href="/developers">
                developer docs
              </Link>
              .
            </p>
          </div>
          <TrackClicks
            event="press_contact_clicked"
            props={{ channel: "email" }}
          >
            <Button asChild size="lg">
              <a
                href={`mailto:${PRESS_CONTACT_EMAIL}?subject=${encodeURIComponent("Media enquiry")}`}
              >
                <Icon icon={EnvelopeSimpleIcon} size={18} color="white" />
                {PRESS_CONTACT_EMAIL}
              </a>
            </Button>
          </TrackClicks>
        </div>
      </Section>
    </>
  );
}

function AssetGroup({
  title,
  assets,
  kind,
}: {
  title: string;
  assets: PressAsset[];
  kind: string;
}) {
  return (
    <div>
      <h3 className="mb-4 text-heading">{title}</h3>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {assets.map((a) => (
          <li
            key={a.label}
            className="surface-1 flex flex-col overflow-hidden rounded-xl"
          >
            <div
              className={`relative aspect-[16/10] ${
                kind === "logo"
                  ? a.tone === "dark"
                    ? "bg-[#181410]"
                    : "bg-[#fcf9f2]"
                  : "bg-muted"
              }`}
            >
              <Image
                alt={`${a.label} — ${a.note}`}
                className={
                  kind === "logo"
                    ? "object-contain p-6"
                    : "object-cover object-top"
                }
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                src={a.preview}
                unoptimized={a.preview.endsWith(".svg")}
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div>
                <p className="font-medium text-foreground">{a.label}</p>
                <p className="text-caption">{a.note}</p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                {a.files.map((f) => (
                  <TrackClicks
                    key={f.href}
                    event="press_asset_downloaded"
                    props={{
                      asset: a.label,
                      asset_type: kind,
                      format: f.format,
                    }}
                  >
                    <Button asChild size="sm" variant="outline">
                      <a
                        aria-label={`Download ${a.label} (${f.format})`}
                        download
                        href={f.href}
                      >
                        <Icon icon={DownloadSimpleIcon} size={14} />
                        {f.format}
                      </a>
                    </Button>
                  </TrackClicks>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
