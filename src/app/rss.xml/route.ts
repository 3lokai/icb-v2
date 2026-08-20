import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";
import { ALL_ARTICLES_QUERY } from "@/lib/sanity/queries";
import { getSeoBaseUrl } from "@/lib/seo/schema";
import type { Article } from "@/types/blog-types";

export const revalidate = 3600;

const FEED_LIMIT = 30;

const CHANNEL_TITLE = "Indian Coffee Beans — Field Guide";
const CHANNEL_DESCRIPTION =
  "Master the art of Indian specialty coffee. From origin stories to brewing guides, explore our curated field guide.";

/** Escape text for XML element content. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822 UTC date for RSS, or null when the input is missing/unparseable. */
function toRssDate(value: string | null | undefined): string | null {
  if (value == null || value === "") return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toUTCString();
}

/** Resolve the public article URL, matching /learn/[slug] canonical logic. */
function articleUrl(article: Article, baseUrl: string): string {
  return article.metadata?.canonicalUrl || `${baseUrl}/learn/${article.slug}`;
}

/** Build a single RSS <item> for an article with a valid pubDate. */
function buildItem(
  article: Article,
  baseUrl: string,
  pubDate: string
): string {
  const link = articleUrl(article, baseUrl);
  const description =
    article.metadata?.metaDescription ||
    article.description ||
    article.excerpt ||
    "";
  const categoryName = article.category?.name;

  return [
    "    <item>",
    `      <title>${escapeXml(article.title)}</title>`,
    `      <link>${escapeXml(link)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
    `      <pubDate>${pubDate}</pubDate>`,
    description
      ? `      <description>${escapeXml(description)}</description>`
      : null,
    categoryName
      ? `      <category>${escapeXml(categoryName)}</category>`
      : null,
    "    </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Assemble a valid RSS 2.0 document from the article list. */
function buildRssXml(articles: Article[], baseUrl: string): string {
  const feedUrl = `${baseUrl}/rss.xml`;
  const learnUrl = `${baseUrl}/learn`;

  const datedItems = articles.flatMap((article) => {
    const pubDate = toRssDate(article.date);
    if (!pubDate) return [];
    return [{ article, pubDate }];
  });

  const lastBuildDate =
    datedItems[0]?.pubDate ?? new Date().toUTCString();

  const items = datedItems
    .map(({ article, pubDate }) => buildItem(article, baseUrl, pubDate))
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
    `  <channel>`,
    `    <title>${escapeXml(CHANNEL_TITLE)}</title>`,
    `    <link>${escapeXml(learnUrl)}</link>`,
    `    <description>${escapeXml(CHANNEL_DESCRIPTION)}</description>`,
    `    <language>en-in</language>`,
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    items,
    `  </channel>`,
    `</rss>`,
    ``,
  ].join("\n");
}

/** Serve the Field Guide RSS 2.0 feed from published Sanity articles. */
export async function GET() {
  const baseUrl = getSeoBaseUrl().replace(/\/$/, "");

  let articles: Article[];
  try {
    const fetched = await client.fetch<Article[]>(ALL_ARTICLES_QUERY);
    articles = (fetched ?? [])
      .filter((article) => article?.slug && !article.draft)
      .slice(0, FEED_LIMIT);
  } catch (error) {
    // Do not return a cacheable empty 200 — CDNs/subscribers would retain a
    // feed with every entry removed until the shared TTL expires.
    console.error("Failed to fetch articles for RSS feed:", error);
    return new NextResponse("RSS feed temporarily unavailable", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const xml = buildRssXml(articles, baseUrl);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
