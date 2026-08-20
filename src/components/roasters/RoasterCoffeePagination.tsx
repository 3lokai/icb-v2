import Link from "next/link";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";

type RoasterCoffeePaginationProps = {
  slug: string;
  page: number;
  totalPages: number;
};

/**
 * Server-rendered pagination for a roaster's coffee catalog.
 * Uses real <Link href> so crawlers can follow the full page chain without JS.
 */
export function RoasterCoffeePagination({
  slug,
  page,
  totalPages,
}: RoasterCoffeePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (targetPage: number) =>
    targetPage <= 1
      ? `/roasters/${slug}`
      : `/roasters/${slug}?page=${targetPage}`;

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <Button
        aria-label="Previous page"
        asChild={page !== 1}
        disabled={page === 1}
        size="sm"
        variant="outline"
      >
        {page === 1 ? (
          <>
            <Icon icon={CaretLeftIcon} size={16} data-icon="inline-start" />
            <span className="sr-only md:not-sr-only md:ml-1">Previous</span>
          </>
        ) : (
          <Link href={hrefFor(page - 1)}>
            <Icon icon={CaretLeftIcon} size={16} data-icon="inline-start" />
            <span className="sr-only md:not-sr-only md:ml-1">Previous</span>
          </Link>
        )}
      </Button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "ellipsis-start" || pageNum === "ellipsis-end") {
            return (
              <span
                className="px-2 text-muted-foreground"
                key={`ellipsis-${index}`}
              >
                ...
              </span>
            );
          }

          const pageNumber = pageNum as number;
          const isCurrent = page === pageNumber;
          return (
            <Button
              aria-current={isCurrent ? "page" : undefined}
              aria-label={`Go to page ${pageNumber}`}
              asChild
              key={pageNumber}
              size="sm"
              variant={isCurrent ? "default" : "outline"}
            >
              <Link href={hrefFor(pageNumber)}>{pageNumber}</Link>
            </Button>
          );
        })}
      </div>

      <Button
        aria-label="Next page"
        asChild={page !== totalPages}
        disabled={page === totalPages}
        size="sm"
        variant="outline"
      >
        {page === totalPages ? (
          <>
            <span className="sr-only md:not-sr-only md:mr-1">Next</span>
            <Icon icon={CaretRightIcon} size={16} data-icon="inline-end" />
          </>
        ) : (
          <Link href={hrefFor(page + 1)}>
            <span className="sr-only md:not-sr-only md:mr-1">Next</span>
            <Icon icon={CaretRightIcon} size={16} data-icon="inline-end" />
          </Link>
        )}
      </Button>

      <div className="ml-4 text-muted-foreground text-caption">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}

function getPageNumbers(
  page: number,
  totalPages: number
): (number | string)[] {
  const pages: (number | string)[] = [];
  const maxVisible = 7;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  let start = Math.max(2, page - 1);
  let end = Math.min(totalPages - 1, page + 1);

  if (page <= 3) {
    end = 4;
  }

  if (page >= totalPages - 2) {
    start = totalPages - 3;
  }

  if (start > 2) {
    pages.push("ellipsis-start");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("ellipsis-end");
  }

  pages.push(totalPages);

  return pages;
}
