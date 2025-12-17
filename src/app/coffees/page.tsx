import type { Metadata } from "next";
import { CoffeeDirectory } from "@/components/coffees/CoffeeDirectory";
import { fetchCoffeeFilterMeta } from "@/lib/data/fetch-coffee-filter-meta";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";

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

  const { filters } = parseCoffeeSearchParams(urlSearchParams);

  // Build title based on filters
  let title = "Coffee Directory | Indian Coffee Beans";
  if (filters.q) {
    title = `${filters.q} - Coffee Search | Indian Coffee Beans`;
  } else if (filters.roast_levels && filters.roast_levels.length > 0) {
    title = `${filters.roast_levels.join(", ")} Roast Coffees | Indian Coffee Beans`;
  }

  const description =
    filters.q || filters.roast_levels || filters.processes
      ? "Discover specialty coffee beans from Indian roasters. Filter by roast level, process, price, and more."
      : "Browse our complete directory of specialty coffee beans from Indian roasters. Find your perfect coffee with advanced filters.";

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

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
    openGraph: {
      title,
      description,
      type: "website",
      url: `${baseUrl}/coffees`,
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

  return (
    <CoffeeDirectory
      filterMeta={filterMeta}
      initialData={initialData}
      initialFilters={filters}
      initialPage={page}
      initialSort={sort}
    />
  );
}
