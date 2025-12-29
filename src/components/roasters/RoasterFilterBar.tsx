"use client";

import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
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
    <Stack gap="4" className="mb-8">
      <Cluster gap="3" align="center">
        <span className="shrink-0 font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
          Quick filters:
        </span>
        <Button
          className="shrink-0"
          onClick={() => handleQuickFilter("active")}
          size="sm"
          variant={filters.active_only ? "default" : "chip"}
        >
          Active Only
        </Button>
      </Cluster>

      {hasActiveFilters && (
        <Cluster
          gap="2"
          align="center"
          className="pt-2 border-t border-border/20"
        >
          <span className="shrink-0 font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
            Applied:
          </span>
          {filters.active_only && (
            <Badge
              className="shrink-0 gap-1.5 px-3 py-1 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors"
              variant="secondary"
            >
              <span className="text-micro font-bold uppercase tracking-widest">
                Active Only
              </span>
              <button
                aria-label="Remove Active Only filter"
                className="ml-1 rounded-full p-0.5 hover:bg-accent/20 transition-colors"
                onClick={() => updateFilters({ active_only: undefined })}
                type="button"
              >
                <Icon name="X" size={10} />
              </button>
            </Badge>
          )}
          {filters.cities && filters.cities.length > 0 && (
            <Badge
              className="shrink-0 gap-1.5 px-3 py-1 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors"
              variant="secondary"
            >
              <span className="text-micro font-bold uppercase tracking-widest">
                {filters.cities.length} Cit
                {filters.cities.length > 1 ? "ies" : "y"}
              </span>
              <button
                aria-label="Remove city filter"
                className="ml-1 rounded-full p-0.5 hover:bg-accent/20 transition-colors"
                onClick={() => updateFilters({ cities: undefined })}
                type="button"
              >
                <Icon name="X" size={10} />
              </button>
            </Badge>
          )}
          {filters.states && filters.states.length > 0 && (
            <Badge
              className="shrink-0 gap-1.5 px-3 py-1 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors"
              variant="secondary"
            >
              <span className="text-micro font-bold uppercase tracking-widest">
                {filters.states.length} State
                {filters.states.length > 1 ? "s" : ""}
              </span>
              <button
                aria-label="Remove state filter"
                className="ml-1 rounded-full p-0.5 hover:bg-accent/20 transition-colors"
                onClick={() => updateFilters({ states: undefined })}
                type="button"
              >
                <Icon name="X" size={10} />
              </button>
            </Badge>
          )}
          {filters.countries && filters.countries.length > 0 && (
            <Badge
              className="shrink-0 gap-1.5 px-3 py-1 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors"
              variant="secondary"
            >
              <span className="text-micro font-bold uppercase tracking-widest">
                {filters.countries.length} Countr
                {filters.countries.length > 1 ? "ies" : "y"}
              </span>
              <button
                aria-label="Remove country filter"
                className="ml-1 rounded-full p-0.5 hover:bg-accent/20 transition-colors"
                onClick={() => updateFilters({ countries: undefined })}
                type="button"
              >
                <Icon name="X" size={10} />
              </button>
            </Badge>
          )}
          {filters.q && (
            <Badge
              className="shrink-0 gap-1.5 px-3 py-1 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 transition-colors"
              variant="secondary"
            >
              <span className="text-micro font-bold uppercase tracking-widest italic">
                "{filters.q}"
              </span>
              <button
                aria-label="Remove search filter"
                className="ml-1 rounded-full p-0.5 hover:bg-accent/20 transition-colors"
                onClick={() => updateFilters({ q: undefined })}
                type="button"
              >
                <Icon name="X" size={10} />
              </button>
            </Badge>
          )}
          <Button
            className="shrink-0 text-micro font-bold uppercase tracking-widest h-auto p-0 underline-offset-4 hover:text-accent"
            onClick={() => resetFilters()}
            size="sm"
            variant="link"
          >
            Clear all
          </Button>
        </Cluster>
      )}
    </Stack>
  );
}
