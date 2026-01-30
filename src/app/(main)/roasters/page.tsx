import type { Metadata } from "next";
import { RoasterDirectory } from "@/components/roasters/RoasterDirectory";
import { fetchRoasterFilterMeta } from "@/lib/data/fetch-roaster-filter-meta";
import { fetchRoasters } from "@/lib/data/fetch-roasters";
import { parseRoasterSearchParams } from "@/lib/filters/roaster-url";
import { generateCollectionPageSchema } from "@/lib/seo/schema";

/**
 * Generate metadata for roaster directory page
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

  const { filters, page } = parseRoasterSearchParams(urlSearchParams);

  // Build title based on filters
  let title = "Roaster Directory | Indian Coffee Beans";
  if (filters.q) {
    title = `${filters.q} - Roaster Search | Indian Coffee Beans`;
  }

  // Enhanced description based on active filters
  let description =
    "Browse our complete directory of specialty coffee roasters from India. Find your perfect roaster with advanced filters.";

  if (filters.q) {
    description = `Search results for "${filters.q}" - Discover specialty coffee roasters from India.`;
  } else if (filters.cities && filters.cities.length > 0) {
    description = `Find specialty coffee roasters in ${filters.cities.join(", ")}. Discover local Indian roasters.`;
  } else if (filters.states && filters.states.length > 0) {
    description = `Discover specialty coffee roasters in ${filters.states.join(", ")}. Find your perfect roaster.`;
  } else if (filters.countries && filters.countries.length > 0) {
    description = `Browse specialty coffee roasters from ${filters.countries.join(", ")}.`;
  } else if (filters.q || filters.countries) {
    description =
      "Discover specialty coffee roasters from India. Filter by location and more.";
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

  // Build full URL with query params for canonical and OpenGraph
  const currentUrl = new URL(`${baseUrl}/roasters`);
  urlSearchParams.forEach((value, key) => {
    currentUrl.searchParams.set(key, value);
  });
  const fullUrl = currentUrl.toString();

  // Determine if page should be indexed (index page 1, noindex pages > 1)
  const hasComplexFilters =
    (filters.cities?.length ?? 0) > 0 ||
    (filters.states?.length ?? 0) > 0 ||
    (filters.countries?.length ?? 0) > 0;
  const shouldIndex = page === 1 && !hasComplexFilters;

  return {
    title,
    description,
    keywords: [
      "Indian coffee roasters",
      "specialty coffee roasters India",
      "roaster directory",
      "coffee roasters near me",
      "Indian roasters",
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
 * Roaster Directory Page (Server Component)
 * Fetches initial data on server and renders client component
 */
export default async function RoastersPage({
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
    parseRoasterSearchParams(urlSearchParams);

  // Fetch initial data and filter meta in parallel for better performance
  const [initialData, filterMeta] = await Promise.all([
    fetchRoasters(filters, page, limit, sort),
    fetchRoasterFilterMeta(),
  ]);

  // Generate structured data for filtered views
  const hasFilters = Object.keys(filters).length > 0;
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const currentUrl = new URL(`${baseUrl}/roasters`);
  urlSearchParams.forEach((value, key) => {
    currentUrl.searchParams.set(key, value);
  });

  const collectionSchema = hasFilters
    ? generateCollectionPageSchema(
        "Roaster Directory",
        "Discover specialty coffee roasters from India",
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
      <RoasterDirectory
        filterMeta={filterMeta}
        initialData={initialData}
        initialFilters={filters}
        initialPage={page}
        initialSort={sort}
      />
    </>
  );
}
