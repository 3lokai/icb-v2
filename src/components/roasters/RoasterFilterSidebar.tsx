"use client";

import { useState, useEffect, useMemo, useRef, startTransition } from "react";
import { useSearch } from "@/hooks/use-search";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { useRoasterFilters } from "@/hooks/use-roaster-filters";
import { useRoasterFilterMeta } from "@/hooks/use-roaster-filter-meta";
import type { RoasterFilterMeta } from "@/types/roaster-types";

type RoasterFilterContentProps = {
  filterMeta: RoasterFilterMeta;
  showHeader?: boolean;
};

/**
 * Roaster Filter Content Component
 * Reusable filter content used in both sidebar and mobile drawer
 * Uses dynamic filter counts that update based on active filters
 */
export function RoasterFilterContent({
  filterMeta: initialFilterMeta,
  showHeader = true,
}: RoasterFilterContentProps) {
  const { filters, updateFilters, resetFilters } = useRoasterFilters();

  // Local state for search
  const [qDraft, setQDraft] = useState(filters.q || "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserTypingRef = useRef(false);
  const prevQRef = useRef<string | undefined>(filters.q);

  const localSearch = useSearch({ enableShortcut: false });
  const ensureSearchReady = () => localSearch.ensureIndexLoaded();

  // Sync qDraft when filters.q changes externally
  useEffect(() => {
    if (prevQRef.current !== filters.q && !isUserTypingRef.current) {
      prevQRef.current = filters.q;
      startTransition(() => {
        setQDraft(filters.q || "");
      });
    }
  }, [filters.q]);

  // Debounced commit
  const debouncedCommitQ = useMemo(
    () => (value: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (!value.trim()) {
          isUserTypingRef.current = false;
          updateFilters({ q: undefined, roaster_ids: undefined });
          localSearch.setQuery("");
          return;
        }
        localSearch.setQuery(value.trim());
      }, 300);
    },
    [updateFilters, localSearch]
  );

  // Sync Fuse results
  useEffect(() => {
    if (localSearch.query && localSearch.isReady && !localSearch.isLoading) {
      const query = localSearch.query;
      // Filter for roasters only
      const roasterResults = localSearch.results.filter(
        (r) => r.type === "roaster"
      );
      const ids = roasterResults.map((r) => r.id);

      if (qDraft.trim() === query) {
        isUserTypingRef.current = false;
        updateFilters({ q: query, roaster_ids: ids });
      }
    }
  }, [
    localSearch.results,
    localSearch.isReady,
    localSearch.isLoading,
    localSearch.query,
    qDraft,
    updateFilters,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isUserTypingRef.current = true;
    setQDraft(value);
    ensureSearchReady();
    debouncedCommitQ(value);
  };

  // Fetch dynamic filter meta based on current filters
  // Uses static meta as initial data, updates when filters change
  const { data: dynamicFilterMeta, isFetching: isMetaLoading } =
    useRoasterFilterMeta(filters, initialFilterMeta);

  // Use dynamic meta if available, fallback to initial static meta
  const filterMeta = dynamicFilterMeta || initialFilterMeta;

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
              key={item.value}
            >
              <input
                checked={isFilterSelected(filterKey, item.value)}
                className="h-3.5 w-3.5 rounded border-border/60 text-accent focus:ring-accent/30"
                onChange={() => toggleArrayFilter(filterKey, item.value)}
                type="checkbox"
              />
              <span className="text-caption font-medium transition-colors">
                {item.label}{" "}
                <span
                  className={`text-muted-foreground/50 font-normal ${
                    isMetaLoading ? "opacity-50" : ""
                  }`}
                >
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
          onChange={handleSearchChange}
          onFocus={ensureSearchReady}
          placeholder="Type to search..."
          type="text"
          value={qDraft}
        />
      </Stack>

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
      <Stack gap="4">
        <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
          Options
        </label>
        <Stack gap="3">
          <label
            className="group flex cursor-pointer items-center justify-between"
            htmlFor="active_only"
          >
            <span className="text-caption font-medium transition-colors group-hover:text-accent">
              Active Only
            </span>
            <Switch
              id="active_only"
              checked={filters.active_only ?? false}
              onCheckedChange={(checked) =>
                updateFilters({ active_only: checked || undefined })
              }
            />
          </label>
        </Stack>
      </Stack>
    </Stack>
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
    <aside className="hidden w-full md:block md:w-64">
      <RoasterFilterContent filterMeta={filterMeta} />
    </aside>
  );
}
