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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchResultRow } from "@/components/search/SearchResultRow";
import { useSearchContext } from "@/providers/SearchProvider";
import type { SearchableItem } from "@/types/search";
import { cn } from "@/lib/utils";

const MAX_RESULTS = 5;

export function HeroSearch() {
  const router = useRouter();
  const searchContext = useSearchContext();
  const { openSearch, results, isReady, isLoading, setQuery } = searchContext;
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
  const queryActive = debouncedQuery.length >= 2;
  const hasResults = displayedResults.length > 0 && queryActive;
  const showNoResults = queryActive && !isLoading && results.length === 0;
  const showPanel = showResults && (hasResults || showNoResults);

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
      // First Escape dismisses the dropdown but keeps the query; a second clears it.
      if (showResults) {
        setShowResults(false);
      } else {
        setSearchQuery("");
        inputRef.current?.blur();
      }
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

  // Single source of truth for the popup's open state (matches the rendered panel,
  // including the "No matches" state) so aria-expanded stays accurate.
  const listExpanded = showPanel;
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
            className="h-12 w-full rounded-xl bg-white/5 border-white/10 py-3 pr-32 pl-12 text-white transition-all duration-300 placeholder:text-white/70 focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-0"
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
                "rounded-lg h-9 bg-accent hover:bg-accent/90 text-accent-foreground border-0",
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

          {showPanel && (
            <div
              className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
              ref={resultsRef}
            >
              {hasResults ? (
                <>
                  <div
                    aria-label="Search results"
                    className="max-h-[min(60vh,360px)] overflow-y-auto p-2"
                    id={listboxId}
                    role="listbox"
                  >
                    {displayedResults.map((item, index) => (
                      <button
                        aria-selected={index === selectedIndex}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                          index === selectedIndex
                            ? "bg-accent/10"
                            : "hover:bg-muted/60"
                        )}
                        id={`${baseId}-option-${index}`}
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleResultClick(item)}
                        role="option"
                        type="button"
                      >
                        <SearchResultRow compact item={item} />
                      </button>
                    ))}
                  </div>
                  {results.length > MAX_RESULTS && (
                    <div className="border-border/60 border-t p-2">
                      <button
                        aria-label={`View all ${results.length} search results`}
                        className="w-full rounded-lg bg-muted/60 px-3 py-2 text-center font-medium text-caption text-foreground transition-colors hover:bg-muted"
                        onClick={handleSearch}
                        type="button"
                      >
                        View all {results.length} results →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="px-4 py-6 text-center" id={listboxId}>
                  <p className="text-caption text-muted-foreground">
                    No matches for &ldquo;{debouncedQuery}&rdquo;
                  </p>
                  <button
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-2 font-medium text-caption text-foreground transition-colors hover:bg-muted"
                    onClick={handleSearch}
                    type="button"
                  >
                    Search everything →
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
