import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchRoasterBySlugCached } from "@/lib/data/fetch-roaster-by-slug";
import { fetchReviewStats, fetchReviews } from "@/lib/data/fetch-reviews";
import { queryKeys } from "@/lib/query-keys";
import {
  generateMetadata as generateSEOMetadata,
  truncateTitle,
} from "@/lib/seo/metadata";
import { generateSchemaOrg, generateBreadcrumbSchema } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { RoasterDetailPage } from "@/components/roasters/RoasterDetailPage";
import { roasterImagePresets } from "@/lib/imagekit";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate metadata for roaster detail page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roaster = await fetchRoasterBySlugCached(slug);

  if (!roaster) {
    return generateSEOMetadata({
      title: "Roaster Not Found",
      description: "The roaster you're looking for doesn't exist.",
      noIndex: true,
    });
  }

  const stats = await fetchReviewStats("roaster", roaster.id);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
  const canonical = `${baseUrl}/roasters/${slug}`;

  const ratingCount = stats?.rating_count ?? 0;
  const coffeeCount = roaster.coffee_count ?? 0;
  const city = roaster.hq_city?.trim() || null;

  // Never promise "Reviews" on a 0-rating profile — use Ratings or city fallback.
  const ratingText =
    ratingCount > 0
      ? `, ${ratingCount} Ratings`
      : city
        ? `, ${city} Specialty Roastery`
        : "";

  // Title: {Roaster} — {City} Specialty Roastery{, [differentiator]}
  // NOTE: root layout applies "%s | Indian Coffee Beans"; do not include the suffix.
  const titleRaw = city
    ? `${roaster.name} — ${city} Specialty Roastery${
        ratingCount > 0 ? ratingText : ""
      }`
    : ratingCount > 0
      ? `${roaster.name} — ${ratingCount} Ratings`
      : `${roaster.name} — Specialty Roastery`;
  const title = truncateTitle(titleRaw);

  const differentiator =
    ratingCount > 0
      ? `${ratingCount} Ratings`
      : city
        ? `${city} Specialty Roastery`
        : "specialty coffee";

  const coffeeNoun = coffeeCount === 1 ? "coffee" : "coffees";
  const descriptionFooter =
    "Community ratings, tasting notes, and estate sourcing.";

  // Meta: Browse all {N} coffees from {Roaster} on ICB — {differentiator}. …
  // Keep < 155 chars; drop clauses instead of mid-sentence truncation.
  const buildDescription = (diff: string | null) => {
    const lead = coffeeCount
      ? diff
        ? `Browse all ${coffeeCount} ${coffeeNoun} from ${roaster.name} on ICB — ${diff}.`
        : `Browse all ${coffeeCount} ${coffeeNoun} from ${roaster.name} on ICB.`
      : diff
        ? `Discover ${roaster.name} on ICB — ${diff}.`
        : `Discover ${roaster.name} on ICB.`;
    return `${lead} ${descriptionFooter}`;
  };

  let description = buildDescription(differentiator);
  if (description.length > 155) {
    description = buildDescription(null);
  }
  if (description.length > 155) {
    description = coffeeCount
      ? `Browse all ${coffeeCount} ${coffeeNoun} from ${roaster.name} on ICB. Community ratings and tasting notes.`
      : `Discover ${roaster.name} on ICB. Community ratings and tasting notes.`;
  }

  // Get logo for OG
  const ogImage = roaster.logo_url
    ? roasterImagePresets.roasterOG(roaster.logo_url)
    : undefined;

  // Note: Structured data is rendered via <StructuredData> component in the page
  // to avoid duplication and reduce HTML size
  return generateSEOMetadata({
    title,
    description,
    image: ogImage,
    type: "website",
    canonical,
  });
}

/**
 * Roaster Detail Page (Server Component)
 */
export default async function RoasterDetailPageServer({ params }: Props) {
  const { slug } = await params;
  const roaster = await fetchRoasterBySlugCached(slug);

  if (!roaster) {
    notFound();
  }

  const queryClient = new QueryClient();

  // Fetch reviews/stats server-side and pass as props so the detail page renders
  // them in the SSR HTML (no client-hook reflow → no CLS). Also seed the query
  // cache via HydrationBoundary so QuickRating's useReviews has the data client-side.
  const [stats, reviews] = await Promise.all([
    fetchReviewStats("roaster", roaster.id).catch(() => null),
    fetchReviews("roaster", roaster.id, 10).catch(() => []),
  ]);
  queryClient.setQueryData(
    queryKeys.reviews.stats("roaster", roaster.id),
    stats
  );
  queryClient.setQueryData(
    queryKeys.reviews.byEntity("roaster", roaster.id),
    reviews
  );

  // Generate structured data
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
  const canonical = `${baseUrl}/roasters/${slug}`;

  const description =
    roaster.description ||
    `Discover ${roaster.name}${roaster.hq_city ? ` from ${roaster.hq_city}` : ""}${roaster.hq_state ? `, ${roaster.hq_state}` : ""}.`;

  const ogImage = roaster.logo_url
    ? roasterImagePresets.roasterOG(roaster.logo_url)
    : undefined;

  // Build address string for LocalBusiness schema
  const addressParts: string[] = [];
  if (roaster.hq_city) addressParts.push(roaster.hq_city);
  if (roaster.hq_state) addressParts.push(roaster.hq_state);
  if (roaster.hq_country) addressParts.push(roaster.hq_country);
  const address = addressParts.length > 0 ? addressParts.join(", ") : undefined;

  const localBusinessSchema = generateSchemaOrg({
    type: "LocalBusiness",
    name: roaster.name,
    description,
    image: ogImage,
    url: canonical,
    address,
    telephone: roaster.phone ?? undefined,
    aggregateRating:
      roaster.avg_rating && roaster.total_ratings_count
        ? {
            ratingValue: roaster.avg_rating,
            ratingCount: roaster.total_ratings_count,
          }
        : undefined,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Roasters", url: `${baseUrl}/roasters` },
    { name: roaster.name, url: canonical },
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <StructuredData schema={[localBusinessSchema, breadcrumbSchema]} />
        <RoasterDetailPage roaster={roaster} stats={stats} reviews={reviews} />
      </>
    </HydrationBoundary>
  );
}
