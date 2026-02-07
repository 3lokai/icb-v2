"use client";

import { useState, useEffect, useMemo, useRef, startTransition } from "react";
import { useSearch } from "@/hooks/use-search";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { useCoffeeFilters } from "@/hooks/use-coffee-filters";
import type { CoffeeSort } from "@/types/coffee-types";
import type { CoffeeFilterMeta } from "@/types/coffee-types";
import { SPECIES_LABELS as SPECIES_LABELS_MAP } from "@/types/coffee-types";
import type {
  ProcessEnum,
  RoastLevelEnum,
  SpeciesEnum,
} from "@/types/db-enums";

type CoffeeFacetedFilterBarProps = {
  filterMeta: CoffeeFilterMeta;
  isVisible?: boolean;
};

/**
 * Top-aligned faceted filter bar: search, primary filters (roast, brew, species),
 * and expandable Refine panel for advanced filters.
 */
export function CoffeeFacetedFilterBar({
  filterMeta: initialFilterMeta,
  isVisible: _isVisible = true,
}: CoffeeFacetedFilterBarProps) {
  const { filters, updateFilters, resetFilters, sort, setSort } =
    useCoffeeFilters();

  // Refine panel open state
  const [refineOpen, setRefineOpen] = useState(false);

  // Price slider state (same as CoffeeFilterContent)
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<[number, number] | null>(null);
  const committedPriceRangeRef = useRef<[number, number] | null>(null);

  // Search state
  const [qDraft, setQDraft] = useState(filters.q || "");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUserTypingRef = useRef(false);
  const prevQRef = useRef<string | undefined>(filters.q);

  const localSearch = useSearch({ enableShortcut: false });
  const ensureSearchReady = () => localSearch.ensureIndexLoaded();

  useEffect(() => {
    if (prevQRef.current !== filters.q && !isUserTypingRef.current) {
      prevQRef.current = filters.q;
      startTransition(() => setQDraft(filters.q || ""));
    }
  }, [filters.q]);

  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    []
  );

  const debouncedCommitQ = useMemo(
    () => (value: string) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        if (!value.trim()) {
          isUserTypingRef.current = false;
          updateFilters({ q: undefined, coffee_ids: undefined });
          localSearch.setQuery("");
          return;
        }
        localSearch.setQuery(value.trim());
      }, 300);
    },
    [updateFilters, localSearch]
  );

  useEffect(() => {
    if (
      localSearch.query &&
      localSearch.isReady &&
      !localSearch.isLoading &&
      qDraft.trim() === localSearch.query
    ) {
      const coffeeResults = localSearch.results.filter(
        (r) => r.type === "coffee"
      );
      const ids = coffeeResults.map((r) => r.id);
      isUserTypingRef.current = false;
      updateFilters({ q: localSearch.query, coffee_ids: ids });
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

  const handleSearchBlur = () => {
    isUserTypingRef.current = false;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    updateFilters({ q: qDraft.trim() || undefined });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      isUserTypingRef.current = false;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      updateFilters({ q: qDraft.trim() || undefined });
      e.currentTarget.blur();
    }
  };

  // Price slider sync
  useEffect(() => {
    if (committedPriceRangeRef.current && !isDragging) {
      const [committedMin, committedMax] = committedPriceRangeRef.current;
      if (
        (filters.min_price ?? 0) === committedMin &&
        (filters.max_price ?? 10000) === committedMax
      ) {
        startTransition(() => setDragValue(null));
        committedPriceRangeRef.current = null;
      }
    }
  }, [filters.min_price, filters.max_price, isDragging]);

  const currentPriceRange: [number, number] = dragValue ?? [
    filters.min_price ?? 0,
    filters.max_price ?? 10000,
  ];

  // Static filter meta: always show all options regardless of current selection
  const filterMeta = initialFilterMeta;

  // Primary filter options: roast, brew, species
  const roastOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.roastLevels.map((r) => ({
        value: r.value,
        label: `${r.label} (${r.count})`,
      })),
    [filterMeta.roastLevels]
  );

  const brewOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.brewMethods.map((b) => ({
        value: b.id,
        label: `${b.label} (${b.count})`,
      })),
    [filterMeta.brewMethods]
  );

  const speciesOptions: MultiSelectOption[] = useMemo(() => {
    if (filterMeta.species?.length) {
      return filterMeta.species.map((s) => ({
        value: s.value,
        label: `${s.label} (${s.count})`,
      }));
    }
    return (Object.entries(SPECIES_LABELS_MAP) as [SpeciesEnum, string][]).map(
      ([value, label]) => ({ value, label })
    );
  }, [filterMeta.species]);

  // Refine panel options
  const regionOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.regions.map((r) => ({
        value: r.id,
        label: `${r.label} (${r.count})`,
      })),
    [filterMeta.regions]
  );
  const estateOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.estates.map((e) => ({
        value: e.id,
        label: `${e.label} (${e.count})`,
      })),
    [filterMeta.estates]
  );
  const processOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.processes.map((p) => ({
        value: p.value,
        label: `${p.label} (${p.count})`,
      })),
    [filterMeta.processes]
  );
  const flavorOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.canonicalFlavors.map((f) => ({
        value: f.slug, // Use slug for human-readable URLs
        label: `${f.descriptor} (${f.count})`,
      })),
    [filterMeta.canonicalFlavors]
  );

  const isFilterSelected = (
    filterKey:
      | "roast_levels"
      | "processes"
      | "status"
      | "roaster_ids"
      | "roaster_slugs"
      | "region_ids"
      | "region_slugs"
      | "estate_ids"
      | "estate_keys"
      | "brew_method_ids"
      | "canon_flavor_slugs"
      | "bean_species",
    value: string
  ) => {
    const arr = filters[filterKey] as string[] | undefined;
    return arr?.includes(value) ?? false;
  };

  const toggleArrayFilter = (
    filterKey:
      | "roast_levels"
      | "processes"
      | "status"
      | "roaster_ids"
      | "roaster_slugs"
      | "region_ids"
      | "region_slugs"
      | "estate_ids"
      | "estate_keys"
      | "brew_method_ids"
      | "canon_flavor_slugs"
      | "bean_species",
    value: string
  ) => {
    const current = (filters[filterKey] || []) as string[];
    const newValue = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilters({
      [filterKey]: newValue.length > 0 ? newValue : undefined,
    });
  };

  const hasActiveFilters =
    !!filters.q ||
    !!filters.roast_levels?.length ||
    !!filters.brew_method_ids?.length ||
    !!filters.bean_species?.length ||
    !!filters.processes?.length ||
    !!filters.status?.length ||
    !!filters.canon_flavor_slugs?.length ||
    !!filters.canon_flavor_node_ids?.length || // Backward compat
    !!filters.region_slugs?.length ||
    !!filters.region_ids?.length || // Backward compat
    !!filters.estate_keys?.length ||
    !!filters.estate_ids?.length || // Backward compat
    !!filters.roaster_slugs?.length ||
    !!filters.roaster_ids?.length || // Backward compat
    !!filters.in_stock_only ||
    !!filters.has_250g_only ||
    !!filters.min_price ||
    !!filters.max_price;

  return (
    <div className="w-full rounded-xl border border-border/60 bg-card p-4 text-card-foreground shadow-sm md:p-6">
      <Stack gap="6" className="w-full">
        {/* Top Row: Search and Sort (Visible on all devices) */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search bar - Flex grow */}
          <div className="w-full sm:flex-1">
            <label className="sr-only" htmlFor="coffee-search">
              Search coffees by name
            </label>
            <Input
              id="coffee-search"
              className="h-10 w-full border-border/60 focus:border-accent/40"
              onChange={handleSearchChange}
              onBlur={handleSearchBlur}
              onKeyDown={handleSearchKeyDown}
              onFocus={ensureSearchReady}
              placeholder="Search coffees..."
              type="text"
              value={qDraft}
            />
          </div>

          {/* Sort dropdown - Fixed width on desktop, flexible on mobile */}
          <div className="flex shrink-0 items-center gap-2">
            <label
              htmlFor="sort-select"
              className="shrink-0 font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
            >
              Sort:
            </label>
            <Select
              value={sort}
              onValueChange={(value) => setSort(value as CoffeeSort)}
            >
              <SelectTrigger
                id="sort-select"
                size="sm"
                className="w-full sm:w-[180px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="best_value">Best Value</SelectItem>
                <SelectItem value="rating_desc">Highest Rated</SelectItem>
                <SelectItem value="name_asc">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Primary filters: 3 in a row (Hidden on Mobile, shown on MD+) */}
        <div className="hidden grid-cols-1 gap-4 md:grid md:grid-cols-3">
          <div className="space-y-2">
            <label
              className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
              htmlFor="roast-level-select"
            >
              Roast Level
            </label>
            <MultiSelect
              id="roast-level-select"
              options={roastOptions}
              defaultValue={filters.roast_levels || []}
              onValueChange={(values) =>
                updateFilters({
                  roast_levels:
                    values.length > 0
                      ? (values as RoastLevelEnum[])
                      : undefined,
                })
              }
              placeholder="Any roast"
              searchable={true}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
              htmlFor="brew-method-select"
            >
              Brew Method
            </label>
            <MultiSelect
              id="brew-method-select"
              options={brewOptions}
              defaultValue={filters.brew_method_ids || []}
              onValueChange={(values) =>
                updateFilters({
                  brew_method_ids: values.length > 0 ? values : undefined,
                })
              }
              placeholder="Any method"
              searchable={true}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label
              className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
              htmlFor="species-select"
            >
              Species
            </label>
            <MultiSelect
              id="species-select"
              options={speciesOptions}
              defaultValue={filters.bean_species || []}
              onValueChange={(values) =>
                updateFilters({
                  bean_species:
                    values.length > 0 ? (values as SpeciesEnum[]) : undefined,
                })
              }
              placeholder="Any species"
              searchable={true}
              className="w-full"
            />
          </div>
        </div>

        {/* Refine Search Panel (Hidden on Mobile) */}
        <div className="hidden md:block">
          <Collapsible open={refineOpen} onOpenChange={setRefineOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between sm:w-auto"
              >
                Advanced Filters
                <Icon
                  name="CaretDown"
                  size={16}
                  className={`transition-transform ${
                    refineOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-4 space-y-6 rounded-lg border border-border/40 bg-muted/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-2">
                  <span className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
                    Advanced filters
                  </span>
                  <Button
                    onClick={() => resetFilters()}
                    size="sm"
                    variant="ghost"
                    className="h-auto text-micro uppercase tracking-widest hover:text-accent"
                  >
                    Reset all
                  </Button>
                </div>

                {/* Price Range */}
                <Stack gap="3">
                  <label
                    className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro"
                    htmlFor="priceRange"
                  >
                    Price Range (₹)
                  </label>
                  <div className="overflow-visible pt-8">
                    <DualRangeSlider
                      id="priceRange"
                      min={0}
                      max={10000}
                      step={50}
                      value={currentPriceRange}
                      onValueChange={(values) => {
                        setIsDragging(true);
                        setDragValue([values[0], values[1]]);
                      }}
                      onValueCommit={(values) => {
                        const [min, max] = values;
                        committedPriceRangeRef.current = [min, max];
                        setIsDragging(false);
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

                {/* Roasters, Regions, Estates - grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filterMeta.roasters.length > 0 && (
                    <Stack gap="2">
                      <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
                        Roasters
                      </label>
                      <MultiSelect
                        options={filterMeta.roasters.map((r) => ({
                          value: r.id,
                          label: `${r.label} (${r.count})`,
                        }))}
                        defaultValue={filters.roaster_ids || []}
                        onValueChange={(values) =>
                          updateFilters({
                            roaster_ids: values.length > 0 ? values : undefined,
                          })
                        }
                        placeholder="Select roasters..."
                        searchable={true}
                        className="w-full"
                      />
                    </Stack>
                  )}
                  {regionOptions.length > 0 && (
                    <Stack gap="2">
                      <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
                        Regions
                      </label>
                      <MultiSelect
                        options={regionOptions}
                        defaultValue={filters.region_ids || []}
                        onValueChange={(values) =>
                          updateFilters({
                            region_ids: values.length > 0 ? values : undefined,
                          })
                        }
                        placeholder="Select regions..."
                        searchable={true}
                        className="w-full"
                      />
                    </Stack>
                  )}
                  {estateOptions.length > 0 && (
                    <Stack gap="2">
                      <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
                        Estates
                      </label>
                      <MultiSelect
                        options={estateOptions}
                        defaultValue={filters.estate_ids || []}
                        onValueChange={(values) =>
                          updateFilters({
                            estate_ids: values.length > 0 ? values : undefined,
                          })
                        }
                        placeholder="Select estates..."
                        searchable={true}
                        className="w-full"
                      />
                    </Stack>
                  )}
                </div>

                {/* Flavors, Processing, Status */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {flavorOptions.length > 0 && (
                    <Stack gap="2">
                      <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
                        Flavor Profiles
                      </label>
                      <MultiSelect
                        options={flavorOptions}
                        defaultValue={filters.canon_flavor_slugs || []}
                        onValueChange={(values) =>
                          updateFilters({
                            canon_flavor_slugs:
                              values.length > 0 ? values : undefined,
                          })
                        }
                        placeholder="Select flavors..."
                        searchable={true}
                        className="w-full"
                      />
                    </Stack>
                  )}
                  {processOptions.length > 0 && (
                    <Stack gap="2">
                      <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
                        Processing
                      </label>
                      <MultiSelect
                        options={processOptions}
                        defaultValue={filters.processes || []}
                        onValueChange={(values) =>
                          updateFilters({
                            processes:
                              values.length > 0
                                ? (values as ProcessEnum[])
                                : undefined,
                          })
                        }
                        placeholder="Select process..."
                        searchable={true}
                        className="w-full"
                      />
                    </Stack>
                  )}
                  <Stack gap="2">
                    <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
                      Status
                    </label>
                    <Stack gap="1" className="pr-2">
                      {filterMeta.statuses
                        .filter(
                          (s) => s.value === "active" || s.value === "seasonal"
                        )
                        .map((status) => (
                          <label
                            className="flex cursor-pointer items-center gap-2 py-1.5 transition-colors hover:text-accent"
                            key={status.value}
                          >
                            <input
                              checked={isFilterSelected("status", status.value)}
                              className="h-3.5 w-3.5 rounded border-border/60 text-accent focus:ring-accent/30"
                              onChange={() =>
                                toggleArrayFilter("status", status.value)
                              }
                              type="checkbox"
                            />
                            <span className="text-caption font-medium">
                              {status.label}{" "}
                              <span className="text-muted-foreground/50">
                                ({status.count})
                              </span>
                            </span>
                          </label>
                        ))}
                    </Stack>
                  </Stack>
                </div>

                {/* Boolean toggles */}
                <Stack gap="3">
                  <label className="font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
                    Options
                  </label>
                  <div className="flex flex-wrap gap-6">
                    <label className="flex cursor-pointer items-center gap-2">
                      <Switch
                        checked={filters.in_stock_only ?? false}
                        onCheckedChange={(checked) =>
                          updateFilters({
                            in_stock_only: checked || undefined,
                          })
                        }
                      />
                      <span className="text-caption font-medium">
                        In Stock Only
                      </span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <Switch
                        checked={filters.has_250g_only ?? false}
                        onCheckedChange={(checked) =>
                          updateFilters({
                            has_250g_only: checked || undefined,
                          })
                        }
                      />
                      <span className="text-caption font-medium">
                        Has 250g Option
                      </span>
                    </label>
                  </div>
                </Stack>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Active filters badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-3 border-y border-border/40 py-3">
            <span className="shrink-0 font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
              Applied:
            </span>
            <Cluster gap="2">
              {filters.q && (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Search: {filters.q}
                  <button
                    aria-label="Remove search"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ q: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              )}
              {filters.roast_levels?.map((v) => (
                <Badge
                  key={v}
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  {v}
                  <button
                    aria-label={`Remove ${v}`}
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() =>
                      updateFilters({
                        roast_levels: filters.roast_levels?.filter(
                          (x) => x !== v
                        ).length
                          ? filters.roast_levels?.filter((x) => x !== v)
                          : undefined,
                      })
                    }
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ))}
              {filters.brew_method_ids?.length ? (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Brew
                  <button
                    aria-label="Remove brew method"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() =>
                      updateFilters({ brew_method_ids: undefined })
                    }
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ) : null}
              {filters.bean_species?.map((v) => (
                <Badge
                  key={v}
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  {SPECIES_LABELS_MAP[v] ?? v}
                  <button
                    aria-label={`Remove ${v}`}
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() =>
                      updateFilters({
                        bean_species: filters.bean_species?.filter(
                          (x) => x !== v
                        ).length
                          ? filters.bean_species?.filter((x) => x !== v)
                          : undefined,
                      })
                    }
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ))}
              {filters.in_stock_only && (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  In Stock
                  <button
                    aria-label="Remove In Stock"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ in_stock_only: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              )}
              {filters.has_250g_only && (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Has 250g
                  <button
                    aria-label="Remove Has 250g"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ has_250g_only: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              )}
              {(filters.min_price || filters.max_price) && (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Price
                  <button
                    aria-label="Remove price filter"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() =>
                      updateFilters({
                        min_price: undefined,
                        max_price: undefined,
                      })
                    }
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              )}
              {filters.processes?.length ? (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Process
                  <button
                    aria-label="Remove process"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ processes: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ) : null}
              {filters.region_ids?.length ? (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Region
                  <button
                    aria-label="Remove region"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ region_ids: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ) : null}
              {filters.roaster_ids?.length ? (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Roaster
                  <button
                    aria-label="Remove roaster"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ roaster_ids: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ) : null}
              {filters.canon_flavor_slugs?.length ? (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Flavor
                  <button
                    aria-label="Remove flavor"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() =>
                      updateFilters({ canon_flavor_slugs: undefined })
                    }
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ) : null}
              <Button
                className="text-micro font-bold uppercase tracking-widest hover:text-accent"
                onClick={() => resetFilters()}
                size="sm"
                variant="link"
              >
                Clear all
              </Button>
            </Cluster>
          </div>
        )}
      </Stack>
    </div>
  );
}
