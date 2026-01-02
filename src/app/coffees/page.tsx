import type { Metadata } from "next";
import { CoffeeDirectory } from "@/components/coffees/CoffeeDirectory";
import { fetchCoffeeFilterMeta } from "@/lib/data/fetch-coffee-filter-meta";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import { generateCollectionPageSchema } from "@/lib/seo/schema";

/**
 * Generate metadata for coffee directory page
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const urlSearchParams = new URLSearchParams();

  // Convert searchParams to URLSearchParams
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.set(key, value);
      }
    }
  }

  const { filters, page } = parseCoffeeSearchParams(urlSearchParams);

  // Build title based on filters
  let title = "Coffee Directory | Indian Coffee Beans";
  if (filters.q) {
    title = `${filters.q} - Coffee Search | Indian Coffee Beans`;
  } else if (filters.roast_levels && filters.roast_levels.length > 0) {
    title = `${filters.roast_levels.join(", ")} Roast Coffees | Indian Coffee Beans`;
  }

  // Enhanced description based on active filters
  let description =
    "Browse our complete directory of specialty coffee beans from Indian roasters. Find your perfect coffee with advanced filters.";

  if (filters.q) {
    description = `Search results for "${filters.q}" - Discover specialty coffee beans from Indian roasters.`;
  } else if (filters.roast_levels && filters.roast_levels.length > 0) {
    description = `Discover ${filters.roast_levels.join(", ")} roast coffees from Indian roasters. Filter by process, price, and more.`;
  } else if (filters.roaster_ids && filters.roaster_ids.length > 0) {
    description = `Browse coffees from selected roasters. Find your perfect specialty coffee beans.`;
  } else if (filters.max_price) {
    description = `Find specialty coffees under ₹${filters.max_price} from Indian roasters.`;
  } else if (filters.processes && filters.processes.length > 0) {
    description = `Discover ${filters.processes.join(", ")} processed coffees from Indian roasters.`;
  } else if (filters.q || filters.roast_levels || filters.processes) {
    description =
      "Discover specialty coffee beans from Indian roasters. Filter by roast level, process, price, and more.";
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

  // Build full URL with query params for canonical and OpenGraph
  const currentUrl = new URL(`${baseUrl}/coffees`);
  urlSearchParams.forEach((value, key) => {
    currentUrl.searchParams.set(key, value);
  });
  const fullUrl = currentUrl.toString();

  // Determine if page should be indexed (index page 1, noindex pages > 1)
  const hasComplexFilters =
    (filters.roaster_ids?.length ?? 0) > 0 ||
    (filters.region_ids?.length ?? 0) > 0 ||
    (filters.estate_ids?.length ?? 0) > 0 ||
    (filters.flavor_keys?.length ?? 0) > 0 ||
    (filters.brew_method_ids?.length ?? 0) > 0;
  const shouldIndex = page === 1 && !hasComplexFilters;

  return {
    title,
    description,
    keywords: [
      "Indian coffee",
      "specialty coffee India",
      "coffee directory",
      "coffee beans India",
      "roast levels",
      "coffee filters",
    ],
    alternates: {
      canonical: fullUrl,
    },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      url: fullUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Coffee Directory Page (Server Component)
 * Fetches initial data on server and renders client component
 */
export default async function CoffeesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const urlSearchParams = new URLSearchParams();

  // Convert searchParams to URLSearchParams
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.set(key, value);
      }
    }
  }

  // Parse search params using the same helper as API route
  const { filters, page, limit, sort } =
    parseCoffeeSearchParams(urlSearchParams);

  // Fetch initial data and filter meta in parallel for better performance
  const [initialData, filterMeta] = await Promise.all([
    fetchCoffees(filters, page, limit, sort),
    fetchCoffeeFilterMeta(),
  ]);

  // Generate structured data for filtered views
  const hasFilters = Object.keys(filters).length > 0;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const currentUrl = new URL(`${baseUrl}/coffees`);
  urlSearchParams.forEach((value, key) => {
    currentUrl.searchParams.set(key, value);
  });

  const collectionSchema = hasFilters
    ? generateCollectionPageSchema(
        "Coffee Directory",
        "Discover specialty coffee beans from Indian roasters",
        currentUrl.toString()
      )
    : null;

  return (
    <>
      {collectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(collectionSchema),
          }}
        />
      )}
      <CoffeeDirectory
        filterMeta={filterMeta}
        initialData={initialData}
        initialFilters={filters}
        initialPage={page}
        initialSort={sort}
      />
    </>
  );
}
