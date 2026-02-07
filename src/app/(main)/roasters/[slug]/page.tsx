import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchRoasterBySlug } from "@/lib/data/fetch-roaster-by-slug";
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

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const canonical = `${baseUrl}/roasters/${slug}`;

  // Build title
  const title = `${roaster.name} | Indian Coffee Beans`;

  // Build description
  const description =
    roaster.description ||
    `Discover ${roaster.name}${roaster.hq_city ? ` from ${roaster.hq_city}` : ""}${roaster.hq_state ? `, ${roaster.hq_state}` : ""}. ${roaster.coffee_count ? `${roaster.coffee_count} coffee${roaster.coffee_count > 1 ? "s" : ""} available.` : ""} Browse specialty coffee roasters at Indian Coffee Beans.`;

  // Get logo for OG
  const ogImage = roaster.logo_url
    ? roasterImagePresets.roasterOG(roaster.logo_url)
    : undefined;

  // Build keywords
  const keywords: string[] = [
    roaster.name,
    ...(roaster.hq_city ? [roaster.hq_city] : []),
    ...(roaster.hq_state ? [roaster.hq_state] : []),
    ...(roaster.hq_country ? [roaster.hq_country] : []),
    "Indian coffee roasters",
    "specialty coffee roasters",
    "coffee roasters India",
  ];

  // Note: Structured data is rendered via <StructuredData> component in the page
  // to avoid duplication and reduce HTML size
  return generateSEOMetadata({
    title,
    description,
    keywords,
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

  // Generate structured data
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
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
    <>
      <StructuredData schema={[localBusinessSchema, breadcrumbSchema]} />
      <RoasterDetailPage roaster={roaster} />
    </>
  );
}
