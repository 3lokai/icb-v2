"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useRoasterDirectoryStore } from "@/store/zustand/roaster-directory-store";
import type { RoasterFilterMeta } from "@/types/roaster-types";

type RoasterFilterContentProps = {
  filterMeta: RoasterFilterMeta;
  showHeader?: boolean;
};

/**
 * Roaster Filter Content Component
 * Reusable filter content used in both sidebar and mobile drawer
 */
export function RoasterFilterContent({
  filterMeta,
  showHeader = true,
}: RoasterFilterContentProps) {
  const { filters, updateFilters, resetFilters } = useRoasterDirectoryStore();

  // Toggle array filter values
  const toggleArrayFilter = (
    filterKey: "cities" | "states" | "countries",
    value: string
  ) => {
    const current = filters[filterKey] || [];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilters({ [filterKey]: newValue.length > 0 ? newValue : undefined });
  };

  // Check if filter is selected
  const isFilterSelected = (
    filterKey: "cities" | "states" | "countries",
    value: string
  ) => {
    const filterArray = filters[filterKey] as string[] | undefined;
    return filterArray?.includes(value) ?? false;
  };

  // Helper to render filter section with counts
  type FilterSectionOptions = {
    title: string;
    items: Array<{ value: string; label: string; count: number }>;
    filterKey: "cities" | "states" | "countries";
    totalCount?: number;
  };

  const renderFilterSection = (options: FilterSectionOptions) => {
    const { title, items, filterKey, totalCount } = options;
    if (items.length === 0) {
      return null;
    }

    return (
      <div className="space-y-2">
        <label className="font-medium text-sm" htmlFor={filterKey}>
          {title}
          {totalCount !== undefined && (
            <span className="ml-2 text-muted-foreground text-xs">
              ({totalCount})
            </span>
          )}
        </label>
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {items.map((item) => (
            <label
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent/50"
              key={item.value}
            >
              <input
                checked={isFilterSelected(filterKey, item.value)}
                className="h-4 w-4 rounded border-input"
                onChange={() => toggleArrayFilter(filterKey, item.value)}
                type="checkbox"
              />
              <span className="text-sm">
                {item.label}{" "}
                <span className="text-muted-foreground">({item.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Filters</h2>
          <Button onClick={() => resetFilters()} size="sm" variant="ghost">
            Reset
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="space-y-2">
        <label className="font-medium text-sm" htmlFor="search">
          Search
        </label>
        <Input
          id="search"
          onChange={(e) =>
            updateFilters({ q: e.target.value.trim() || undefined })
          }
          placeholder="Search roasters..."
          type="text"
          value={filters.q || ""}
        />
      </div>

      {/* Countries */}
      {renderFilterSection({
        title: "Countries",
        items: filterMeta.countries,
        filterKey: "countries",
        totalCount: filterMeta.totals.active_roasters,
      })}

      {/* States */}
      {renderFilterSection({
        title: "States",
        items: filterMeta.states,
        filterKey: "states",
      })}

      {/* Cities */}
      {renderFilterSection({
        title: "Cities",
        items: filterMeta.cities,
        filterKey: "cities",
      })}

      {/* Boolean Filters */}
      <div className="space-y-4">
        <label className="font-medium text-sm" htmlFor="active_only">
          Options
        </label>
        <div className="space-y-3">
          <label
            className="flex cursor-pointer items-center justify-between"
            htmlFor="active_only"
          >
            <span className="text-sm">Active Only</span>
            <Switch
              checked={filters.active_only ?? false}
              onCheckedChange={(checked) =>
                updateFilters({ active_only: checked || undefined })
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
}

type RoasterFilterSidebarProps = {
  filterMeta: RoasterFilterMeta;
};

/**
 * Roaster Filter Sidebar Component
 * Full filter UI with dropdowns for location filters
 * URL sync is handled automatically by RoasterDirectory component
 * Hidden on mobile, visible on desktop
 */
export function RoasterFilterSidebar({
  filterMeta,
}: RoasterFilterSidebarProps) {
  return (
    <aside className="hidden w-full space-y-6 md:block md:w-64">
      <RoasterFilterContent filterMeta={filterMeta} />
    </aside>
  );
}
