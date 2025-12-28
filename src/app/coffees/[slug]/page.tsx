import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchCoffeeBySlug } from "@/lib/data/fetch-coffee-by-slug";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateSchemaOrg } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeeDetailPage } from "@/components/coffees/CoffeeDetailPage";
import { coffeeImagePresets } from "@/lib/imagekit";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate metadata for coffee detail page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const coffee = await fetchCoffeeBySlug(slug);

  if (!coffee) {
    return {
      title: "Coffee Not Found",
      description: "The coffee you're looking for doesn't exist.",
    };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const canonical = `${baseUrl}/coffees/${slug}`;

  // Build title
  const title = coffee.roaster
    ? `${coffee.name} by ${coffee.roaster.name} | Indian Coffee Beans`
    : `${coffee.name} | Indian Coffee Beans`;

  // Build description
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

  // Get first image for OG
  const ogImage =
    coffee.images.length > 0 && coffee.images[0].imagekit_url
      ? coffeeImagePresets.coffeeOG(coffee.images[0].imagekit_url)
      : undefined;

  // Build keywords
  const keywords: string[] = [
    coffee.name,
    ...(coffee.roaster ? [coffee.roaster.name] : []),
    ...(coffee.roast_level_raw ? [coffee.roast_level_raw] : []),
    ...(coffee.process_raw ? [coffee.process_raw] : []),
    ...coffee.flavor_notes.map((n) => n.label),
    "Indian coffee",
    "specialty coffee",
    "coffee beans",
  ];

  // Product details for OG
  const productDetails = {
    price: coffee.summary.min_price_in_stock
      ? `${coffee.summary.min_price_in_stock}`
      : undefined,
    currency: "INR",
    availability: (coffee.summary.in_stock_count ?? 0) > 0,
  };

  // Generate structured data
  const productSchema = generateSchemaOrg({
    type: "Product",
    name: coffee.name,
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

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Coffees",
        item: `${baseUrl}/coffees`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: coffee.name,
        item: canonical,
      },
    ],
  };

  return generateSEOMetadata({
    title,
    description,
    keywords,
    image: ogImage,
    type: "product",
    canonical,
    productDetails,
    other: {
      "application/ld+json": JSON.stringify([productSchema, breadcrumbSchema]),
    },
  });
}

/**
 * Coffee Detail Page (Server Component)
 */
export default async function CoffeeDetailPageServer({ params }: Props) {
  const { slug } = await params;
  const coffee = await fetchCoffeeBySlug(slug);

  if (!coffee) {
    notFound();
  }

  // Generate structured data
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const canonical = `${baseUrl}/coffees/${slug}`;

  const description =
    coffee.summary.seo_desc ||
    `Discover ${coffee.name}${coffee.roaster ? ` by ${coffee.roaster.name}` : ""}. ${coffee.roast_level_raw || coffee.roast_level || ""} roast, ${coffee.process_raw || coffee.process || ""} process.`;

  const ogImage =
    coffee.images.length > 0 && coffee.images[0].imagekit_url
      ? coffeeImagePresets.coffeeOG(coffee.images[0].imagekit_url)
      : undefined;

  const productSchema = generateSchemaOrg({
    type: "Product",
    name: coffee.name,
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
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Coffees",
        item: `${baseUrl}/coffees`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: coffee.name,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <StructuredData schema={productSchema} />
      <StructuredData schema={breadcrumbSchema} />
      <CoffeeDetailPage coffee={coffee} />
    </>
  );
}
