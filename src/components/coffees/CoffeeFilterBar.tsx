"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCoffeeDirectoryStore } from "@/store/zustand/coffee-directory-store";

/**
 * Coffee Filter Bar Component
 * Quick filter chips for common filters
 * URL sync is handled automatically by CoffeeDirectory component
 */
export function CoffeeFilterBar() {
  const { filters, updateFilters, resetFilters } = useCoffeeDirectoryStore();

  // Check if any filters are active
  const hasActiveFilters =
    filters.in_stock_only ||
    filters.has_250g_only ||
    filters.max_price ||
    filters.roast_levels?.length ||
    filters.processes?.length ||
    filters.status?.length ||
    filters.flavor_keys?.length ||
    filters.q;

  // Quick filter actions (store updates trigger URL sync in CoffeeDirectory)
  const handleQuickFilter = (filterType: string) => {
    if (filterType === "inStock") {
      updateFilters({
        in_stock_only: filters.in_stock_only ? undefined : true,
      });
    } else if (filterType === "has250g") {
      updateFilters({
        has_250g_only: filters.has_250g_only ? undefined : true,
      });
    } else if (filterType === "under500") {
      updateFilters({
        max_price: filters.max_price === 500 ? undefined : 500,
      });
    }
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
        <span className="shrink-0 font-medium text-muted-foreground text-sm">
          Quick filters:
        </span>
        <Button
          className="shrink-0 text-xs sm:text-sm"
          onClick={() => handleQuickFilter("inStock")}
          size="sm"
          variant={filters.in_stock_only ? "default" : "outline"}
        >
          In Stock
        </Button>
        <Button
          className="shrink-0 text-xs sm:text-sm"
          onClick={() => handleQuickFilter("has250g")}
          size="sm"
          variant={filters.has_250g_only ? "default" : "outline"}
        >
          Has 250g
        </Button>
        <Button
          className="shrink-0 text-xs sm:text-sm"
          onClick={() => handleQuickFilter("under500")}
          size="sm"
          variant={filters.max_price === 500 ? "default" : "outline"}
        >
          Under ₹500
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
          <span className="shrink-0 text-muted-foreground text-xs sm:text-sm">
            Active filters:
          </span>
          {filters.in_stock_only && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              In Stock
              <button
                aria-label="Remove In Stock filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ in_stock_only: undefined })}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.has_250g_only && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              Has 250g
              <button
                aria-label="Remove Has 250g filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ has_250g_only: undefined })}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.max_price && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              Under ₹{filters.max_price}
              <button
                aria-label="Remove price filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ max_price: undefined })}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.roast_levels && filters.roast_levels.length > 0 && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              {filters.roast_levels.length} Roast Level
              {filters.roast_levels.length > 1 ? "s" : ""}
              <button
                aria-label="Remove roast level filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ roast_levels: undefined })}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.processes && filters.processes.length > 0 && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              {filters.processes.length} Process
              {filters.processes.length > 1 ? "es" : ""}
              <button
                aria-label="Remove process filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ processes: undefined })}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.flavor_keys && filters.flavor_keys.length > 0 && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              {filters.flavor_keys.length} Flavor
              {filters.flavor_keys.length > 1 ? "s" : ""}
              <button
                aria-label="Remove flavor filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ flavor_keys: undefined })}
                type="button"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button
            className="shrink-0 text-xs sm:text-sm"
            onClick={() => resetFilters()}
            size="sm"
            variant="ghost"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
