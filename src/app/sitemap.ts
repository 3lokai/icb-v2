import type { MetadataRoute } from "next";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getAllLandingPageSlugs } from "@/lib/discovery/landing-pages";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";

  // Static routes that don't change based on database content
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/coffees`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/roasters`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/curations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/glossary`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/coffee-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/expert-recipes`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/data-deletion`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
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
        .map((coffee) => ({
          url: `${baseUrl}/roasters/${getRoasterSlug(coffee)!}/coffees/${coffee.slug}`,
          lastModified: coffee.updated_at
            ? new Date(coffee.updated_at)
            : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })) ?? [];

    // Generate dynamic roaster routes
    const roasterRoutes: MetadataRoute.Sitemap =
      roastersResult.data?.map((roaster) => ({
        url: `${baseUrl}/roasters/${roaster.slug}`,
        lastModified: roaster.updated_at
          ? new Date(roaster.updated_at)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })) ?? [];

    // Generate dynamic curation (curator) routes
    const curationRoutes: MetadataRoute.Sitemap =
      curatorsResult.data?.map((curator) => ({
        url: `${baseUrl}/curations/${curator.slug}`,
        lastModified: curator.updated_at
          ? new Date(curator.updated_at)
          : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })) ?? [];

    // Discovery landing pages (brew method, roast level, price bucket)
    const discoverySlugs = getAllLandingPageSlugs();
    const discoveryRoutes: MetadataRoute.Sitemap = discoverySlugs.map(
      (slug) => ({
        url: `${baseUrl}/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.75,
      })
    );

    // TODO: Add article routes when article system is implemented
    // Example structure:
    // const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    //   url: `${baseUrl}/learn/${article.slug}`,
    //   lastModified: article.updated_at ? new Date(article.updated_at) : new Date(article.created_at),
    //   changeFrequency: "monthly" as const,
    //   priority: 0.7,
    // }));

    // Combine all routes
    return [
      ...staticRoutes,
      ...coffeeRoutes,
      ...roasterRoutes,
      ...curationRoutes,
      ...discoveryRoutes,
    ];
  } catch (error) {
    // If database queries fail, fallback to static routes only
    console.error("Failed to fetch dynamic sitemap routes:", error);
    return staticRoutes;
  }
}
