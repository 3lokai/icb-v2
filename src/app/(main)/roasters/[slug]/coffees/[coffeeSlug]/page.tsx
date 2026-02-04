import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchCoffeeByRoasterAndSlug } from "@/lib/data/fetch-coffee-by-slug";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateSchemaOrg } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeeDetailPage } from "@/components/coffees/CoffeeDetailPage";
import { coffeeImagePresets } from "@/lib/imagekit";

type Props = {
  params: Promise<{ slug: string; coffeeSlug: string }>;
};

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: roasterSlug, coffeeSlug } = await params;
  const coffee = await fetchCoffeeByRoasterAndSlug(roasterSlug, coffeeSlug);

  if (!coffee) {
    return {
      title: "Coffee Not Found",
      description: "The coffee you're looking for doesn't exist.",
    };
  }

  const canonical = `${baseUrl}/roasters/${roasterSlug}/coffees/${coffeeSlug}`;
  const title = coffee.roaster
    ? `${coffee.name} by ${coffee.roaster.name} | Indian Coffee Beans`
    : `${coffee.name} | Indian Coffee Beans`;
  const description =
    coffee.summary.seo_desc ||
    `Discover ${coffee.name}${coffee.roaster ? ` by ${coffee.roaster.name}` : ""}. ${coffee.roast_level_raw || coffee.roast_level || ""} roast, ${coffee.process_raw || coffee.process || ""} process. ${
      coffee.flavor_notes.length > 0
        ? `Flavor notes: ${coffee.flavor_notes
            .slice(0, 3)
            .map((n) => n.label)
            .join(", ")}.`
        : ""
    } Available at Indian Coffee Beans.`;
  const ogImage =
    coffee.images.length > 0 && coffee.images[0].imagekit_url
      ? coffeeImagePresets.coffeeOG(coffee.images[0].imagekit_url)
      : undefined;
  const keywords: string[] = [
    coffee.name ?? "",
    ...(coffee.roaster ? [coffee.roaster.name] : []),
    ...(coffee.roast_level_raw ? [coffee.roast_level_raw] : []),
    ...(coffee.process_raw ? [coffee.process_raw] : []),
    ...coffee.flavor_notes.map((n) => n.label),
    "Indian coffee",
    "specialty coffee",
    "coffee beans",
  ];
  const productDetails = {
    price: coffee.summary.min_price_in_stock
      ? `${coffee.summary.min_price_in_stock}`
      : undefined,
    currency: "INR",
    availability: (coffee.summary.in_stock_count ?? 0) > 0,
  };

  return generateSEOMetadata({
    title,
    description,
    keywords,
    image: ogImage,
    type: "product",
    canonical,
    productDetails,
  });
}

export default async function RoasterCoffeeDetailPageServer({ params }: Props) {
  const { slug: roasterSlug, coffeeSlug } = await params;
  const coffee = await fetchCoffeeByRoasterAndSlug(roasterSlug, coffeeSlug);

  if (!coffee) {
    notFound();
  }

  const canonical = `${baseUrl}/roasters/${roasterSlug}/coffees/${coffeeSlug}`;
  const description =
    coffee.summary.seo_desc ||
    `Discover ${coffee.name}${coffee.roaster ? ` by ${coffee.roaster.name}` : ""}. ${coffee.roast_level_raw || coffee.roast_level || ""} roast, ${coffee.process_raw || coffee.process || ""} process.`;
  const ogImage =
    coffee.images.length > 0 && coffee.images[0].imagekit_url
      ? coffeeImagePresets.coffeeOG(coffee.images[0].imagekit_url)
      : undefined;

  const productSchema = generateSchemaOrg({
    type: "Product",
    name: coffee.name ?? "",
    description,
    image: ogImage,
    url: canonical,
    brand: coffee.roaster?.name,
    price:
      coffee.summary.best_normalized_250g ||
      coffee.summary.min_price_in_stock ||
      undefined,
    currency: "INR",
    availability:
      (coffee.summary.in_stock_count ?? 0) > 0 ? "InStock" : "OutOfStock",
    aggregateRating:
      coffee.rating_avg && coffee.rating_count > 0
        ? {
            ratingValue: coffee.rating_avg,
            ratingCount: coffee.rating_count,
          }
        : undefined,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Roasters",
        item: `${baseUrl}/roasters`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: coffee.roaster?.name ?? "Roaster",
        item: `${baseUrl}/roasters/${roasterSlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: coffee.name ?? "Coffee",
        item: canonical,
      },
    ],
  };

  return (
    <>
      <StructuredData schema={[productSchema, breadcrumbSchema]} />
      <CoffeeDetailPage coffee={coffee} />
    </>
  );
}
