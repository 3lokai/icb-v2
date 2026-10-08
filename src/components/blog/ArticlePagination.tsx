import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { cn } from "@/lib/utils";

/** Non-featured articles per /learn page. */
export const LEARN_PAGE_SIZE = 18;

/** Page 1 is /learn itself; the rest live at /learn/page/N. */
export const learnPageHref = (page: number) =>
  page <= 1 ? "/learn" : `/learn/page/${page}`;

/**
 * Plain <a> links (not client state) so crawlers can walk every page.
 * ponytail: renders every page number — add ellipses past ~10 pages.
 */
export function ArticlePagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  const linkClass =
    "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-lg border border-border/60 px-3 text-caption transition-colors hover:border-border hover:bg-muted";

  return (
    <nav
      aria-label="Field guide pages"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link href={learnPageHref(page - 1)} className={linkClass}>
          <Icon icon={CaretLeftIcon} size={14} /> Previous
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span
            key={n}
            aria-current="page"
            className={cn(
              linkClass,
              "border-primary bg-primary text-primary-foreground hover:border-primary hover:bg-primary"
            )}
          >
            {n}
          </span>
        ) : (
          <Link key={n} href={learnPageHref(n)} className={linkClass}>
            {n}
          </Link>
        )
      )}
      {page < totalPages && (
        <Link href={learnPageHref(page + 1)} className={linkClass}>
          Next <Icon icon={CaretRightIcon} size={14} />
        </Link>
      )}
    </nav>
  );
}
