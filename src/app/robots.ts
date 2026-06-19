import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "CCBot",
        allow: ["/", "/api/"],
        disallow: ["/dashboard/", "/auth/"],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/", "/auth/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.indiancoffeebeans.com"}/sitemap.xml`,
  };
}
