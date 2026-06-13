"use client";

import { useState, useEffect, useMemo, useRef, startTransition } from "react";
import { useSearch } from "@/hooks/use-search";
import { Icon } from "@/components/common/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Stack } from "@/components/primitives/stack";
import { Cluster } from "@/components/primitives/cluster";
import { useRoasterFilters } from "@/hooks/use-roaster-filters";
import { useRoasterFilterMeta } from "@/hooks/use-roaster-filter-meta";
import type { RoasterFilterMeta, RoasterSort } from "@/types/roaster-types";

type RoasterFacetedFilterBarProps = {
  filterMeta: RoasterFilterMeta;
};

/**
 * Top-aligned faceted filter bar for the roaster directory — search, sort,
 * location dropdowns (country / state / city), and an Active-only toggle.
 * Mirrors CoffeeFacetedFilterBar so the two directories share one desktop
 * pattern. Mobile continues to use MobileFilterDrawer (the checkbox sidebar).
 */
export function RoasterFacetedFilterBar({
  filterMeta: initialFilterMeta,
}: RoasterFacetedFilterBarProps) {
  const { filters, updateFilters, resetFilters, sort, setSort } =
    useRoasterFilters();

  // Search state (Fuse → roaster_ids, mirrors RoasterFilterContent)
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
          updateFilters({ q: undefined, roaster_ids: undefined });
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
      const roasterResults = localSearch.results.filter(
        (r) => r.type === "roaster"
      );
      const ids = roasterResults.map((r) => r.id);
      isUserTypingRef.current = false;
      updateFilters({ q: localSearch.query, roaster_ids: ids });
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

  // Dynamic filter meta so location counts narrow as selections change.
  const { data: dynamicFilterMeta, isFetching: isMetaLoading } =
    useRoasterFilterMeta(filters, initialFilterMeta);
  const filterMeta = dynamicFilterMeta || initialFilterMeta;

  const countryOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.countries.map((c) => ({
        value: c.value,
        label: `${c.label} (${c.count})`,
      })),
    [filterMeta.countries]
  );
  const stateOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.states.map((s) => ({
        value: s.value,
        label: `${s.label} (${s.count})`,
      })),
    [filterMeta.states]
  );
  const cityOptions: MultiSelectOption[] = useMemo(
    () =>
      filterMeta.cities.map((c) => ({
        value: c.value,
        label: `${c.label} (${c.count})`,
      })),
    [filterMeta.cities]
  );

  const hasActiveFilters =
    !!filters.q ||
    !!filters.countries?.length ||
    !!filters.states?.length ||
    !!filters.cities?.length ||
    !!filters.active_only;

  const labelClass =
    "font-bold uppercase tracking-widest text-muted-foreground text-micro";

  return (
    <div
      id="roaster-filters"
      className="w-full rounded-xl border border-border/60 bg-card p-4 text-card-foreground shadow-sm md:p-6"
    >
      <Stack gap="6" className="w-full">
        {/* Top Row: Search and Sort (visible on all devices) */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="w-full sm:flex-1">
            <label className="sr-only" htmlFor="roaster-search">
              Search roasters by name
            </label>
            <Input
              id="roaster-search"
              className="h-10 w-full border-border/60 focus:border-accent/40"
              onChange={handleSearchChange}
              onFocus={ensureSearchReady}
              placeholder="Search roasters..."
              type="text"
              value={qDraft}
            />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <label
              htmlFor="roaster-sort-select"
              className={`shrink-0 ${labelClass}`}
            >
              Sort:
            </label>
            <Select
              value={sort}
              onValueChange={(value) => setSort(value as RoasterSort)}
            >
              <SelectTrigger
                id="roaster-sort-select"
                size="sm"
                className="w-full sm:w-[180px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating_desc">Highest Rated</SelectItem>
                <SelectItem value="coffee_count_desc">Most Coffees</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="name_asc">Name: A to Z</SelectItem>
                <SelectItem value="name_desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location dropdowns: 3 in a row (hidden on mobile, shown on MD+) */}
        <div className="hidden grid-cols-1 gap-4 md:grid md:grid-cols-3">
          <div className="space-y-2">
            <label className={labelClass} htmlFor="roaster-country-select">
              Country
            </label>
            <MultiSelect
              id="roaster-country-select"
              options={countryOptions}
              defaultValue={filters.countries || []}
              onValueChange={(values) =>
                updateFilters({
                  countries: values.length > 0 ? values : undefined,
                })
              }
              placeholder="Any country"
              searchable={true}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass} htmlFor="roaster-state-select">
              State
            </label>
            <MultiSelect
              id="roaster-state-select"
              options={stateOptions}
              defaultValue={filters.states || []}
              onValueChange={(values) =>
                updateFilters({
                  states: values.length > 0 ? values : undefined,
                })
              }
              placeholder="Any state"
              searchable={true}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className={labelClass} htmlFor="roaster-city-select">
              City
            </label>
            <MultiSelect
              id="roaster-city-select"
              options={cityOptions}
              defaultValue={filters.cities || []}
              onValueChange={(values) =>
                updateFilters({
                  cities: values.length > 0 ? values : undefined,
                })
              }
              placeholder="Any city"
              searchable={true}
              className="w-full"
            />
          </div>
        </div>

        {/* Boolean toggle (hidden on mobile) */}
        <div className="hidden md:flex md:flex-wrap md:items-center md:gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <Switch
              checked={filters.active_only ?? false}
              onCheckedChange={(checked) =>
                updateFilters({ active_only: checked || undefined })
              }
            />
            <span className="text-caption font-medium">Active Only</span>
          </label>
          {isMetaLoading && (
            <span className="text-micro text-muted-foreground">Updating…</span>
          )}
        </div>

        {/* Applied filter badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-3 border-y border-border/40 py-3">
            <span className={`shrink-0 ${labelClass}`}>Applied:</span>
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
                    onClick={() =>
                      updateFilters({ q: undefined, roaster_ids: undefined })
                    }
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              )}
              {filters.countries?.length ? (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  {filters.countries.length} Countr
                  {filters.countries.length > 1 ? "ies" : "y"}
                  <button
                    aria-label="Remove country filter"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ countries: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ) : null}
              {filters.states?.length ? (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  {filters.states.length} State
                  {filters.states.length > 1 ? "s" : ""}
                  <button
                    aria-label="Remove state filter"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ states: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ) : null}
              {filters.cities?.length ? (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  {filters.cities.length} Cit
                  {filters.cities.length > 1 ? "ies" : "y"}
                  <button
                    aria-label="Remove city filter"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ cities: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              ) : null}
              {filters.active_only && (
                <Badge
                  className="gap-1.5 border-accent/20 bg-accent/10 px-3 py-1 text-overline text-accent"
                  variant="secondary"
                >
                  Active Only
                  <button
                    aria-label="Remove Active Only filter"
                    className="ml-1 rounded-full transition-colors hover:bg-accent/20"
                    onClick={() => updateFilters({ active_only: undefined })}
                    type="button"
                  >
                    <Icon name="X" size={10} />
                  </button>
                </Badge>
              )}
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
