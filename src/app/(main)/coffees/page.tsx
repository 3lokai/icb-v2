import type { Metadata } from "next";
import { Suspense } from "react";
import { CoffeeDirectory } from "@/components/coffees/CoffeeDirectory";
import { DiscoveryAccordionGrid } from "@/components/discovery/DiscoveryAccordionGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { fetchCoffeeFilterMeta } from "@/lib/data/fetch-coffee-filter-meta";
import { fetchCoffees } from "@/lib/data/fetch-coffees";
import type { CoffeeFilters, CoffeeSummary } from "@/types/coffee-types";
import { parseCoffeeSearchParams } from "@/lib/filters/coffee-url";
import {
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";
import { CoffeesPageContentSkeleton } from "@/components/coffees/CoffeesPageContentSkeleton";
import { PageShell } from "@/components/primitives/page-shell";
import { Section } from "@/components/primitives/section";
import { Stack } from "@/components/primitives/stack";

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
  let title = "Buy Coffee Beans in India (1,400+ SKUs) | Indian Coffee Beans";
  if (filters.q) {
    title = `${filters.q} - Coffee Search | Indian Coffee Beans`;
  } else if (filters.roast_levels && filters.roast_levels.length > 0) {
    title = `${filters.roast_levels.join(", ")} Roast Coffees | Indian Coffee Beans`;
  }

  // Enhanced description based on active filters
  let description =
    "Browse 1,400+ Indian coffee SKUs by roast level, process, flavour notes, and price. Community ratings on every coffee.";

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
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";

  // Build full URL with query params for OpenGraph (not for canonical)
  const currentUrl = new URL(`${baseUrl}/coffees`);
  urlSearchParams.forEach((value, key) => {
    currentUrl.searchParams.set(key, value);
  });
  const fullUrl = currentUrl.toString();

  // Canonical always points to the clean base path (no query params)
  // This prevents infinite filter combinations from creating unique canonical URLs
  const canonicalUrl = `${baseUrl}/coffees`;

  // Index only the bare /coffees URL — any query string = noindex (avoid filter URL indexation)
  const hasAnySearchParams = urlSearchParams.toString().length > 0;
  const shouldIndex = page === 1 && !hasAnySearchParams;

  return {
    title,
    description,
    keywords: [
      "buy coffee beans India",
      "Indian coffee beans online",
      "specialty coffee beans India",
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

function buildCoffeeListItems(
  coffees: CoffeeSummary[],
  baseUrl: string
): Array<Record<string, unknown>> {
  return coffees
    .filter((c) => c.slug && c.roaster_slug && c.name)
    .map((c, i) => {
      const item: Record<string, unknown> = {
        "@type": "Product",
        name: c.name,
        url: `${baseUrl}/roasters/${c.roaster_slug}/coffees/${c.slug}`,
      };
      if (c.image_url) item.image = c.image_url;
      const price = c.min_price_in_stock ?? c.best_normalized_250g;
      if (price != null) {
        item.offers = {
          "@type": "Offer",
          price,
          priceCurrency: "INR",
          availability: `https://schema.org/${(c.in_stock_count ?? 0) > 0 ? "InStock" : "OutOfStock"}`,
        };
      }
      if (c.rating_avg != null && c.rating_count > 0) {
        item.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: c.rating_avg,
          ratingCount: c.rating_count,
        };
      }
      return { "@type": "ListItem", position: i + 1, item };
    });
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

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com";
  const currentUrl = new URL(`${baseUrl}/coffees`);
  urlSearchParams.forEach((value, key) => {
    currentUrl.searchParams.set(key, value);
  });

  const coffeeItems = buildCoffeeListItems(initialData.items, baseUrl);
  const collectionSchema = generateCollectionPageSchema(
    "Coffee Directory",
    "Discover specialty coffee beans from Indian roasters",
    currentUrl.toString(),
    coffeeItems
  );

  const breadcrumbItems = buildCoffeesPageBreadcrumbs(
    filters,
    currentUrl.toString(),
    baseUrl
  );
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  return (
    <>
      <StructuredData schema={[collectionSchema, breadcrumbSchema]} />

      <PageShell maxWidth="7xl">
        <Stack gap="12">
          {/* Top Discovery Hub - Tight Section */}
          <Section
            spacing="tight"
            contained={false}
            className="border-b border-border/40 pb-12"
          >
            <DiscoveryAccordionGrid />
          </Section>

          {/* Main Directory Display */}
          <Section spacing="default" contained={false} className="pt-0">
            <CoffeeDirectory
              filterMeta={filterMeta}
              initialData={initialData}
              initialFilters={filters}
              initialPage={page}
              initialSort={sort}
            />
          </Section>
        </Stack>
      </PageShell>
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
