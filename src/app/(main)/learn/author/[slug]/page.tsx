import { client } from "@/lib/sanity/client";
import {
  AUTHOR_BY_SLUG_OR_ID_QUERY,
  ARTICLES_BY_AUTHOR_QUERY,
} from "@/lib/sanity/queries";
import { Article, Author } from "@/types/blog-types";
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
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await client.fetch<Author | null>(AUTHOR_BY_SLUG_OR_ID_QUERY, {
    slug,
  });

  if (!author) {
    return { title: "Author Not Found | Indian Coffee Beans" };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://indiancoffeebeans.com";
  const title = `${author.name} | Field Guide Author`;
  const description =
    author.bio ||
    `Read all articles by ${author.name} on the Indian Coffee Beans Field Guide.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/learn/author/${author.slug ?? author._id ?? slug}`,
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;

  const author = await client.fetch<Author | null>(AUTHOR_BY_SLUG_OR_ID_QUERY, {
    slug,
  });

  if (!author?._id) {
    notFound();
  }

  const articles = await client.fetch<Article[]>(ARTICLES_BY_AUTHOR_QUERY, {
    authorId: author._id,
  });

  const authorSlug = author.slug ?? author._id ?? slug;

  return (
    <>
      <PageHeader
        title={author.name}
        overline="Field Guide Author"
        description={
          author.bio ||
          `Articles and guides by ${author.name} on specialty coffee.`
        }
        backgroundImage="/images/hero-learn.avif"
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
                <BreadcrumbPage>{author.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Author card */}
          <div className="mb-16 overflow-hidden rounded-2xl border bg-card p-8 shadow-sm">
            <div className="flex flex-col items-center gap-8 md:flex-row md:items-start md:text-left text-center">
              <div className="relative size-32 shrink-0 overflow-hidden rounded-full border-4 border-background shadow-md">
                {author.avatar ? (
                  <Image
                    src={urlFor(author.avatar).width(256).height(256).url()}
                    alt={author.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-accent text-white font-bold text-title">
                    {author.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="mb-4 text-title font-bold text-foreground">
                  {author.name}
                </h2>
                <p className="max-w-xl text-body text-muted-foreground leading-relaxed">
                  {author.bio ||
                    "Passionate about specialty coffee in India. Sharing stories, guides, and insights from the bean to the cup."}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
                  {author.supabaseUserId && (
                    <Link
                      href={`/profile/${author.supabaseUserId}`}
                      className="text-body font-semibold text-primary hover:underline"
                    >
                      Visit profile
                    </Link>
                  )}
                  {author.instagram && (
                    <>
                      {author.supabaseUserId && (
                        <span className="text-muted-foreground/30">•</span>
                      )}
                      <a
                        href={`https://instagram.com/${author.instagram.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-body font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Instagram
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* All posts */}
          <Stack gap="12">
            <div
              id="posts"
              className="flex items-center justify-between border-b pb-6 scroll-mt-24"
            >
              <h2 className="text-title font-semibold tracking-tight">
                All posts
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
                  This author hasn&apos;t published anything yet. Check back
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
