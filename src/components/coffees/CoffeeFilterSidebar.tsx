"use client";

import { useState, useEffect, useMemo, useRef, startTransition } from "react";
import { useSearch } from "@/hooks/use-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import { Stack } from "@/components/primitives/stack";
import { useCoffeeFilters } from "@/hooks/use-coffee-filters";
import type { CoffeeFilterMeta } from "@/types/coffee-types";
import type {
  CoffeeStatusEnum,
  ProcessEnum,
  RoastLevelEnum,
  SpeciesEnum,
} from "@/types/db-enums";
import { SPECIES_LABELS } from "@/types/coffee-types";

type CoffeeFilterContentProps = {
  filterMeta: CoffeeFilterMeta;
  showHeader?: boolean;
  isVisible?: boolean;
};

/**
 * Coffee Filter Content Component
 * Reusable filter content used in both sidebar and mobile drawer
 * Uses static filter meta: always shows all options regardless of current selection.
 */
export function CoffeeFilterContent({
  filterMeta: initialFilterMeta,
  showHeader = true,
  isVisible: _isVisible = true,
}: CoffeeFilterContentProps) {
  const { filters, updateFilters, resetFilters } = useCoffeeFilters();

  // Local state for price slider to enable smooth dragging
  // Only used during drag, synced from filters when not dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<[number, number] | null>(null);
  // Track committed price range to sync with filters when URL updates
  const committedPriceRangeRef = useRef<[number, number] | null>(null);

  // Local state for search input - updates immediately, commits to URL after debounce
  const [qDraft, setQDraft] = useState(filters.q || "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserTypingRef = useRef(false);
  const prevQRef = useRef<string | undefined>(filters.q);

  // Local Fuse Search
  const localSearch = useSearch({ enableShortcut: false });

  // Ensure index is loaded on interaction
  const ensureSearchReady = () => {
    localSearch.ensureIndexLoaded();
  };

  // Sync qDraft when filters.q changes externally (e.g., from URL or other components)
  // Only sync when user is not actively typing to avoid conflicts
  // Using startTransition to mark as non-urgent update to avoid cascading renders
  useEffect(() => {
    if (prevQRef.current !== filters.q && !isUserTypingRef.current) {
      prevQRef.current = filters.q;
      startTransition(() => {
        setQDraft(filters.q || "");
      });
    }
  }, [filters.q]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Debounced commit to URL
  // Debounced commit to URL with Fuse Search
  const debouncedCommitQ = useMemo(
    () => (value: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        // If empty, clear filters immediately
        if (!value.trim()) {
          isUserTypingRef.current = false;
          updateFilters({ q: undefined, coffee_ids: undefined });
          localSearch.setQuery("");
          return;
        }

        // Trigger Fuse Search
        localSearch.setQuery(value.trim());

        // Note: The actual updateFilters call will happen in the Effect
        // effectively waiting for results.
        // However, to ensure we don't get stuck if Fuse fails or is slow,
        // we could set a fallback?
        // For now, we rely on the effect below.
      }, 300);
    },
    [updateFilters, localSearch]
  );

  // Sync Fuse results to URL filters
  useEffect(() => {
    // Only update if we have a query (active search)
    // and the query matches what we drafted (to avoid stale results overwriting new typing)
    // and we are not currently debouncing (wait for typing to stop?)
    // Actually, localSearch.query is updated immediately safely.

    if (localSearch.query && localSearch.isReady && !localSearch.isLoading) {
      const query = localSearch.query;
      // Filter for coffees only
      const coffeeResults = localSearch.results.filter(
        (r) => r.type === "coffee"
      );
      const ids = coffeeResults.map((r) => r.id);

      // Commit to URL
      // We set 'q' to the query so the UI (and backend text search fallback) knows about it
      // We set 'coffee_ids' to the Fuse matches
      // Only update if different? updateFilters handles shallow merge, but URL push might happen.
      // logic: if qDraft matches query, we are good.

      if (qDraft.trim() === query) {
        isUserTypingRef.current = false;
        updateFilters({ q: query, coffee_ids: ids });
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isUserTypingRef.current = true;
    setQDraft(value); // Immediate UI update
    ensureSearchReady();
    debouncedCommitQ(value); // Debounced URL update (resets typing flag when done)
  };

  // Commit on blur
  const handleSearchBlur = () => {
    isUserTypingRef.current = false;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    updateFilters({ q: qDraft.trim() || undefined });
  };

  // Commit on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      isUserTypingRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      updateFilters({ q: qDraft.trim() || undefined });
      e.currentTarget.blur();
    }
  };

  // Sync dragValue with filters when they match the committed values
  // This ensures the slider stays in the correct position until URL updates complete
  // Note: setState in effect is necessary here to sync with external state (URL params)
  useEffect(() => {
    if (committedPriceRangeRef.current && !isDragging) {
      const [committedMin, committedMax] = committedPriceRangeRef.current;
      const filtersMatch =
        (filters.min_price ?? 0) === committedMin &&
        (filters.max_price ?? 10000) === committedMax;

      if (filtersMatch) {
        // Filters have updated, safe to clear drag state
        // Use startTransition to mark this as non-urgent update
        startTransition(() => {
          setDragValue(null);
        });
        committedPriceRangeRef.current = null;
      }
    }
  }, [filters.min_price, filters.max_price, isDragging]);

  // Derive current value from filters or drag state
  // Keep dragValue even when not dragging, until filters update (handled by useEffect above)
  const currentPriceRange: [number, number] = dragValue ?? [
    filters.min_price ?? 0,
    filters.max_price ?? 10000,
  ];

  // Static filter meta: always show all options regardless of current selection
  const filterMeta = initialFilterMeta;

  // Regions as MultiSelect options (slug for shareable URLs)
  const regionOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.regions.map((region) => ({
        value: region.slug,
        label: `${region.label} (${region.count})`,
      })),
    [filterMeta.regions]
  );

  // Estates as MultiSelect options (key for shareable URLs)
  const estateOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.estates.map((estate) => ({
        value: estate.key,
        label: `${estate.label} (${estate.count})`,
      })),
    [filterMeta.estates]
  );

  // Transform processes to MultiSelectOption format
  const processOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.processes.map((process) => ({
        value: process.value,
        label: `${process.label} (${process.count})`,
      })),
    [filterMeta.processes]
  );

  // Transform canonical flavors to MultiSelectOption format
  const flavorOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.canonicalFlavors.map((flavor) => ({
        value: flavor.slug, // Use slug for human-readable URLs
        label: `${flavor.descriptor} (${flavor.count})`,
      })),
    [filterMeta.canonicalFlavors]
  );

  // Brew methods as MultiSelect options
  const brewOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.brewMethods.map((b) => ({
        value: b.id,
        label: `${b.label} (${b.count})`,
      })),
    [filterMeta.brewMethods]
  );

  // Roasters as MultiSelect options (slug for shareable URLs)
  const roasterOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.roasters.map((r) => ({
        value: r.slug,
        label: `${r.label} (${r.count})`,
      })),
    [filterMeta.roasters]
  );

  // Roast levels as MultiSelect options
  const roastOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.roastLevels.map((r) => ({
        value: r.value,
        label: `${r.label} (${r.count})`,
      })),
    [filterMeta.roastLevels]
  );

  // Species as MultiSelect options
  const speciesOptions: MultiSelectOption[] = useMemo(() => {
    const items = filterMeta.species?.length
      ? filterMeta.species
      : (Object.entries(SPECIES_LABELS) as [SpeciesEnum, string][]).map(
          ([value, label]) => ({ value, label, count: 0 })
        );
    return items.map((item) => ({
      value: item.value,
      label:
        item.count !== undefined && item.count > 0
          ? `${item.label} (${item.count})`
          : item.label,
    }));
  }, [filterMeta.species]);

  // Status as MultiSelect options (active and seasonal only)
  const statusOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.statuses
        .filter((s) => s.value === "active" || s.value === "seasonal")
        .map((s) => ({
          value: s.value,
          label: `${s.label} (${s.count})`,
        })),
    [filterMeta.statuses]
  );

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
          onBlur={handleSearchBlur}
          onKeyDown={handleSearchKeyDown}
          onFocus={ensureSearchReady}
          placeholder="Type to search..."
          type="text"
          value={qDraft}
        />
      </Stack>

      {/* Brew Methods */}
      {brewOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="brew_method_ids"
          >
            Brew Methods
          </label>
          <MultiSelect
            options={brewOptions}
            defaultValue={filters.brew_method_ids || []}
            onValueChange={(values) => {
              updateFilters({
                brew_method_ids: values.length > 0 ? values : undefined,
              });
            }}
            placeholder="Select brew methods..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

      {/* Roasters */}
      {roasterOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="roaster_slugs"
          >
            Roasters
          </label>
          <MultiSelect
            options={roasterOptions}
            defaultValue={
              filters.roaster_slugs ??
              (filters.roaster_ids?.length
                ? filterMeta.roasters
                    .filter((r) => filters.roaster_ids?.includes(r.id))
                    .map((r) => r.slug)
                : [])
            }
            onValueChange={(values) => {
              updateFilters({
                roaster_slugs: values.length > 0 ? values : undefined,
              });
            }}
            placeholder="Select roasters..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

      {/* Roast Levels */}
      {roastOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="roast_levels"
          >
            Roast Level
          </label>
          <MultiSelect
            options={roastOptions}
            defaultValue={filters.roast_levels || []}
            onValueChange={(values) => {
              updateFilters({
                roast_levels:
                  values.length > 0 ? (values as RoastLevelEnum[]) : undefined,
              });
            }}
            placeholder="Select roast level..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

      {/* Species */}
      {speciesOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="bean_species"
          >
            Species
          </label>
          <MultiSelect
            options={speciesOptions}
            defaultValue={filters.bean_species || []}
            onValueChange={(values) => {
              updateFilters({
                bean_species:
                  values.length > 0 ? (values as SpeciesEnum[]) : undefined,
              });
            }}
            placeholder="Select species..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

      {/* Price Range */}
      <Stack gap="3">
        <label
          className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
          htmlFor="priceRange"
        >
          Price Range (₹)
        </label>
        <div className="pt-8 overflow-visible">
          <DualRangeSlider
            id="priceRange"
            min={0}
            max={10000}
            step={50}
            value={currentPriceRange}
            onValueChange={(values) => {
              // Update local state during drag for responsive UI
              setIsDragging(true);
              setDragValue([values[0], values[1]]);
            }}
            onValueCommit={(values) => {
              const [min, max] = values;
              // Store committed values to sync with filters later
              committedPriceRangeRef.current = [min, max];
              // User has released, but keep dragValue set until filters update
              setIsDragging(false);
              // Don't clear dragValue here - wait for filters to update via useEffect
              // If both values are at extremes, clear the filters
              if (min === 0 && max === 10000) {
                updateFilters({
                  min_price: undefined,
                  max_price: undefined,
                });
              } else {
                updateFilters({
                  min_price: min > 0 ? min : undefined,
                  max_price: max < 10000 ? max : undefined,
                });
              }
            }}
            label={(value) => `₹${value?.toLocaleString() ?? "0"}`}
            labelPosition="top"
            className="w-full"
          />
        </div>
      </Stack>

      {/* Flavor Profiles */}
      {flavorOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="canon_flavor_slugs"
          >
            Flavor Profiles
          </label>
          <MultiSelect
            options={flavorOptions}
            defaultValue={filters.canon_flavor_slugs || []}
            onValueChange={(values) => {
              updateFilters({
                canon_flavor_slugs: values.length > 0 ? values : undefined,
              });
            }}
            placeholder="Select flavor profiles..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

      {/* Regions */}
      {regionOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="region_slugs"
          >
            Regions
          </label>
          <MultiSelect
            options={regionOptions}
            defaultValue={
              filters.region_slugs ??
              (filters.region_ids?.length
                ? filterMeta.regions
                    .filter((r) => filters.region_ids?.includes(r.id))
                    .map((r) => r.slug)
                : [])
            }
            onValueChange={(values) => {
              updateFilters({
                region_slugs: values.length > 0 ? values : undefined,
              });
            }}
            placeholder="Select regions..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

      {/* Estates */}
      {estateOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="estate_keys"
          >
            Estates
          </label>
          <MultiSelect
            options={estateOptions}
            defaultValue={
              filters.estate_keys ??
              (filters.estate_ids?.length
                ? filterMeta.estates
                    .filter((e) => filters.estate_ids?.includes(e.id))
                    .map((e) => e.key)
                : [])
            }
            onValueChange={(values) => {
              updateFilters({
                estate_keys: values.length > 0 ? values : undefined,
              });
            }}
            placeholder="Select estates..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

      {/* Processing Methods */}
      {processOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="processes"
          >
            Processing Method
          </label>
          <MultiSelect
            options={processOptions}
            defaultValue={filters.processes || []}
            onValueChange={(values) => {
              updateFilters({
                processes:
                  values.length > 0 ? (values as ProcessEnum[]) : undefined,
              });
            }}
            placeholder="Select processing methods..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

      {/* Status */}
      {statusOptions.length > 0 && (
        <Stack gap="3">
          <label
            className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            htmlFor="status"
          >
            Status
          </label>
          <MultiSelect
            options={statusOptions}
            defaultValue={filters.status || []}
            onValueChange={(values) => {
              updateFilters({
                status:
                  values.length > 0
                    ? (values as CoffeeStatusEnum[])
                    : undefined,
              });
            }}
            placeholder="Select status..."
            searchable={true}
            className="w-full"
            modalPopover={true}
          />
        </Stack>
      )}

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
          <label
            className="group flex cursor-pointer items-center justify-between"
            htmlFor="works_with_milk"
          >
            <span className="text-caption font-medium transition-colors group-hover:text-accent">
              Works with milk
            </span>
            <Switch
              id="works_with_milk"
              checked={filters.works_with_milk === true}
              onCheckedChange={(checked) =>
                updateFilters({
                  works_with_milk: checked ? true : undefined,
                })
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
  // Sidebar is always visible on desktop (when this component renders)
  return (
    <aside className="hidden w-full md:block md:w-64">
      <CoffeeFilterContent filterMeta={filterMeta} isVisible={true} />
    </aside>
  );
}
