import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import { Series } from "@/types/blog-types";

const PREVIEW_PARTS = 3;

/**
 * A series reads as a stack of entries, not one article: deck layers behind,
 * a numbered syllabus in front. Deliberately no hero image (that's PostCard).
 */
export function SeriesCard({ series }: { series: Series }) {
  const { name, slug, description, cover, level, parts = [] } = series;
  const preview = parts.slice(0, PREVIEW_PARTS);
  const more = parts.length - preview.length;

  return (
    <Link
      href={`/learn/series/${slug}`}
      className="group relative mr-3 mb-3 block h-full"
    >
      {/* Deck layers — fan out on hover. */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-3 translate-y-3 rounded-xl border border-border/60 bg-muted/60 transition-transform duration-300 group-hover:translate-x-4 group-hover:translate-y-4"
      />
      <div
        aria-hidden
        className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-xl border border-border/60 bg-card transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2"
      />

      <div className="relative flex h-full flex-col gap-5 rounded-xl border border-border/60 bg-card p-6 transition-colors group-hover:border-border">
        <div className="flex items-center gap-4">
          {cover?.asset && (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={urlFor(cover).width(112).height(112).url()}
                alt={cover.alt || name}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-overline text-accent">
              Series
              {level && ` · ${level[0].toUpperCase()}${level.slice(1)}`}
              {parts.length > 0 &&
                ` · ${parts.length} ${parts.length === 1 ? "part" : "parts"}`}
            </p>
            <h3 className="text-heading font-semibold text-balance transition-colors group-hover:text-primary">
              {name}
            </h3>
          </div>
        </div>

        {description && (
          <p className="line-clamp-2 text-body text-muted-foreground">
            {description}
          </p>
        )}

        {preview.length > 0 && (
          <div>
            <p className="text-label mb-1">Contents</p>
            <ol className="divide-y divide-border/60 border-y border-border/60">
              {preview.map((part, i) => (
                <li
                  key={part.slug}
                  className="flex items-baseline gap-3 py-2.5"
                >
                  <span className="text-micro tabular-nums !text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="line-clamp-1 font-serif text-caption !text-foreground">
                    {part.title}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between text-caption">
          <span className="text-muted-foreground">
            {more > 0 ? `+ ${more} more` : ""}
          </span>
          <span className="flex items-center gap-2 text-primary">
            View series
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
