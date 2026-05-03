import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchRoasterBySlug } from "@/lib/data/fetch-roaster-by-slug";
import { fetchReviewStats, fetchReviews } from "@/lib/data/fetch-reviews";
import { queryKeys } from "@/lib/query-keys";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
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
  const roaster = await fetchRoasterBySlug(slug);

  if (!roaster) {
    return {
      title: "Roaster Not Found",
      description: "The roaster you're looking for doesn't exist.",
    };
  }

  const stats = await fetchReviewStats("roaster", roaster.id);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
  const canonical = `${baseUrl}/roasters/${slug}`;

  const reviewCount = stats?.review_count ?? 0;

  const title =
    reviewCount >= 5
      ? `${roaster.name} Reviews & Coffees — Rated by ICB Community`
      : roaster.coffee_count
        ? `${roaster.name} — ${roaster.coffee_count} Coffees, Reviews & Tasting Notes`
        : `${roaster.name} Coffee Reviews | Indian Coffee Beans`;

  const avgRating = stats?.avg_rating ?? null;

  const ratingBlurb =
    reviewCount >= 5 && avgRating != null
      ? `Community-rated ${avgRating.toFixed(1)}/5 from ${reviewCount} reviews. `
      : "";

  const locationBlurb = roaster.hq_city
    ? `Based in ${roaster.hq_city}${roaster.hq_state ? `, ${roaster.hq_state}` : ""}. `
    : "";

  const coffeeBlurb = roaster.coffee_count
    ? `Browse ${roaster.coffee_count} ${roaster.coffee_count === 1 ? "coffee" : "coffees"} with tasting notes, processing methods, and unbiased reviews from Indian coffee drinkers. `
    : "";

  const description =
    ratingBlurb || coffeeBlurb
      ? `${ratingBlurb}${locationBlurb}${coffeeBlurb}No sponsorships. Just data and community.`
      : roaster.description?.slice(0, 160) ||
        `${locationBlurb}Discover ${roaster.name} on India's neutral specialty coffee directory.`;

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
  const roaster = await fetchRoasterBySlug(slug);

  if (!roaster) {
    notFound();
  }

  const queryClient = new QueryClient();
  const reviewStaleMs = 30 * 1000;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.reviews.stats("roaster", roaster.id),
      queryFn: () => fetchReviewStats("roaster", roaster.id),
      staleTime: reviewStaleMs,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.reviews.byEntity("roaster", roaster.id),
      queryFn: () => fetchReviews("roaster", roaster.id, 10),
      staleTime: reviewStaleMs,
    }),
  ]);

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
        <RoasterDetailPage roaster={roaster} />
      </>
    </HydrationBoundary>
  );
}
