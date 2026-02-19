import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com"}/sitemap.xml`,
  };
}
