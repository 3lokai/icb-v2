import Link from "next/link";
import { Series } from "@/types/blog-types";

export function SeriesCard({ series }: { series: Series }) {
  const { name, slug, description } = series;

  return (
    <Link
      href={`/learn/series/${slug}`}
      className="group flex flex-col gap-4 rounded-2xl border bg-card p-6 transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-accent/10 px-3 py-1 text-overline text-accent">
          Series
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-title font-semibold group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="line-clamp-2 text-body text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-auto pt-4 text-caption text-primary flex items-center gap-2">
        View Series
        <span className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>
    </Link>
  );
}
