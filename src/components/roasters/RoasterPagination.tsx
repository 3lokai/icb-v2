"use client";

import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRoasterFilters } from "@/hooks/use-roaster-filters";

type RoasterPaginationProps = {
  totalPages: number;
};

/**
 * Roaster Pagination Component
 * Handles page navigation and displays page numbers
 * URL sync is handled automatically by RoasterDirectory component
 */
export function RoasterPagination({ totalPages }: RoasterPaginationProps) {
  const { page, setPage } = useRoasterFilters();

  const handlePrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const calculatePageRange = (
    currentPage: number,
    total: number,
    maxVisible: number
  ) => {
    let start = Math.max(2, currentPage - Math.floor(maxVisible / 2) + 1);
    let end = Math.min(total - 1, currentPage + Math.floor(maxVisible / 2) - 1);

    if (currentPage <= Math.floor(maxVisible / 2)) {
      end = maxVisible - 1;
    } else if (currentPage > total - Math.floor(maxVisible / 2)) {
      start = total - maxVisible + 2;
    }

    return { start, end };
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | "...")[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    pageNumbers.push(1);

    if (page > maxPagesToShow - 2) {
      pageNumbers.push("...");
    }

    const { start, end } = calculatePageRange(page, totalPages, maxPagesToShow);
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (page < totalPages - Math.floor(maxPagesToShow / 2)) {
      pageNumbers.push("...");
    }

    pageNumbers.push(totalPages);
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between py-6">
      <Button
        className="flex items-center gap-1"
        disabled={page === 1}
        onClick={handlePrevious}
        size="sm"
        variant="outline"
      >
        <Icon name="CaretLeft" size={16} />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((p) =>
          p === "..." ? (
            <span className="px-2 text-muted-foreground" key="ellipsis">
              ...
            </span>
          ) : (
            <Button
              className={cn("w-8", page === p && "pointer-events-none")}
              key={p}
              onClick={() => setPage(p as number)}
              size="sm"
              variant={page === p ? "default" : "outline"}
            >
              {p}
            </Button>
          )
        )}
      </div>

      <Button
        className="flex items-center gap-1"
        disabled={page === totalPages}
        onClick={handleNext}
        size="sm"
        variant="outline"
      >
        <span className="hidden sm:inline">Next</span>
        <Icon name="CaretRight" size={16} />
      </Button>
    </div>
  );
}
