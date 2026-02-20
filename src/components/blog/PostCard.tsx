import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Article } from "@/types/blog-types";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

type PostCardProps = {
  article: Article;
  featured?: boolean;
};

export function PostCard({ article, featured = false }: PostCardProps) {
  const {
    title,
    excerpt,
    slug,
    date,
    cover,
    category,
    author,
    authorRef,
    metadata,
  } = article;
  const displayAuthor = authorRef?.name || author.name;

  return (
    <Link
      href={`/learn/${slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg hover:-translate-y-1",
        featured ? "md:flex-row md:gap-6" : ""
      )}
    >
      {/* Cover Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          featured ? "md:w-1/2 aspect-video md:aspect-auto" : "aspect-video"
        )}
      >
        {cover ? (
          <Image
            src={urlFor(cover)
              .width(800)
              .height(featured ? 600 : 450)
              .url()}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {category && (
          <div className="absolute top-4 left-4">
            <span
              className={cn(
                "rounded-full bg-background/90 px-3 py-1 text-overline text-foreground backdrop-blur-sm",
                category.color === "badge-brown"
                  ? "bg-accent/90 text-white"
                  : ""
              )}
            >
              {category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex flex-col p-6",
          featured ? "md:w-1/2 md:justify-center" : ""
        )}
      >
        <div className="mb-3 flex items-center gap-2 text-caption text-muted-foreground">
          <span>{format(new Date(date), "MMM d, yyyy")}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <span>{metadata?.readingTime || 5} min read</span>
        </div>

        <h3
          className={cn(
            "mb-3 font-semibold tracking-tight transition-colors group-hover:text-primary",
            featured ? "text-display" : "text-title"
          )}
        >
          {title}
        </h3>

        <p className="line-clamp-3 text-body text-muted-foreground">
          {excerpt || article.description}
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="text-caption">{displayAuthor}</div>
        </div>
      </div>
    </Link>
  );
}
