"use client";

import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { useCoffeeDirectoryStore } from "@/store/zustand/coffee-directory-store";

interface CoffeePaginationProps {
  totalPages: number;
}

/**
 * Coffee Pagination Component
 * Pagination controls with Previous/Next and page numbers
 * URL sync is handled automatically by CoffeeDirectory component
 */
export function CoffeePagination({ totalPages }: CoffeePaginationProps) {
  const { page, setPage } = useCoffeeDirectoryStore();

  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

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
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
        size="sm"
        variant="outline"
      >
        <Icon name="CaretLeft" size={16} />
        <span className="sr-only md:not-sr-only md:ml-1">Previous</span>
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
          return (
            <Button
              aria-current={page === pageNumber ? "page" : undefined}
              aria-label={`Go to page ${pageNumber}`}
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              size="sm"
              variant={page === pageNumber ? "default" : "outline"}
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      <Button
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
        size="sm"
        variant="outline"
      >
        <span className="sr-only md:not-sr-only md:mr-1">Next</span>
        <Icon name="CaretRight" size={16} />
      </Button>

      <div className="ml-4 text-muted-foreground text-sm">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}
