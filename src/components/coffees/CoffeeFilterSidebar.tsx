"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Stack } from "@/components/primitives/stack";
import { useCoffeeDirectoryStore } from "@/store/zustand/coffee-directory-store";
import type { CoffeeFilterMeta } from "@/types/coffee-types";
import type {
  CoffeeStatusEnum,
  ProcessEnum,
  RoastLevelEnum,
} from "@/types/db-enums";

type CoffeeFilterContentProps = {
  filterMeta: CoffeeFilterMeta;
  showHeader?: boolean;
};

/**
 * Coffee Filter Content Component
 * Reusable filter content used in both sidebar and mobile drawer
 */
export function CoffeeFilterContent({
  filterMeta,
  showHeader = true,
}: CoffeeFilterContentProps) {
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
      <Stack gap="3">
        <label
          className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
          htmlFor={filterKey}
        >
          {title}
          {totalCount !== undefined && (
            <span className="ml-2 font-normal">({totalCount})</span>
          )}
        </label>
        <Stack
          gap="1"
          className="max-h-64 overflow-y-auto pr-2 custom-scrollbar"
        >
          {items.map((item) => (
            <label
              className="group flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 transition-colors hover:text-accent"
              key={item.id}
            >
              <input
                checked={isFilterSelected(filterKey, getValue(item))}
                className="h-3.5 w-3.5 rounded border-border/60 text-accent focus:ring-accent/30"
                onChange={() => toggleArrayFilter(filterKey, getValue(item))}
                type="checkbox"
              />
              <span className="text-caption font-medium transition-colors">
                {item.label}{" "}
                <span className="text-muted-foreground/50 font-normal">
                  ({item.count})
                </span>
              </span>
            </label>
          ))}
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack gap="8" className="w-full">
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <h2 className="text-subheading font-bold uppercase tracking-widest text-foreground/80">
            Filters
          </h2>
          <Button
            onClick={() => resetFilters()}
            size="sm"
            variant="ghost"
            className="h-auto p-0 text-micro font-bold uppercase tracking-widest hover:text-accent"
          >
            Reset
          </Button>
        </div>
      )}

      {/* Search */}
      <Stack gap="3">
        <label
          className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
          htmlFor="search"
        >
          Filter by Name
        </label>
        <Input
          id="search"
          className="h-10 border-border/60 focus:border-accent/40"
          onChange={(e) =>
            updateFilters({ q: e.target.value.trim() || undefined })
          }
          placeholder="Type to search..."
          type="text"
          value={filters.q || ""}
        />
      </Stack>

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
      <Stack gap="3">
        <label
          className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
          htmlFor="roast_levels"
        >
          Roast Level
        </label>
        <Stack gap="1" className="pr-2 custom-scrollbar">
          {filterMeta.roastLevels.map((roast) => (
            <label
              className="group flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 transition-colors hover:text-accent"
              key={roast.value}
            >
              <input
                checked={isFilterSelected("roast_levels", roast.value)}
                className="h-3.5 w-3.5 rounded border-border/60 text-accent focus:ring-accent/30"
                onChange={() => toggleArrayFilter("roast_levels", roast.value)}
                type="checkbox"
              />
              <span className="text-caption font-medium transition-colors">
                {roast.label}{" "}
                <span className="text-muted-foreground/50 font-normal">
                  ({roast.count})
                </span>
              </span>
            </label>
          ))}
        </Stack>
      </Stack>

      {/* Processing Methods */}
      <Stack gap="3">
        <label
          className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
          htmlFor="processes"
        >
          Processing Method
        </label>
        <Stack gap="1" className="pr-2 custom-scrollbar">
          {filterMeta.processes.map((process) => (
            <label
              className="group flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 transition-colors hover:text-accent"
              key={process.value}
            >
              <input
                checked={isFilterSelected("processes", process.value)}
                className="h-3.5 w-3.5 rounded border-border/60 text-accent focus:ring-accent/30"
                onChange={() => toggleArrayFilter("processes", process.value)}
                type="checkbox"
              />
              <span className="text-caption font-medium transition-colors">
                {process.label}{" "}
                <span className="text-muted-foreground/50 font-normal">
                  ({process.count})
                </span>
              </span>
            </label>
          ))}
        </Stack>
      </Stack>

      {/* Status */}
      <Stack gap="3">
        <label
          className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
          htmlFor="status"
        >
          Status
        </label>
        <Stack gap="1">
          {filterMeta.statuses
            .filter((s) => s.value === "active" || s.value === "seasonal")
            .map((status) => (
              <label
                className="group flex cursor-pointer items-center gap-2.5 rounded-md py-1.5 transition-colors hover:text-accent"
                key={status.value}
              >
                <input
                  checked={isFilterSelected("status", status.value)}
                  className="h-3.5 w-3.5 rounded border-border/60 text-accent focus:ring-accent/30"
                  onChange={() => toggleArrayFilter("status", status.value)}
                  type="checkbox"
                />
                <span className="text-caption font-medium transition-colors">
                  {status.label}{" "}
                  <span className="text-muted-foreground/50 font-normal">
                    ({status.count})
                  </span>
                </span>
              </label>
            ))}
        </Stack>
      </Stack>

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
      <Stack gap="3">
        <label
          className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
          htmlFor="maxPrice"
        >
          Max Price (₹)
        </label>
        <Input
          id="maxPrice"
          className="h-10 border-border/60 focus:border-accent/40"
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
      </Stack>

      {/* Boolean Filters */}
      <Stack gap="4">
        <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
          Options
        </label>
        <Stack gap="3">
          <label
            className="group flex cursor-pointer items-center justify-between"
            htmlFor="in_stock_only"
          >
            <span className="text-caption font-medium transition-colors group-hover:text-accent">
              In Stock Only
            </span>
            <Switch
              id="in_stock_only"
              checked={filters.in_stock_only ?? false}
              onCheckedChange={(checked) =>
                updateFilters({ in_stock_only: checked || undefined })
              }
            />
          </label>
          <label
            className="group flex cursor-pointer items-center justify-between"
            htmlFor="has_250g_only"
          >
            <span className="text-caption font-medium transition-colors group-hover:text-accent">
              Has 250g Option
            </span>
            <Switch
              id="has_250g_only"
              checked={filters.has_250g_only ?? false}
              onCheckedChange={(checked) =>
                updateFilters({ has_250g_only: checked || undefined })
              }
            />
          </label>
        </Stack>
      </Stack>
    </Stack>
  );
}

type CoffeeFilterSidebarProps = {
  filterMeta: CoffeeFilterMeta;
};

/**
 * Coffee Filter Sidebar Component
 * Full filter UI with multi-selects, price range, and boolean toggles
 * URL sync is handled automatically by CoffeeDirectory component
 * Hidden on mobile, visible on desktop
 */
export function CoffeeFilterSidebar({ filterMeta }: CoffeeFilterSidebarProps) {
  return (
    <aside className="hidden w-full md:block md:w-64">
      <CoffeeFilterContent filterMeta={filterMeta} />
    </aside>
  );
}
