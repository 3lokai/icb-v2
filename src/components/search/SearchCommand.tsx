"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchResultRow } from "@/components/search/SearchResultRow";
import { useSearchContext } from "@/providers/SearchProvider";
import type { SearchableItem } from "@/types/search";

// Result limits per type
const MAX_COFFEE_RESULTS = 8;
const MAX_ROASTER_RESULTS = 5;

export function SearchCommand() {
  const router = useRouter();
  const {
    isOpen,
    query,
    results,
    isLoading,
    isReady,
    error,
    open,
    close,
    setQuery,
    ratingIntent,
  } = useSearchContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectItem = (item: SearchableItem) => {
    close();
    // If rating intent is active and item is a coffee, append ?rate=true
    const url =
      ratingIntent && item.type === "coffee"
        ? `${item.url}?rate=true`
        : item.url;
    router.push(url);
  };

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure dialog is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Group results by type and limit
  // Fuse.js results are already sorted by relevance - preserve that order
  const coffeeResults = results
    .filter((r) => r.type === "coffee")
    .slice(0, MAX_COFFEE_RESULTS);
  const roasterResults = results
    .filter((r) => r.type === "roaster")
    .slice(0, MAX_ROASTER_RESULTS);

  const hasResults = coffeeResults.length > 0 || roasterResults.length > 0;
  const showReadyState = !error && isReady;

  return (
    <CommandDialog
      className="max-w-2xl"
      description="Search for coffees and roasters"
      onOpenChange={(isDialogOpen) => {
        // Sync dialog state with our internal state
        if (isDialogOpen !== isOpen) {
          if (isDialogOpen) {
            open();
          } else {
            close();
          }
        }
      }}
      open={isOpen}
      shouldFilter={false}
      title="Search"
    >
      <CommandInput
        onValueChange={setQuery}
        placeholder="Search coffees and roasters..."
        ref={inputRef}
        value={query}
      />

      <CommandList className="min-h-[340px]">
        {isLoading && (
          <div className="flex flex-col gap-3 p-6">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <div className="font-medium text-body text-destructive">
              {error}
            </div>
            <Button onClick={close} size="sm" variant="outline">
              Close
            </Button>
          </div>
        )}

        {showReadyState && !hasResults && query && !isLoading && (
          <CommandEmpty className="py-12 text-body-muted">
            No results found for &quot;{query}&quot;
          </CommandEmpty>
        )}

        {showReadyState && !query && (
          <CommandEmpty className="py-12 text-body-muted">
            Start typing to search for coffees and roasters...
          </CommandEmpty>
        )}

        {showReadyState && hasResults && (
          <>
            {coffeeResults.length > 0 && (
              <CommandGroup heading="Coffees">
                {coffeeResults.map((item) => (
                  <SearchResultItem
                    item={item}
                    key={item.id}
                    onSelect={handleSelectItem}
                  />
                ))}
              </CommandGroup>
            )}

            {roasterResults.length > 0 && (
              <CommandGroup heading="Roasters">
                {roasterResults.map((item) => (
                  <SearchResultItem
                    item={item}
                    key={item.id}
                    onSelect={handleSelectItem}
                  />
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

type SearchResultItemProps = {
  item: SearchableItem;
  onSelect: (item: SearchableItem) => void;
};

function SearchResultItem({ item, onSelect }: SearchResultItemProps) {
  return (
    <CommandItem
      className="flex items-center gap-4 px-4 py-3 transition-colors"
      onSelect={() => onSelect(item)}
      value={`${item.type}-${item.id}`}
    >
      <SearchResultRow item={item} />
    </CommandItem>
  );
}
