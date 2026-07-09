import { notFound } from "next/navigation";
import { getCuratorBySlug } from "@/data/curations";
import { CurationPage } from "@/components/curations/CurationPage";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  getSeoBaseUrl,
} from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCuratorBySlug(slug);

  if (!data) return { title: "Curator Not Found" };

  const title = `${data.curator.name}'s Curated Selections`;
  const description = (data.curator.story ?? "").slice(0, 160);

  return generateSEOMetadata({
    title,
    description,
    canonical: `/curations/${slug}`,
    type: "website",
    image: data.curator.logo ?? undefined,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const data = await getCuratorBySlug(slug);

  if (!data) {
    notFound();
  }

  const baseUrl = getSeoBaseUrl();
  const curationUrl = `${baseUrl}/curations/${slug}`;
  const description = (data.curator.story ?? "").slice(0, 160);

  // Curation selections carry no price/rating/slug data, so a Product can never
  // be valid for Google (needs one of offers/review/aggregateRating). Emit plain
  // ListItems (name only) instead — no Product validation obligation.
  // ponytail: name-only ListItem; add url if selection slugs are ever exposed.
  const coffeeItems = data.curations
    .flatMap((list) => list.selections)
    .slice(0, 20)
    .map((selection, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: selection.name,
    }));

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Curations", url: `${baseUrl}/curations` },
    { name: data.curator.name, url: curationUrl },
  ]);

  const collectionSchema = generateCollectionPageSchema(
    `${data.curator.name}'s Curated Selections`,
    description || `Coffee picks curated by ${data.curator.name}.`,
    curationUrl,
    coffeeItems
  );

  return (
    <>
      <StructuredData schema={[collectionSchema, breadcrumbSchema]} />
      <CurationPage data={data} />
    </>
  );
}
