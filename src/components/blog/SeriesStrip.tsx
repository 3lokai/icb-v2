import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ListBulletsIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { client } from "@/lib/sanity/client";
import { SERIES_SIBLINGS_QUERY } from "@/lib/sanity/queries";
import { Series } from "@/types/blog-types";

type Sibling = { title: string; slug: string; seriesPart?: number };

/**
 * "Part N of M" + prev/next for any article with a seriesRef. Rendered by the
 * article template, so no body block is needed.
 * ponytail: siblings refresh when this article's page revalidates; a newly
 * published neighbour shows up on the others at their next revalidation.
 */
export async function SeriesStrip({
  series,
  currentSlug,
}: {
  series: Series;
  currentSlug: string;
}) {
  const siblings = await client.fetch<Sibling[]>(SERIES_SIBLINGS_QUERY, {
    seriesId: series._id,
  });
  const index = siblings.findIndex((s) => s.slug === currentSlug);
  if (index === -1) return null;

  const prev = siblings[index - 1];
  const next = siblings[index + 1];

  return (
    <nav
      aria-label={`${series.name} series`}
      className="not-prose my-12 rounded-2xl border border-accent/20 bg-accent/5 p-6 md:p-8"
    >
      <Link
        href={`/learn/series/${series.slug}`}
        className="group flex items-center gap-3"
      >
        <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-white">
          <Icon icon={ListBulletsIcon} size={20} />
        </div>
        <div>
          <p className="text-overline text-accent">
            Part {index + 1} of {siblings.length}
          </p>
          <p className="text-heading font-semibold text-foreground group-hover:text-primary transition-colors">
            {series.name}
          </p>
        </div>
      </Link>

      {(prev || next) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/learn/${prev.slug}`}
              className="group rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border"
            >
              <span className="flex items-center gap-2 text-caption text-muted-foreground">
                <Icon icon={ArrowLeftIcon} size={14} /> Previous
              </span>
              <span className="mt-1 block text-body font-medium text-foreground group-hover:text-primary">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/learn/${next.slug}`}
              className="group rounded-xl border border-border/60 bg-card p-4 text-right transition-colors hover:border-border"
            >
              <span className="flex items-center justify-end gap-2 text-caption text-muted-foreground">
                Next <Icon icon={ArrowRightIcon} size={14} />
              </span>
              <span className="mt-1 block text-body font-medium text-foreground group-hover:text-primary">
                {next.title}
              </span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
