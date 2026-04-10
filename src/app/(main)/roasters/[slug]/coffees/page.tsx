import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchRoasterBySlug } from "@/lib/data/fetch-roaster-by-slug";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { RoasterCoffeesSelectionPage } from "@/components/roasters/RoasterCoffeesSelectionPage";

type Props = {
  params: Promise<{ slug: string }>;
};

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

/**
 * Generate metadata for the roaster coffees collection page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const roaster = await fetchRoasterBySlug(slug, { limit: 50 }); // Fetch up to 50 coffees for metadata

  if (!roaster) {
    return {
      title: "Roaster Not Found",
      description: "The roaster you're looking for doesn't exist.",
    };
  }

  const canonical = `${baseUrl}/roasters/${slug}/coffees`;
  const title = `${roaster.name} Coffees | Indian Coffee Beans`;
  const description = `Explore the complete specialty coffee collection from ${roaster.name}. Grouped by roast level, from light to dark. Discover your next favorite Indian coffee beans.`;

  return generateSEOMetadata({
    title,
    description,
    canonical,
    type: "website",
    keywords: [
      roaster.name,
      `${roaster.name} coffee`,
      `${roaster.name} beans`,
      "Indian specialty coffee",
      "roast level collection",
    ],
  });
}

/**
 * Roaster Coffees Collection Page (Server Component)
 */
export default async function RoasterCoffeesPageServer({ params }: Props) {
  const { slug } = await params;
  // Fetch more coffees than the default 15 for the dedicated catalog page
  const roaster = await fetchRoasterBySlug(slug, { limit: 100 });

  if (!roaster) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Roasters", url: `${baseUrl}/roasters` },
    { name: roaster.name, url: `${baseUrl}/roasters/${slug}` },
    { name: "Coffees", url: `${baseUrl}/roasters/${slug}/coffees` },
  ]);

  return (
    <>
      <StructuredData schema={[breadcrumbSchema]} />
      <RoasterCoffeesSelectionPage roaster={roaster} />
    </>
  );
}
