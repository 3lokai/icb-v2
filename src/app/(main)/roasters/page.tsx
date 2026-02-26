import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { RoasterDirectory } from "@/components/roasters/RoasterDirectory";
import { RoastersPageContentSkeleton } from "@/components/roasters/RoastersPageContentSkeleton";
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

  // Build full URL with query params for OpenGraph (not for canonical)
  const currentUrl = new URL(`${baseUrl}/roasters`);
  urlSearchParams.forEach((value, key) => {
    currentUrl.searchParams.set(key, value);
  });
  const fullUrl = currentUrl.toString();

  // Canonical always points to the clean base path (no query params)
  const canonicalUrl = `${baseUrl}/roasters`;

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

async function RoastersPageContent({
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
    parseRoasterSearchParams(urlSearchParams);

  const [initialData, filterMeta] = await Promise.all([
    fetchRoasters(filters, page, limit, sort),
    fetchRoasterFilterMeta(),
  ]);

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

/**
 * Roaster Directory Page (Server Component)
 * PageHeader streams immediately; data-dependent content streams in via Suspense
 */
export default async function RoastersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <>
      <PageHeader
        backgroundImage="/images/hero-roasters.avif"
        backgroundImageAlt="Roastery background"
        description="Discover specialty coffee roasters from across India. Connect with the artisans dedicated to bringing out the best in every bean."
        overline="Artisan Roaster Directory"
        rightSideContent={
          <div className="flex items-center gap-3 text-micro text-white/50 uppercase tracking-widest font-medium">
            <span className="h-1 w-1 rounded-full bg-accent/40" />
            Manually Reviewed
            <span className="h-1 w-1 rounded-full bg-accent/40" />
          </div>
        }
        title={
          <>
            India&apos;s <span className="text-accent italic">Passionate</span>{" "}
            Roasters.
          </>
        }
      />
      <Suspense fallback={<RoastersPageContentSkeleton />}>
        <RoastersPageContent params={params} />
      </Suspense>
    </>
  );
}
