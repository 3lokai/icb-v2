import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchCoffeeByRoasterAndSlug } from "@/lib/data/fetch-coffee-by-slug";
import { fetchReviewStats, fetchReviews } from "@/lib/data/fetch-reviews";
import { queryKeys } from "@/lib/query-keys";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateSchemaOrg, generateBreadcrumbSchema } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeeDetailPage } from "@/components/coffees/CoffeeDetailPage";
import { coffeeImagePresets } from "@/lib/imagekit";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { CoffeeDetail } from "@/types/coffee-types";

type Props = {
  params: Promise<{ slug: string; coffeeSlug: string }>;
};

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

function coffeeOriginLabel(
  coffee: Pick<CoffeeDetail, "estates" | "regions">
): string | null {
  const estateName = coffee.estates?.[0]?.name;
  const firstRegion = coffee.regions[0];
  return (
    estateName ||
    firstRegion?.display_name ||
    (firstRegion &&
      [firstRegion.country, firstRegion.state, firstRegion.subregion]
        .filter(Boolean)
        .join(", ")) ||
    firstRegion?.subregion ||
    null
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: roasterSlug, coffeeSlug } = await params;
  const coffee = await fetchCoffeeByRoasterAndSlug(roasterSlug, coffeeSlug);

  if (!coffee) {
    return {
      title: "Coffee Not Found",
      description: "The coffee you're looking for doesn't exist.",
    };
  }

  const stats = await fetchReviewStats("coffee", coffee.id);
  const reviewCount = stats?.review_count ?? 0;
  const roasterName = coffee.roaster.name;

  const processStr = (coffee.process_raw || coffee.process || "").trim();
  const processPart = processStr ? capitalizeFirstLetter(processStr) : "";
  const roastStr = (coffee.roast_level_raw || coffee.roast_level || "").trim();
  const roastPart = roastStr ? capitalizeFirstLetter(roastStr) : "";

  const titleBase = `${coffee.name} by ${roasterName}`;
  const title =
    reviewCount >= 5
      ? `${titleBase} — Reviews & Tasting Notes`
      : processPart && roastPart
        ? `${titleBase} — ${processPart}, ${roastPart} | Indian Coffee Beans`
        : processPart || roastPart
          ? `${titleBase} — ${processPart || roastPart} | Indian Coffee Beans`
          : `${titleBase} | Indian Coffee Beans`;

  const originLabel = coffeeOriginLabel(coffee);
  const attrParts = [processPart, originLabel, roastPart].filter(Boolean);
  const attrLine = attrParts.join(" · ");

  const avgRating = stats?.avg_rating ?? null;
  const ratingBlurb =
    reviewCount >= 5 && avgRating != null
      ? `Community-rated ${avgRating.toFixed(1)}/5 from ${reviewCount} reviews. `
      : "";

  const descriptionFooter =
    "Read tasting notes and unbiased ratings before you buy. No sponsorships. Just data and community.";

  const description = ratingBlurb
    ? `${ratingBlurb}${attrLine ? `${attrLine}. ` : ""}${descriptionFooter}`
    : attrLine
      ? `${attrLine}. ${descriptionFooter}`
      : coffee.summary.seo_desc?.trim()
        ? coffee.summary.seo_desc.trim().length > 160
          ? `${coffee.summary.seo_desc.trim().slice(0, 157)}…`
          : coffee.summary.seo_desc.trim()
        : `Discover ${coffee.name} by ${roasterName}. ${descriptionFooter}`;

  const canonical = `${baseUrl}/roasters/${roasterSlug}/coffees/${coffeeSlug}`;
  const ogImage =
    coffee.images.length > 0 && coffee.images[0].imagekit_url
      ? coffeeImagePresets.coffeeOG(coffee.images[0].imagekit_url)
      : undefined;
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

  const queryClient = new QueryClient();
  const reviewStaleMs = 30 * 1000;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.reviews.stats("coffee", coffee.id),
      queryFn: () => fetchReviewStats("coffee", coffee.id),
      staleTime: reviewStaleMs,
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.reviews.byEntity("coffee", coffee.id),
      queryFn: () => fetchReviews("coffee", coffee.id, 10),
      staleTime: reviewStaleMs,
    }),
  ]);

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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Roasters", url: `${baseUrl}/roasters` },
    {
      name: coffee.roaster?.name ?? "Roaster",
      url: `${baseUrl}/roasters/${roasterSlug}`,
    },
    { name: "Coffees", url: `${baseUrl}/roasters/${roasterSlug}/coffees` },
    { name: coffee.name ?? "Coffee", url: canonical },
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <StructuredData schema={[productSchema, breadcrumbSchema]} />
        <CoffeeDetailPage coffee={coffee} />
      </>
    </HydrationBoundary>
  );
}
