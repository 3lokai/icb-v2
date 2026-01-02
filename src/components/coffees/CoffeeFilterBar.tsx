"use client";

import { Icon } from "@/components/common/Icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cluster } from "@/components/primitives/cluster";
import { useCoffeeFilters } from "@/hooks/use-coffee-filters";

/**
 * Coffee Filter Bar Component
 * Quick filter chips for common filters
 * URL sync is handled automatically by CoffeeDirectory component
 */
export function CoffeeFilterBar() {
  const { filters, updateFilters, resetFilters } = useCoffeeFilters();

  // Check if any filters are active
  const hasActiveFilters =
    filters.in_stock_only ||
    filters.has_250g_only ||
    filters.max_price ||
    filters.roast_levels?.length ||
    filters.processes?.length ||
    filters.status?.length ||
    filters.flavor_keys?.length ||
    filters.q;

  // Quick filter actions
  const handleQuickFilter = (filterType: string) => {
    if (filterType === "inStock") {
      updateFilters({
        in_stock_only: filters.in_stock_only ? undefined : true,
      });
    } else if (filterType === "has250g") {
      updateFilters({
        has_250g_only: filters.has_250g_only ? undefined : true,
      });
    } else if (filterType === "under500") {
      updateFilters({
        max_price: filters.max_price === 500 ? undefined : 500,
      });
    }
  };

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="shrink-0 font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
          Refine Results:
        </span>
        <Cluster gap="2">
          <Button
            className="shrink-0"
            onClick={() => handleQuickFilter("inStock")}
            size="sm"
            variant={filters.in_stock_only ? "default" : "chip"}
          >
            In Stock
          </Button>
          <Button
            className="shrink-0"
            onClick={() => handleQuickFilter("has250g")}
            size="sm"
            variant={filters.has_250g_only ? "default" : "chip"}
          >
            Has 250g
          </Button>
          <Button
            className="shrink-0"
            onClick={() => handleQuickFilter("under500")}
            size="sm"
            variant={filters.max_price === 500 ? "default" : "chip"}
          >
            Under ₹500
          </Button>
        </Cluster>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-3 py-2 border-y border-border/40">
          <span className="shrink-0 font-bold uppercase tracking-widest text-muted-foreground/60 text-micro">
            Applied:
          </span>
          <Cluster gap="2">
            {filters.in_stock_only && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                In Stock
                <button
                  aria-label="Remove In Stock filter"
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => updateFilters({ in_stock_only: undefined })}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {filters.has_250g_only && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                Has 250g
                <button
                  aria-label="Remove Has 250g filter"
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => updateFilters({ has_250g_only: undefined })}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {filters.max_price && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                Under ₹{filters.max_price}
                <button
                  aria-label="Remove price filter"
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => updateFilters({ max_price: undefined })}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {filters.roast_levels && filters.roast_levels.length > 0 && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                {filters.roast_levels.length} Roast Level
                {filters.roast_levels.length > 1 ? "s" : ""}
                <button
                  aria-label="Remove roast level filter"
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => updateFilters({ roast_levels: undefined })}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {filters.processes && filters.processes.length > 0 && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                {filters.processes.length} Process
                {filters.processes.length > 1 ? "es" : ""}
                <button
                  aria-label="Remove process filter"
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => updateFilters({ processes: undefined })}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {filters.flavor_keys && filters.flavor_keys.length > 0 && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                {filters.flavor_keys.length} Flavor
                {filters.flavor_keys.length > 1 ? "s" : ""}
                <button
                  aria-label="Remove flavor filter"
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => updateFilters({ flavor_keys: undefined })}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            {filters.q && (
              <Badge
                className="shrink-0 gap-1.5 px-3 py-1 text-overline bg-accent/10 text-accent border-accent/20"
                variant="secondary"
              >
                Search: {filters.q}
                <button
                  aria-label="Remove search filter"
                  className="ml-1 rounded-full hover:bg-accent/20 transition-colors"
                  onClick={() => updateFilters({ q: undefined })}
                  type="button"
                >
                  <Icon name="X" size={10} />
                </button>
              </Badge>
            )}
            <Button
              className="shrink-0 text-micro font-bold uppercase tracking-widest hover:text-accent"
              onClick={() => resetFilters()}
              size="sm"
              variant="link"
            >
              Clear all
            </Button>
          </Cluster>
        </div>
      )}
    </div>
  );
}
