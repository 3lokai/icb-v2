import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: Allow all search engines (Google, Bing, etc.) to crawl and index
      // This enables proper search engine indexing while blocking training bots below
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/api/"],
      },
      // ============================================
      // BLOCK: AI Training Bots (systematic crawling for model training)
      // ============================================
      // OpenAI training bot (blocks GPTBot but allows ChatGPT-User for real-time queries)
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      // Anthropic training crawler
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
      // Meta / Llama training crawler
      {
        userAgent: "meta-externalagent",
        disallow: "/",
      },
      // Common Crawl (used as training data by multiple AI companies)
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      // ByteDance / TikTok training crawler
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
      // Amazon training crawler
      {
        userAgent: "Amazonbot",
        disallow: "/",
      },
      // Generic data-extraction services commonly used for AI training
      {
        userAgent: "webzio",
        disallow: "/",
      },
      {
        userAgent: "Diffbot",
        disallow: "/",
      },
      // ============================================
      // ALLOW: AI Search/User-Time Agents (real-time queries, not training)
      // ============================================
      // These bots access content when users ask questions in real-time,
      // not for systematic training data collection
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "DuckAssistBot",
        allow: "/",
        disallow: [],
      },
      {
        userAgent: "MistralAI-User",
        allow: "/",
        disallow: [],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com"}/sitemap.xml`,
  };
}
