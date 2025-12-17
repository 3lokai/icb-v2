import type { Metadata } from "next";
import { RoasterDirectory } from "@/components/roasters/RoasterDirectory";
import { fetchRoasterFilterMeta } from "@/lib/data/fetch-roaster-filter-meta";
import { fetchRoasters } from "@/lib/data/fetch-roasters";
import { parseRoasterSearchParams } from "@/lib/filters/roaster-url";

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

  const { filters } = parseRoasterSearchParams(urlSearchParams);

  // Build title based on filters
  let title = "Roaster Directory | Indian Coffee Beans";
  if (filters.q) {
    title = `${filters.q} - Roaster Search | Indian Coffee Beans`;
  }

  const description =
    filters.q || filters.countries
      ? "Discover specialty coffee roasters from India. Filter by location and more."
      : "Browse our complete directory of specialty coffee roasters from India. Find your perfect roaster with advanced filters.";

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

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
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/roasters`,
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

  return (
    <RoasterDirectory
      filterMeta={filterMeta}
      initialData={initialData}
      initialFilters={filters}
      initialPage={page}
      initialSort={sort}
    />
  );
}
