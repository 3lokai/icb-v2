"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCoffeeDirectoryStore } from "@/store/zustand/coffee-directory-store";
import type { CoffeeFilterMeta } from "@/types/coffee-types";
import type {
  CoffeeStatusEnum,
  ProcessEnum,
  RoastLevelEnum,
} from "@/types/db-enums";

type CoffeeFilterSidebarProps = {
  filterMeta: CoffeeFilterMeta;
};

/**
 * Coffee Filter Sidebar Component
 * Full filter UI with multi-selects, price range, and boolean toggles
 * URL sync is handled automatically by CoffeeDirectory component
 */
export function CoffeeFilterSidebar({ filterMeta }: CoffeeFilterSidebarProps) {
  const { filters, updateFilters, resetFilters } = useCoffeeDirectoryStore();

  // Toggle array filter values
  const toggleArrayFilter = (
    filterKey:
      | "roast_levels"
      | "processes"
      | "status"
      | "flavor_keys"
      | "roaster_ids"
      | "region_ids"
      | "estate_ids"
      | "brew_method_ids",
    value: RoastLevelEnum | ProcessEnum | CoffeeStatusEnum | string
  ) => {
    const current = filters[filterKey] || [];
    const newValue = current.includes(value as any)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilters({ [filterKey]: newValue.length > 0 ? newValue : undefined });
  };

  // Check if filter is selected
  const isFilterSelected = (
    filterKey:
      | "roast_levels"
      | "processes"
      | "status"
      | "flavor_keys"
      | "roaster_ids"
      | "region_ids"
      | "estate_ids"
      | "brew_method_ids",
    value: string
  ) => {
    const filterArray = filters[filterKey] as string[] | undefined;
    return filterArray?.includes(value) ?? false;
  };

  // Helper to render filter section with counts
  type FilterSectionOptions<
    T extends { id: string; label: string; count: number },
  > = {
    title: string;
    items: T[];
    filterKey:
      | "roaster_ids"
      | "region_ids"
      | "estate_ids"
      | "brew_method_ids"
      | "flavor_keys";
    getValue: (item: T) => string;
    totalCount?: number;
  };

  const renderFilterSection = <
    T extends { id: string; label: string; count: number },
  >(
    options: FilterSectionOptions<T>
  ) => {
    const { title, items, filterKey, getValue, totalCount } = options;
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
              key={item.id}
            >
              <input
                checked={isFilterSelected(filterKey, getValue(item))}
                className="h-4 w-4 rounded border-input"
                onChange={() => toggleArrayFilter(filterKey, getValue(item))}
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
    <aside className="w-full space-y-6 md:w-64">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Filters</h2>
        <Button onClick={() => resetFilters()} size="sm" variant="ghost">
          Reset
        </Button>
      </div>

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
          placeholder="Search coffees..."
          type="text"
          value={filters.q || ""}
        />
      </div>

      {/* Roasters */}
      {renderFilterSection({
        title: "Roasters",
        items: filterMeta.roasters,
        filterKey: "roaster_ids",
        getValue: (item) => item.id,
        totalCount: filterMeta.totals.roasters,
      })}

      {/* Regions */}
      {renderFilterSection({
        title: "Regions",
        items: filterMeta.regions,
        filterKey: "region_ids",
        getValue: (item) => item.id,
      })}

      {/* Estates */}
      {renderFilterSection({
        title: "Estates",
        items: filterMeta.estates,
        filterKey: "estate_ids",
        getValue: (item) => item.id,
      })}

      {/* Roast Levels */}
      <div className="space-y-2">
        <label className="font-medium text-sm" htmlFor="roast_levels">
          Roast Level
        </label>
        <div className="space-y-2">
          {filterMeta.roastLevels.map((roast) => (
            <label
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent/50"
              key={roast.value}
            >
              <input
                checked={isFilterSelected("roast_levels", roast.value)}
                className="h-4 w-4 rounded border-input"
                onChange={() => toggleArrayFilter("roast_levels", roast.value)}
                type="checkbox"
              />
              <span className="text-sm">
                {roast.label}{" "}
                <span className="text-muted-foreground">({roast.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Processing Methods */}
      <div className="space-y-2">
        <label className="font-medium text-sm" htmlFor="processes">
          Processing Method
        </label>
        <div className="space-y-2">
          {filterMeta.processes.map((process) => (
            <label
              className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent/50"
              key={process.value}
            >
              <input
                checked={isFilterSelected("processes", process.value)}
                className="h-4 w-4 rounded border-input"
                onChange={() => toggleArrayFilter("processes", process.value)}
                type="checkbox"
              />
              <span className="text-sm">
                {process.label}{" "}
                <span className="text-muted-foreground">({process.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="font-medium text-sm" htmlFor="status">
          Status
        </label>
        <div className="space-y-2">
          {filterMeta.statuses
            .filter((s) => s.value === "active" || s.value === "seasonal")
            .map((status) => (
              <label
                className="flex cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-accent/50"
                key={status.value}
              >
                <input
                  checked={isFilterSelected("status", status.value)}
                  className="h-4 w-4 rounded border-input"
                  onChange={() => toggleArrayFilter("status", status.value)}
                  type="checkbox"
                />
                <span className="text-sm">
                  {status.label}{" "}
                  <span className="text-muted-foreground">
                    ({status.count})
                  </span>
                </span>
              </label>
            ))}
        </div>
      </div>

      {/* Flavor Profiles */}
      {renderFilterSection({
        title: "Flavor Profiles",
        items: filterMeta.flavorNotes,
        filterKey: "flavor_keys",
        getValue: (item) => item.id, // flavor_keys uses the key field, which is stored as id in our meta
        totalCount: filterMeta.flavorNotes.reduce(
          (sum, item) => sum + item.count,
          0
        ),
      })}

      {/* Brew Methods */}
      {renderFilterSection({
        title: "Brew Methods",
        items: filterMeta.brewMethods,
        filterKey: "brew_method_ids",
        getValue: (item) => item.id,
      })}

      {/* Price Range */}
      <div className="space-y-2">
        <label className="font-medium text-sm" htmlFor="maxPrice">
          Max Price (₹)
        </label>
        <Input
          id="maxPrice"
          min="0"
          onChange={(e) => {
            const value = e.target.value
              ? Number.parseInt(e.target.value, 10)
              : undefined;
            updateFilters({
              max_price: value && value > 0 ? value : undefined,
            });
          }}
          placeholder="e.g. 500"
          type="number"
          value={filters.max_price || ""}
        />
      </div>

      {/* Boolean Filters */}
      <div className="space-y-4">
        <label className="font-medium text-sm" htmlFor="in_stock_only">
          Options
        </label>
        <div className="space-y-3">
          <label
            className="flex cursor-pointer items-center justify-between"
            htmlFor="in_stock_only"
          >
            <span className="text-sm">In Stock Only</span>
            <Switch
              checked={filters.in_stock_only ?? false}
              onCheckedChange={(checked) =>
                updateFilters({ in_stock_only: checked || undefined })
              }
            />
          </label>
          <label
            className="flex cursor-pointer items-center justify-between"
            htmlFor="has_250g_only"
          >
            <span className="text-sm">Has 250g Option</span>
            <Switch
              checked={filters.has_250g_only ?? false}
              onCheckedChange={(checked) =>
                updateFilters({ has_250g_only: checked || undefined })
              }
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
