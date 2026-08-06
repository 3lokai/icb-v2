"use client";

import type { MouseEvent } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { useCoffeeFilters } from "@/hooks/use-coffee-filters";
import { buildCoffeeQueryString } from "@/lib/filters/coffee-url";

interface CoffeePaginationProps {
  totalPages: number;
}

/**
 * Coffee Pagination Component
 * Pagination controls with Previous/Next and page numbers
 * URL sync is handled automatically by CoffeeDirectory component
 *
 * Controls render as real <a href> (not just onClick) so Googlebot can crawl
 * the full page chain — it never runs click handlers, only reads hrefs.
 */
export function CoffeePagination({ totalPages }: CoffeePaginationProps) {
  const { filters, page, sort, limit, setPage } = useCoffeeFilters();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const hrefFor = (targetPage: number) =>
    `/coffees?${buildCoffeeQueryString(filters, targetPage, sort, limit)}`;

  const linkProps = (targetPage: number) => ({
    href: hrefFor(targetPage),
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      handlePageChange(targetPage);
    },
  });

  // Generate page numbers to show (max 7 pages)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate start and end of middle section
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      // Adjust if we're near the start
      if (page <= 3) {
        end = 4;
      }

      // Adjust if we're near the end
      if (page >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end");
      }

      // Show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <Button
        aria-label="Previous page"
        asChild={page !== 1}
        disabled={page === 1}
        onClick={page === 1 ? undefined : () => handlePageChange(page - 1)}
        size="sm"
        variant="outline"
      >
        {page === 1 ? (
          <>
            <Icon icon={CaretLeftIcon} size={16} data-icon="inline-start" />
            <span className="sr-only md:not-sr-only md:ml-1">Previous</span>
          </>
        ) : (
          <a {...linkProps(page - 1)}>
            <Icon icon={CaretLeftIcon} size={16} data-icon="inline-start" />
            <span className="sr-only md:not-sr-only md:ml-1">Previous</span>
          </a>
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
              <a {...linkProps(pageNumber)}>{pageNumber}</a>
            </Button>
          );
        })}
      </div>

      <Button
        aria-label="Next page"
        asChild={page !== totalPages}
        disabled={page === totalPages}
        onClick={
          page === totalPages ? undefined : () => handlePageChange(page + 1)
        }
        size="sm"
        variant="outline"
      >
        {page === totalPages ? (
          <>
            <span className="sr-only md:not-sr-only md:mr-1">Next</span>
            <Icon icon={CaretRightIcon} size={16} data-icon="inline-end" />
          </>
        ) : (
          <a {...linkProps(page + 1)}>
            <span className="sr-only md:not-sr-only md:mr-1">Next</span>
            <Icon icon={CaretRightIcon} size={16} data-icon="inline-end" />
          </a>
        )}
      </Button>

      <div className="ml-4 text-muted-foreground text-caption">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}
