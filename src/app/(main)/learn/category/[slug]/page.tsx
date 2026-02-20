import { client } from "@/lib/sanity/client";
import {
  CATEGORY_BY_SLUG_QUERY,
  ARTICLE_PROJECTION,
} from "@/lib/sanity/queries";
import { Article, Category } from "@/types/blog-types";
import { PageShell } from "@/components/primitives/page-shell";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/blog/PostCard";
import { notFound } from "next/navigation";

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

  return (
    <>
      <PageHeader
        title={category.name}
        overline="Category"
        description={
          category.description || `Explore all articles in ${category.name}`
        }
      />

      <PageShell className="py-12 md:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <PostCard key={article._id} article={article} />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-20 text-center">
            <h3 className="text-title-large mb-2">No articles yet</h3>
            <p className="text-muted-foreground">
              We haven't published anything in this category yet. Check back
              soon!
            </p>
          </div>
        )}
      </PageShell>
    </>
  );
}
