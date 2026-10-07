import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { client } from "@/lib/sanity/client";
import { ALL_ARTICLES_QUERY } from "@/lib/sanity/queries";
import { Article } from "@/types/blog-types";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/primitives/section";
import { Accent } from "@/components/primitives/accent";
import { ArticleGrid } from "@/components/blog/ArticleParallaxGrid";
import {
  ArticlePagination,
  LEARN_PAGE_SIZE,
  learnPageHref,
} from "@/components/blog/ArticlePagination";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { generateCollectionPageSchema, getSeoBaseUrl } from "@/lib/seo/schema";
import StructuredData from "@/components/seo/StructuredData";

export const revalidate = 3600;

type Props = { params: Promise<{ page: string }> };

/** Same ordering as /learn: featured stay on page 1, the rest paginate. */
async function getPage(param: string) {
  const page = Number(param);
  if (!Number.isInteger(page) || page < 1) notFound();
  if (page === 1) permanentRedirect("/learn");

  const articles = await client.fetch<Article[]>(ALL_ARTICLES_QUERY);
  const regular = articles
    .filter((a) => !a.featured)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalPages = Math.ceil(regular.length / LEARN_PAGE_SIZE);
  if (page > totalPages) notFound();

  const start = (page - 1) * LEARN_PAGE_SIZE;
  return {
    page,
    totalPages,
    total: regular.length,
    articles: regular.slice(start, start + LEARN_PAGE_SIZE),
  };
}

export async function generateStaticParams() {
  const articles = await client.fetch<Article[]>(ALL_ARTICLES_QUERY);
  const regular = articles.filter((a) => !a.featured).length;
  const totalPages = Math.ceil(regular / LEARN_PAGE_SIZE);
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page, totalPages } = await getPage((await params).page);
  // Kept under the 38-char budget (60 minus the site suffix) so the page
  // number survives truncateTitle — otherwise every page shares one title.
  return generateSEOMetadata({
    title: `ICB Field Guide — Page ${page}`,
    description: `Page ${page} of ${totalPages} of the Indian Coffee Field Guide — more stories, brewing guides, origin profiles, and research on Indian specialty coffee, newest first.`,
    canonical: learnPageHref(page),
  });
}

export default async function LearnPaginatedPage({ params }: Props) {
  const { page, totalPages, total, articles } = await getPage(
    (await params).page
  );

  const baseUrl = getSeoBaseUrl();
  const collectionSchema = generateCollectionPageSchema(
    `ICB Field Guide — Page ${page}`,
    `Page ${page} of ${totalPages} of the Indian Coffee Field Guide.`,
    `${baseUrl}${learnPageHref(page)}`,
    articles.map((article, index) => ({
      "@type": "ListItem",
      position: (page - 1) * LEARN_PAGE_SIZE + index + 1,
      item: {
        "@type": "Article",
        name: article.title,
        url: `${baseUrl}/learn/${article.slug}`,
        ...(article.excerpt ? { description: article.excerpt } : {}),
      },
    }))
  );

  return (
    <>
      <StructuredData schema={collectionSchema} />
      <PageHeader
        title={
          <>
            The Indian Coffee <br />
            <Accent>Field Guide</Accent>
          </>
        }
        overline={`Page ${page} of ${totalPages}`}
        description="Master the art of Indian specialty coffee. From origin stories to brewing guides, explore our curated intelligence layers."
        backgroundImage="/images/hero-learn.avif"
      />

      <Section
        contained={false}
        spacing="default"
        eyebrow={`Page ${page} of ${totalPages}`}
        title="More from the"
        accentWord="field guide"
        description={`Entries ${(page - 1) * LEARN_PAGE_SIZE + 1}–${(page - 1) * LEARN_PAGE_SIZE + articles.length} of ${total}, newest first.`}
      >
        <ArticleGrid articles={articles} />
        <ArticlePagination page={page} totalPages={totalPages} />
      </Section>
    </>
  );
}
