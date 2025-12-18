"use client";

import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRoasterDirectoryStore } from "@/store/zustand/roaster-directory-store";

/**
 * Roaster Filter Bar Component
 * Quick filter chips for common filters
 * URL sync is handled automatically by RoasterDirectory component
 */
export function RoasterFilterBar() {
  const { filters, updateFilters, resetFilters } = useRoasterDirectoryStore();

  // Check if any filters are active
  const hasActiveFilters =
    filters.active_only ||
    filters.cities?.length ||
    filters.states?.length ||
    filters.countries?.length ||
    filters.q;

  // Quick filter actions (store updates trigger URL sync in RoasterDirectory)
  const handleQuickFilter = (filterType: string) => {
    if (filterType === "active") {
      updateFilters({
        active_only: filters.active_only ? undefined : true,
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
          onClick={() => handleQuickFilter("active")}
          size="sm"
          variant={filters.active_only ? "default" : "outline"}
        >
          Active Only
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
          <span className="shrink-0 text-muted-foreground text-xs sm:text-sm">
            Active filters:
          </span>
          {filters.active_only && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              Active Only
              <button
                aria-label="Remove Active Only filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ active_only: undefined })}
                type="button"
              >
                <Icon name="X" size={12} />
              </button>
            </Badge>
          )}
          {filters.cities && filters.cities.length > 0 && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              {filters.cities.length} Cit
              {filters.cities.length > 1 ? "ies" : "y"}
              <button
                aria-label="Remove city filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ cities: undefined })}
                type="button"
              >
                <Icon name="X" size={12} />
              </button>
            </Badge>
          )}
          {filters.states && filters.states.length > 0 && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              {filters.states.length} State
              {filters.states.length > 1 ? "s" : ""}
              <button
                aria-label="Remove state filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ states: undefined })}
                type="button"
              >
                <Icon name="X" size={12} />
              </button>
            </Badge>
          )}
          {filters.countries && filters.countries.length > 0 && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              {filters.countries.length} Countr
              {filters.countries.length > 1 ? "ies" : "y"}
              <button
                aria-label="Remove country filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ countries: undefined })}
                type="button"
              >
                <Icon name="X" size={12} />
              </button>
            </Badge>
          )}
          {filters.q && (
            <Badge className="shrink-0 gap-1 text-xs sm:text-sm" variant="secondary">
              Search: {filters.q}
              <button
                aria-label="Remove search filter"
                className="ml-1 rounded-full hover:bg-muted"
                onClick={() => updateFilters({ q: undefined })}
                type="button"
              >
                <Icon name="X" size={12} />
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
