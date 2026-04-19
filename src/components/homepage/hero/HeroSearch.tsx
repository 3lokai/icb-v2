"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  startTransition,
  useId,
  useRef,
  useState,
} from "react";
import { Icon } from "@/components/common/Icon";
import { Stack } from "@/components/primitives/stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchContext } from "@/providers/SearchProvider";
import type { SearchableItem } from "@/types/search";
import { cn } from "@/lib/utils";

const MAX_RESULTS = 5;

export function HeroSearch() {
  const router = useRouter();
  const searchContext = useSearchContext();
  const { openSearch, results, isReady, setQuery } = searchContext;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;

  // Debounced search — only query provider when trimmed length ≥ 2
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const trimmed = searchQuery.trim();

    if (trimmed.length >= 2 && isReady) {
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedQuery(trimmed);
        setQuery(trimmed);
        setShowResults(true);
        setSelectedIndex(-1);
      }, 300);
    } else {
      startTransition(() => {
        setDebouncedQuery("");
        setShowResults(false);
        setQuery("");
      });
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, isReady, setQuery]);

  // Filter and limit results — align dropdown with debounced minimum-length query
  const displayedResults = results.slice(0, MAX_RESULTS);
  const hasResults = displayedResults.length > 0 && debouncedQuery.length >= 2;

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      // If there are results and one is selected, navigate to it
      if (selectedIndex >= 0 && displayedResults[selectedIndex]) {
        router.push(displayedResults[selectedIndex].url);
        setSearchQuery("");
        setDebouncedQuery("");
        setShowResults(false);
        inputRef.current?.blur();
        return;
      }
      // Otherwise open search modal with the query pre-filled
      openSearch(searchQuery.trim());
      setSearchQuery("");
      setDebouncedQuery("");
      setShowResults(false);
      inputRef.current?.blur();
    } else {
      openSearch();
    }
  }, [searchQuery, selectedIndex, displayedResults, router, openSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!hasResults || displayedResults.length === 0) return;
      setSelectedIndex((prev) =>
        prev < displayedResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowResults(false);
      setSearchQuery("");
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (item: SearchableItem) => {
    router.push(item.url);
    setSearchQuery("");
    setDebouncedQuery("");
    setShowResults(false);
    inputRef.current?.blur();
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showResults]);

  const listExpanded = showResults && hasResults;
  const activeOptionId =
    selectedIndex >= 0 ? `${baseId}-option-${selectedIndex}` : undefined;
  const hasQuery = Boolean(searchQuery.trim());

  return (
    <div className="w-full animate-fade-in-scale delay-300">
      <Stack gap="6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center">
            <Icon className="text-white/90" name="MagnifyingGlass" size={20} />
          </div>
          <Input
            aria-activedescendant={activeOptionId}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={listExpanded}
            aria-haspopup="listbox"
            className="h-12 w-full rounded-xl bg-white/5 border-white/10 py-3 pr-32 pl-12 text-white transition-all duration-300 placeholder:text-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-0"
            id={inputId}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              if (hasResults) {
                setShowResults(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search by name, roast, region or flavor"
            ref={inputRef}
            role="combobox"
            type="text"
            value={searchQuery}
          />
          <div className="-translate-y-1/2 absolute top-1/2 right-2 flex min-w-[120px] items-center justify-end gap-1">
            {searchQuery && (
              <Button
                aria-label="Clear search"
                className="h-8 w-8 rounded-lg text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white"
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                size="icon"
                type="button"
                variant="ghost"
              >
                <Icon name="XCircle" size={16} />
              </Button>
            )}
            <Button
              aria-label={hasQuery ? "Search directory" : "Open full search"}
              className={cn(
                "rounded-lg h-9 bg-accent/90 hover:bg-accent text-white border-0",
                !hasQuery && "min-w-9 px-2"
              )}
              onClick={handleSearch}
              size="sm"
              type="button"
            >
              {hasQuery ? (
                "Search"
              ) : (
                <Icon aria-hidden name="MagnifyingGlass" size={18} />
              )}
            </Button>
          </div>

          {showResults && hasResults && (
            <div
              className="absolute top-full z-50 mt-2 max-h-[420px] w-full overflow-y-auto rounded-2xl border border-white/10 bg-black/45 p-2 shadow-2xl backdrop-blur-md"
              ref={resultsRef}
            >
              <div
                aria-label="Search results"
                className="max-h-[320px] overflow-y-auto p-2"
                id={listboxId}
                role="listbox"
              >
                {displayedResults.map((item, index) => (
                  <button
                    aria-selected={index === selectedIndex}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all border",
                      index === selectedIndex
                        ? "bg-white/10 text-white border-white/20"
                        : "border-transparent text-white/90 hover:border-white/10 hover:bg-white/5"
                    )}
                    id={`${baseId}-option-${index}`}
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleResultClick(item)}
                    role="option"
                    type="button"
                  >
                    <Avatar className="size-10 shrink-0">
                      {item.imageUrl ? (
                        <AvatarImage alt={item.title} src={item.imageUrl} />
                      ) : null}
                      <AvatarFallback className="bg-muted text-popover-foreground">
                        {item.type === "coffee" ? (
                          <Icon className="size-5" name="Coffee" />
                        ) : (
                          <Icon className="size-5" name="Storefront" />
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="font-medium text-white text-caption">
                        {item.title}
                      </div>
                      <div className="line-clamp-1 text-muted-foreground text-overline">
                        {item.description}
                      </div>
                      {(item.tags.length > 0 || item.flavorNotes) && (
                        <div className="flex flex-wrap gap-1">
                          {item.flavorNotes?.slice(0, 2).map((note) => (
                            <Badge
                              className="text-overline"
                              key={note}
                              variant="secondary"
                            >
                              {note}
                            </Badge>
                          ))}
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge
                              className="text-overline"
                              key={tag}
                              variant="outline"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {item.metadata.coffee?.rating && (
                      <div className="shrink-0 text-muted-foreground text-overline">
                        ⭐ {item.metadata.coffee.rating.toFixed(1)}
                      </div>
                    )}

                    {item.metadata.roaster?.coffeeCount && (
                      <div className="shrink-0 text-muted-foreground text-overline">
                        {item.metadata.roaster.coffeeCount} coffees
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {results.length > MAX_RESULTS && (
                <div className="border-white/10 border-t p-2 pt-2">
                  <button
                    aria-label={`View all ${results.length} search results`}
                    className="w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-center text-white text-caption transition-colors hover:bg-white/15"
                    onClick={handleSearch}
                    type="button"
                  >
                    View all {results.length} results →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </Stack>
    </div>
  );
}
