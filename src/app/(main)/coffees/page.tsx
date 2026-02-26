import type { Metadata } from "next";
import { Suspense } from "react";
import { CoffeeDirectory } from "@/components/coffees/CoffeeDirectory";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { fetchCoffeeFilterMeta } from "@/lib/data/fetch-coffee-filter-meta";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import type { CoffeeFilters } from "@/types/coffee-types";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeesPageContentSkeleton } from "@/components/coffees/CoffeesPageContentSkeleton";

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

  // Build full URL with query params for OpenGraph (not for canonical)
  const currentUrl = new URL(`${baseUrl}/coffees`);
  urlSearchParams.forEach((value, key) => {
    currentUrl.searchParams.set(key, value);
  });
  const fullUrl = currentUrl.toString();

  // Canonical always points to the clean base path (no query params)
  // This prevents infinite filter combinations from creating unique canonical URLs
  const canonicalUrl = `${baseUrl}/coffees`;

  // Determine if page should be indexed (index page 1, noindex pages > 1)
  const hasComplexFilters =
    (filters.roaster_ids?.length ?? 0) > 0 ||
    (filters.region_ids?.length ?? 0) > 0 ||
    (filters.estate_ids?.length ?? 0) > 0 ||
    (filters.flavor_keys?.length ?? 0) > 0 ||
    (filters.canon_flavor_node_ids?.length ?? 0) > 0 ||
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
      canonical: canonicalUrl,
      languages: { en: canonicalUrl, "x-default": canonicalUrl },
    },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      type: "website",
      url: fullUrl,
      images: [
        {
          url: `${baseUrl}/api/og?title=${encodeURIComponent(title)}&type=website`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `${baseUrl}/api/og?title=${encodeURIComponent(title)}&type=website`,
      ],
    },
  };
}

/** Maps for breadcrumb labels (one primary filter level on /coffees) */
const BREW_METHOD_LABELS: Record<string, string> = {
  aeropress: "AeroPress",
  pour_over: "Pour Over",
  french_press: "French Press",
  espresso: "Espresso",
  south_indian_filter: "South Indian Filter",
  channi: "Channi",
  coffee_filter: "Coffee Filter",
};
const ROAST_LEVEL_LABELS: Record<string, string> = {
  light: "Light",
  medium: "Medium",
  dark: "Dark",
};

function buildCoffeesPageBreadcrumbs(
  filters: CoffeeFilters,
  currentUrl: string,
  baseUrl: string
): Array<{ name: string; url: string }> {
  const items: Array<{ name: string; url: string }> = [
    { name: "Home", url: baseUrl },
    { name: "Coffees", url: `${baseUrl}/coffees` },
  ];
  if (filters.brew_method_ids?.length) {
    const value = filters.brew_method_ids
      .map((id) => BREW_METHOD_LABELS[id] ?? id)
      .join(", ");
    items.push({ name: "Brew Method", url: `${baseUrl}/coffees` });
    items.push({ name: value, url: currentUrl });
  } else if (filters.roast_levels?.length) {
    const value = filters.roast_levels
      .map((r) => ROAST_LEVEL_LABELS[r] ?? r)
      .join(", ");
    items.push({ name: "Roast Level", url: `${baseUrl}/coffees` });
    items.push({ name: value, url: currentUrl });
  } else if (
    filters.max_price !== undefined ||
    filters.min_price !== undefined
  ) {
    const value =
      filters.max_price !== undefined &&
      (filters.min_price === undefined || filters.min_price === 0)
        ? `Under ₹${filters.max_price}`
        : filters.min_price !== undefined && filters.max_price !== undefined
          ? `₹${filters.min_price}–₹${filters.max_price}`
          : filters.min_price !== undefined
            ? `From ₹${filters.min_price}`
            : "Price range";
    items.push({ name: "Price Range", url: `${baseUrl}/coffees` });
    items.push({ name: value, url: currentUrl });
  } else {
    items[items.length - 1]!.url = currentUrl;
  }
  return items;
}

async function CoffeesPageContent({
  params,
}: {
  params: { [key: string]: string | string[] | undefined };
}) {
  const urlSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => urlSearchParams.append(key, v));
      } else {
        urlSearchParams.set(key, value);
      }
    }
  }

  const { filters, page, limit, sort } =
    parseCoffeeSearchParams(urlSearchParams);

  const [initialData, filterMeta] = await Promise.all([
    fetchCoffees(filters, page, limit, sort),
    fetchCoffeeFilterMeta(),
  ]);

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

  const breadcrumbItems = buildCoffeesPageBreadcrumbs(
    filters,
    currentUrl.toString(),
    baseUrl
  );
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

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
      <StructuredData schema={breadcrumbSchema} />
      <CollectionGrid
        maxItems={8}
        cardVariant="small"
        overline="Optional Quick Start"
        title="Start with a"
        titleAccent="Collection"
        description="Hand-picked groupings based on common brewing and flavour patterns."
        ctaText="Browse All Coffees"
        ctaHref="/coffees"
        mobileDecorativeText="Quick Start"
      />
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

/**
 * Coffee Directory Page (Server Component)
 * PageHeader streams immediately; data-dependent content streams in via Suspense
 */
export default async function CoffeesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader
        backgroundImage="/images/hero-bg.avif"
        backgroundImageAlt="Coffee beans background"
        description="Discover over hundreds of specialty coffee beans from roasters across India. Verified data, verified roasters, verified taste."
        overline="Specialty Coffee Directory"
        rightSideContent={
          <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Updated Regularly
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
        title={
          <>
            Explore India&apos;s{" "}
            <span className="text-accent italic">Exceptional</span> Beans.
          </>
        }
      />
      <Suspense fallback={<CoffeesPageContentSkeleton />}>
        <CoffeesPageContent params={params} />
      </Suspense>
    </>
  );
}
