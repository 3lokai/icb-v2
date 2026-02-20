import { Article } from "@/types/blog-types";
import { format } from "date-fns";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";

export function ArticleSidebar({ article }: { article: Article }) {
  const { author, authorRef, date, metadata, category } = article;
  const displayAuthor = authorRef || author;

  return (
    <div className="space-y-10 lg:sticky lg:top-32">
      {/* Author Card */}
      <div className="rounded-2xl border bg-card p-6">
        <h4 className="mb-4 text-overline text-muted-foreground">Written By</h4>
        <div className="flex items-center gap-4">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-full">
            {displayAuthor.avatar ? (
              <Image
                src={urlFor(displayAuthor.avatar).width(96).height(96).url()}
                alt={displayAuthor.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-accent text-white font-bold">
                {displayAuthor.name[0]}
              </div>
            )}
          </div>
          <div>
            <div className="text-body font-medium">{displayAuthor.name}</div>
            <div className="text-caption line-clamp-2">{displayAuthor.bio}</div>
          </div>
        </div>
      </div>

      {/* Article Stats */}
      <div className="space-y-6 px-2">
        <div>
          <h4 className="mb-2 text-overline text-muted-foreground uppercase tracking-widest">
            Published
          </h4>
          <div className="text-body">
            {format(new Date(date), "MMMM d, yyyy")}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-overline text-muted-foreground uppercase tracking-widest">
            Read Time
          </h4>
          <div className="text-body">{metadata?.readingTime || 5} minutes</div>
        </div>

        {category && (
          <div>
            <h4 className="mb-2 text-overline text-muted-foreground uppercase tracking-widest">
              Category
            </h4>
            <div
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-caption",
                category.color === "badge-brown"
                  ? "bg-accent/10 text-accent"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {category.name}
            </div>
          </div>
        )}
      </div>

      {/* Share Section (Placeholder) */}
      <div className="border-t pt-8">
        <h4 className="mb-4 text-overline text-muted-foreground uppercase tracking-widest">
          Share Article
        </h4>
        <div className="flex gap-4">
          {["Twitter", "LinkedIn", "Copy Link"].map((platform) => (
            <button
              key={platform}
              className="text-caption transition-colors hover:text-primary"
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
