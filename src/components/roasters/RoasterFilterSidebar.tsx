"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRoasterDirectoryStore } from "@/store/zustand/roaster-directory-store";
import type { RoasterFilterMeta } from "@/types/roaster-types";

type RoasterFilterContentProps = {
  filterMeta: RoasterFilterMeta;
};

/**
 * Roaster Filter Content Component
 * Reusable filter content used in both sidebar and mobile drawer
 */
export function RoasterFilterContent({
  filterMeta,
}: RoasterFilterContentProps) {
  const { filters, updateFilters, resetFilters } = useRoasterDirectoryStore();

  const handleActiveOnlyChange = (checked: boolean) => {
    updateFilters({ active_only: checked || undefined });
  };

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
        <Label className="font-medium text-sm" htmlFor={filterKey}>
          {title}
          {totalCount !== undefined && (
            <span className="ml-2 text-muted-foreground text-xs">
              ({totalCount})
            </span>
          )}
        </Label>
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
    <div className="w-full flex-shrink-0 space-y-6">
      {/* Search Input */}
      <div className="glass-card card-padding">
        <Label className="mb-2 block font-medium" htmlFor="search-query">
          Search Roasters
        </Label>
        <Input
          id="search-query"
          onChange={(e) => updateFilters({ q: e.target.value || undefined })}
          placeholder="Search by name..."
          value={filters.q || ""}
        />
      </div>

      {/* Location Filters */}
      <div className="glass-card card-padding space-y-4">
        <h3 className="mb-2 font-semibold text-lg">Location</h3>

        {/* Countries */}
        {renderFilterSection({
          title: "Country",
          items: filterMeta.countries,
          filterKey: "countries",
          totalCount: filterMeta.totals.active_roasters,
        })}

        {/* States */}
        {renderFilterSection({
          title: "State",
          items: filterMeta.states,
          filterKey: "states",
        })}

        {/* Cities */}
        {renderFilterSection({
          title: "City",
          items: filterMeta.cities,
          filterKey: "cities",
        })}
      </div>

      {/* Boolean Toggles */}
      <div className="glass-card card-padding space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="active-only">Active Only</Label>
          <Switch
            checked={filters.active_only ?? false}
            id="active-only"
            onCheckedChange={handleActiveOnlyChange}
          />
        </div>
      </div>

      {/* Reset Filters Button */}
      <Button className="w-full" onClick={resetFilters} variant="outline">
        Reset Filters
      </Button>
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
    <aside className="hidden w-full flex-shrink-0 space-y-6 md:block md:w-64">
      <RoasterFilterContent filterMeta={filterMeta} />
    </aside>
  );
}
