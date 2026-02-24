import type { MetadataRoute } from "next";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getAllLandingPageSlugs } from "@/lib/discovery/landing-pages";
import { client } from "@/lib/sanity/client";
import {
  SITEMAP_ARTICLES_QUERY,
  SITEMAP_CATEGORIES_QUERY,
  SITEMAP_SERIES_QUERY,
} from "@/lib/sanity/queries";

/** Add self-referencing hreflang to a sitemap entry (single-language site). */
function withHreflang<T extends { url: string }>(
  entry: T
): T & { alternates: { languages: Record<string, string> } } {
  return {
    ...entry,
    alternates: { languages: { en: entry.url, "x-default": entry.url } },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

  // Static routes that don't change based on database content
  const staticRoutes: MetadataRoute.Sitemap = [
    withHreflang({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    }),
    withHreflang({
      url: `${baseUrl}/coffees`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }),
    withHreflang({
      url: `${baseUrl}/roasters`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    }),
    withHreflang({
      url: `${baseUrl}/curations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }),
    withHreflang({
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    }),
    withHreflang({
      url: `${baseUrl}/roasters/partner`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    }),
    withHreflang({
      url: `${baseUrl}/roasters/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    }),
    withHreflang({
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    withHreflang({
      url: `${baseUrl}/how-icb-works`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    withHreflang({
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withHreflang({
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }),
    withHreflang({
      url: `${baseUrl}/learn/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    withHreflang({
      url: `${baseUrl}/tools/coffee-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
    withHreflang({
      url: `${baseUrl}/tools/expert-recipes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }),
    withHreflang({
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    withHreflang({
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    }),
    withHreflang({
      url: `${baseUrl}/data-deletion`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    }),
  ];

  // Fetch dynamic routes from Supabase
  try {
    // Use service role client if available (bypasses RLS), otherwise use regular client
    let supabase;
    try {
      supabase = process.env.SUPABASE_SECRET_KEY
        ? await createServiceRoleClient()
        : await createClient();
    } catch (clientError) {
      // If service role client fails, fallback to regular client
      console.warn(
        "Failed to create service role client, using regular client:",
        clientError
      );
      supabase = await createClient();
    }

    // Fetch coffees (with roaster slug for nested URL), roasters, and curators in parallel
    const [coffeesResult, roastersResult, curatorsResult] = await Promise.all([
      // Fetch active and seasonal coffees with roaster slug for nested URL
      supabase
        .from("coffees")
        .select("slug, updated_at, roasters(slug)")
        .in("status", ["active", "seasonal"])
        .not("slug", "is", null),
      // Fetch active roasters only
      supabase
        .from("roasters")
        .select("slug, updated_at")
        .eq("is_active", true)
        .not("slug", "is", null),
      // Fetch active curators for curation pages
      supabase
        .from("curators")
        .select("slug, updated_at")
        .eq("is_active", true)
        .not("slug", "is", null),
    ]);

    // Check for query errors
    if (coffeesResult.error) {
      console.error(
        "Failed to fetch coffees for sitemap:",
        coffeesResult.error
      );
    }
    if (roastersResult.error) {
      console.error(
        "Failed to fetch roasters for sitemap:",
        roastersResult.error
      );
    }
    if (curatorsResult.error) {
      console.error(
        "Failed to fetch curators for sitemap:",
        curatorsResult.error
      );
    }

    // Generate dynamic coffee routes (nested: /roasters/{roasterSlug}/coffees/{coffeeSlug})
    type CoffeeRowWithRoaster = {
      slug: string | null;
      updated_at: string | null;
      roasters: { slug?: string } | null;
    };
    const getRoasterSlug = (c: CoffeeRowWithRoaster) =>
      (c.roasters &&
      typeof c.roasters === "object" &&
      !Array.isArray(c.roasters)
        ? c.roasters.slug
        : null) ?? null;
    const coffeeRoutes: MetadataRoute.Sitemap =
      (coffeesResult.data as CoffeeRowWithRoaster[] | null)
        ?.filter((c) => c.slug && getRoasterSlug(c))
        .map((coffee) =>
          withHreflang({
            url: `${baseUrl}/roasters/${getRoasterSlug(coffee)!}/coffees/${coffee.slug}`,
            lastModified: coffee.updated_at
              ? new Date(coffee.updated_at)
              : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          })
        ) ?? [];

    // Generate dynamic roaster routes
    const roasterRoutes: MetadataRoute.Sitemap =
      roastersResult.data?.map((roaster) =>
        withHreflang({
          url: `${baseUrl}/roasters/${roaster.slug}`,
          lastModified: roaster.updated_at
            ? new Date(roaster.updated_at)
            : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })
      ) ?? [];

    // Generate dynamic curation (curator) routes
    const curationRoutes: MetadataRoute.Sitemap =
      curatorsResult.data?.map((curator) =>
        withHreflang({
          url: `${baseUrl}/curations/${curator.slug}`,
          lastModified: curator.updated_at
            ? new Date(curator.updated_at)
            : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.75,
        })
      ) ?? [];

    // Discovery landing pages (brew method, roast level, price bucket)
    const discoverySlugs = getAllLandingPageSlugs();
    const discoveryRoutes: MetadataRoute.Sitemap = discoverySlugs.map((slug) =>
      withHreflang({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })
    );

    // Learn routes from Sanity (articles, categories, series)
    let learnRoutes: MetadataRoute.Sitemap = [];
    try {
      type SitemapArticle = {
        slug: string;
        updatedAt?: string | null;
        _updatedAt?: string | null;
        updated?: string | null;
      };
      type SitemapCategory = { slug: string; _updatedAt?: string | null };
      type SitemapSeries = { slug: string; _updatedAt?: string | null };

      const [articles, categories, series] = await Promise.all([
        client.fetch<SitemapArticle[]>(SITEMAP_ARTICLES_QUERY),
        client.fetch<SitemapCategory[]>(SITEMAP_CATEGORIES_QUERY),
        client.fetch<SitemapSeries[]>(SITEMAP_SERIES_QUERY),
      ]);

      const articleRoutes: MetadataRoute.Sitemap = (articles ?? [])
        .filter((a) => a?.slug)
        .map((article) => {
          const lastModified =
            article.updatedAt || article.updated || article._updatedAt;
          return withHreflang({
            url: `${baseUrl}/learn/${article.slug}`,
            lastModified: lastModified ? new Date(lastModified) : new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          });
        });

      const categoryRoutes: MetadataRoute.Sitemap = (categories ?? [])
        .filter((c) => c?.slug)
        .map((cat) =>
          withHreflang({
            url: `${baseUrl}/learn/category/${cat.slug}`,
            lastModified: cat._updatedAt
              ? new Date(cat._updatedAt)
              : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.75,
          })
        );

      const seriesRoutes: MetadataRoute.Sitemap = (series ?? [])
        .filter((s) => s?.slug)
        .map((s) =>
          withHreflang({
            url: `${baseUrl}/learn/series/${s.slug}`,
            lastModified: s._updatedAt ? new Date(s._updatedAt) : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.75,
          })
        );

      learnRoutes = [...articleRoutes, ...categoryRoutes, ...seriesRoutes];
    } catch (sanityError) {
      console.error("Failed to fetch learn routes for sitemap:", sanityError);
    }

    // Combine all routes
    return [
      ...staticRoutes,
      ...coffeeRoutes,
      ...roasterRoutes,
      ...curationRoutes,
      ...discoveryRoutes,
      ...learnRoutes,
    ];
  } catch (error) {
    // If database queries fail, fallback to static routes only
    console.error("Failed to fetch dynamic sitemap routes:", error);
    return staticRoutes;
  }
}
