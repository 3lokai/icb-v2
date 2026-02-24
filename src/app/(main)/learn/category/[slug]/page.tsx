import { client } from "@/lib/sanity/client";
import {
  CATEGORY_BY_SLUG_QUERY,
  ARTICLE_PROJECTION,
} from "@/lib/sanity/queries";
import { Article, Category } from "@/types/blog-types";
import { PageShell } from "@/components/primitives/page-shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { Stack } from "@/components/primitives/stack";
import { Section } from "@/components/primitives/section";
import { PostCard } from "@/components/blog/PostCard";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await client.fetch<Category>(CATEGORY_BY_SLUG_QUERY, {
    slug,
  });

  if (!category) {
    notFound();
  }

  const articles = await client.fetch<Article[]>(
    `*[_type == "article" && defined(slug.current) && category->slug.current == $slug] | order(date desc) { ${ARTICLE_PROJECTION} }`,
    { slug }
  );

  const pillarImages: Record<string, string> = {
    "origins-and-estates": "/images/learn/pillars/origins-and-estates.webp",
    "processing-and-flavors":
      "/images/learn/pillars/processing-and-flavors.webp",
    "brewing-behaviour": "/images/learn/pillars/brewing-behaviour.webp",
    "ecosystem-intelligence":
      "/images/learn/pillars/ecosystem-intelligence.webp",
    "field-notes-and-buying-guides":
      "/images/learn/pillars/field-notes-and-buying-guides.webp",
  };

  const backgroundImage = pillarImages[slug] || "/images/hero-learn.avif";

  return (
    <>
      <PageHeader
        title={category.name}
        overline="Field Guide Layer"
        description={
          category.description ||
          `Explore detailed intelligence on ${category.name}`
        }
        backgroundImage={backgroundImage}
      />

      <PageShell className="py-0">
        <Section contained={false} spacing="tight">
          <Breadcrumb className="mb-12">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/learn">Field Guide</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Stack gap="12">
            <div className="flex items-center justify-between border-b pb-6">
              <h2 className="text-title font-semibold tracking-tight">
                All Entries
              </h2>
              <div className="text-caption font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                {articles.length} articles
              </div>
            </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <PostCard key={article._id} article={article} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-20 text-center">
                <h3 className="text-title mb-2">No articles yet</h3>
                <p className="text-muted-foreground">
                  We haven't published anything in this category yet. Check back
                  soon!
                </p>
              </div>
            )}
          </Stack>
        </Section>
      </PageShell>
    </>
  );
}
