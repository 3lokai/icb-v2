import { client } from "@/lib/sanity/client";
import { ARTICLE_BY_SLUG_QUERY } from "@/lib/sanity/queries";
import { Article } from "@/types/blog-types";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ShareArticle } from "@/components/blog/ShareArticle";
import { DetailedAuthor } from "@/components/blog/DetailedAuthor";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";
import { blogArticleSchema } from "@/lib/seo/schema";
import { urlFor } from "@/lib/sanity/image";
import ArticleContent from "@/components/blog/ArticleContent";
import StructuredData from "@/components/seo/StructuredData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await client.fetch<Article>(ARTICLE_BY_SLUG_QUERY, { slug });

  if (!article) return {};

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  return generateSEOMetadata({
    title: article.metadata?.metaTitle || article.title,
    description:
      article.metadata?.metaDescription ||
      article.description ||
      article.excerpt,
    image: article.metadata?.ogImage
      ? urlFor(article.metadata.ogImage).width(1200).url()
      : article.cover
        ? urlFor(article.cover).width(1200).url()
        : undefined,
    type: "article",
    canonical: `${baseUrl}/learn/${article.slug}`,
    articleDetails: {
      publishedTime: article.date,
      modifiedTime: article.updatedAt || article.updated || article._updatedAt,
      tags: article.tags,
    },
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await client.fetch<Article>(ARTICLE_BY_SLUG_QUERY, { slug });

  if (!article) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const articleUrl = `${baseUrl}/learn/${article.slug}`;
  const displayAuthor = article.authorRef || article.author;
  const articleJsonLd = blogArticleSchema({
    title: article.metadata?.metaTitle || article.title,
    description:
      article.metadata?.metaDescription ||
      article.description ||
      article.excerpt,
    image: article.metadata?.ogImage
      ? urlFor(article.metadata.ogImage).width(1200).url()
      : article.cover
        ? urlFor(article.cover).width(1200).url()
        : undefined,
    url: articleUrl,
    authorName: displayAuthor.name,
    datePublished: article.date,
    dateModified: article.updatedAt || article.updated || article._updatedAt,
  });

  return (
    <div className="pb-24">
      <StructuredData schema={articleJsonLd} />
      <ArticleHeader article={article} />

      <div className="mt-12 md:mt-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[250px_1fr] xl:grid-cols-[250px_750px_1fr]">
          {/* Left: TOC — sticky so it floats with scroll; overflow-visible so sticky works */}
          <aside className="overflow-visible">
            <div className="sticky top-24">
              <TableOfContents body={article.body} toc={article.toc} />
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="min-w-0">
            {/* Article Body */}
            <ArticleContent body={article.body} faqItems={article.faqItems} />

            {/* Top-level FAQ Section (if field is populated) */}
            {article.faqItems && article.faqItems.length > 0 && (
              <section className="mt-16 border-t pt-12">
                <h4 className="text-title font-semibold mb-8">
                  Frequently Asked Questions
                </h4>
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-4"
                >
                  {article.faqItems.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="rounded-2xl border bg-card/50 px-6 py-2 transition-all hover:bg-card shadow-sm"
                    >
                      <AccordionTrigger className="text-left text-body font-bold text-foreground py-4 hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-body text-muted-foreground leading-relaxed pt-2 pb-6 whitespace-pre-wrap">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {/* Bottom Section: Share & Author */}
            <footer className="mt-20 space-y-12">
              <div className="flex flex-col gap-6 border-t pt-10 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="mb-2 text-title font-semibold">
                    Enjoyed this article?
                  </h4>
                  <p className="text-body text-muted-foreground">
                    Share it with your coffee-loving friends.
                  </p>
                </div>
                <ShareArticle title={article.title} url={articleUrl} />
              </div>

              <DetailedAuthor author={article.authorRef || article.author} />
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}
