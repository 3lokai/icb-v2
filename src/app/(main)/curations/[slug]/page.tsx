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
import { Section } from "@/components/primitives/section";
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

  const coffeeItems = data.curations
    .flatMap((list) => list.selections)
    .slice(0, 20)
    .map((selection, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: selection.name,
        brand: { "@type": "Brand", name: selection.roaster },
        ...(selection.note ? { description: selection.note } : {}),
      },
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
      <Section spacing="default" contained={false}>
        <div className="mx-auto max-w-3xl space-y-4 text-body text-muted-foreground leading-relaxed px-4 md:px-0">
          <p>
            Curated selections are personal shortlists from people who taste
            coffee for a living — café owners, baristas, and community voices
            who know what is worth brewing right now. Each list explains why a
            coffee made the cut: flavour profile, brew method, and the context
            behind the pick.
          </p>
          <p>
            ICB does not sell these coffees and does not charge curators for
            placement. Selections link to our roaster and SKU pages where you
            can compare prices, read community ratings, and decide before you
            buy. Explore the lists below, then dive into individual coffees for
            full tasting notes and availability.
          </p>
        </div>
      </Section>
      <CurationPage data={data} />
    </>
  );
}
