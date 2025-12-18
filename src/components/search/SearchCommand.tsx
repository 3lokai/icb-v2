"use client";

import { Icon } from "@/components/common/Icon";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  } = useSearchContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelectItem = (item: SearchableItem) => {
    close();
    router.push(item.url);
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
  const showLoadingState = !(error || isLoading || isReady);
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

      <CommandList>
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

        {showLoadingState && (
          <CommandEmpty className="py-12 text-body-muted">
            Loading search index...
          </CommandEmpty>
        )}

        {showReadyState && !hasResults && query && (
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
  const displayTags = item.tags.slice(0, 3); // Show max 3 tags
  const hasMoreTags = item.tags.length > 3;

  return (
    <CommandItem
      className="flex items-center gap-4 px-4 py-3 transition-colors"
      onSelect={() => onSelect(item)}
      value={`${item.type}-${item.id}`}
    >
      <Avatar className="size-12 shrink-0 border border-border/50">
        {item.imageUrl ? (
          <AvatarImage alt={item.title} src={item.imageUrl} />
        ) : null}
        <AvatarFallback className="bg-muted/80 text-popover-foreground">
          {item.type === "coffee" ? (
            <Icon className="size-6" name="Coffee" size={24} />
          ) : (
            <Icon className="size-6" name="Storefront" size={24} />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="font-medium text-body text-popover-foreground leading-snug">
          {item.title}
        </div>
        {item.description && (
          <div className="line-clamp-1 text-caption text-muted-foreground">
            {item.description}
          </div>
        )}
        {(displayTags.length > 0 || item.flavorNotes) && (
          <div className="flex flex-wrap gap-1.5">
            {item.flavorNotes?.slice(0, 2).map((note) => (
              <Badge
                className="font-medium text-xs"
                key={note}
                variant="secondary"
              >
                {note}
              </Badge>
            ))}
            {displayTags.map((tag) => (
              <Badge
                className="font-medium text-xs"
                key={tag}
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
            {hasMoreTags && (
              <Badge className="font-medium text-xs" variant="outline">
                +{item.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>

      {item.metadata.coffee?.rating && (
        <div className="shrink-0 font-medium text-caption text-muted-foreground">
          ⭐ {item.metadata.coffee.rating.toFixed(1)}
        </div>
      )}

      {item.metadata.roaster?.coffeeCount && (
        <div className="shrink-0 font-medium text-caption text-muted-foreground">
          {item.metadata.roaster.coffeeCount} coffees
        </div>
      )}
    </CommandItem>
  );
}
