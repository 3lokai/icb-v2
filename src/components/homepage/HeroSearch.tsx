"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  startTransition,
  useRef,
  useState,
} from "react";
import { Icon } from "@/components/common/Icon";
import { Cluster } from "@/components/primitives/cluster";
import { Stack } from "@/components/primitives/stack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchContext } from "@/providers/SearchProvider";
import type { SearchableItem } from "@/types/search";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";

const MAX_RESULTS = 5;

export function HeroSearch() {
  const router = useRouter();
  const searchContext = useSearchContext();
  const { openSearch, results, isReady, setQuery } = searchContext;
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery.trim() && isReady) {
      debounceTimerRef.current = setTimeout(() => {
        setQuery(searchQuery.trim());
        setShowResults(true);
        setSelectedIndex(-1);
      }, 300);
    } else {
      startTransition(() => {
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

  // Filter and limit results
  const displayedResults = results.slice(0, MAX_RESULTS);
  const hasResults =
    displayedResults.length > 0 && searchQuery.trim().length >= 2;

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      // If there are results and one is selected, navigate to it
      if (selectedIndex >= 0 && displayedResults[selectedIndex]) {
        router.push(displayedResults[selectedIndex].url);
        setSearchQuery("");
        setShowResults(false);
        inputRef.current?.blur();
        return;
      }
      // Otherwise open search modal with the query pre-filled
      openSearch(searchQuery.trim());
      setSearchQuery("");
      setShowResults(false);
      inputRef.current?.blur();
    } else {
      // If no query, just open the search modal
      openSearch();
    }
  }, [searchQuery, selectedIndex, displayedResults, router, openSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
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

  return (
    <div className="mx-auto max-w-2xl animate-fade-in-scale delay-300">
      <Stack gap="6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center">
            <Icon className="text-white/90" name="MagnifyingGlass" size={20} />
          </div>
          <Input
            className="h-12 w-full rounded-xl bg-black/25 border-white/20 py-3 pr-32 pl-12 text-white transition-all duration-300 placeholder:text-white/60 focus:border-white/50 focus:bg-black/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (hasResults) {
                setShowResults(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Which coffee do you want to try next?"
            ref={inputRef}
            type="text"
            value={searchQuery}
          />
          {/* Button container with fixed width */}
          <div className="-translate-y-1/2 absolute top-1/2 right-2 flex min-w-[120px] items-center justify-end gap-1">
            {searchQuery && (
              <Button
                aria-label="Clear search"
                className="h-8 w-8 rounded-lg text-white/70 transition-all duration-300 hover:bg-black/30 hover:text-white"
                onClick={() => {
                  setSearchQuery("");
                  setShowResults(false);
                }}
                size="icon"
                variant="ghost"
              >
                <Icon name="XCircle" size={16} />
              </Button>
            )}
            <Button
              className="rounded-lg h-9"
              disabled={!searchQuery.trim()}
              onClick={handleSearch}
              size="sm"
              variant="default"
            >
              Search
            </Button>
          </div>

          {/* Search Results Dropdown */}
          {showResults && hasResults && (
            <div
              className="absolute top-full z-50 mt-2 max-h-[400px] w-full overflow-y-auto rounded-xl on-media-scrim-strong text-white shadow-xl"
              ref={resultsRef}
            >
              <div className="p-2">
                {displayedResults.map((item, index) => (
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all border",
                      index === selectedIndex
                        ? "bg-white/10 text-white border-white/20"
                        : "border-transparent text-white/90 hover:border-white/10 hover:bg-white/5"
                    )}
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleResultClick(item)}
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
                {results.length > MAX_RESULTS && (
                  <button
                    className="mt-2 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-center text-white text-caption transition-colors hover:bg-white/15"
                    onClick={handleSearch}
                    type="button"
                  >
                    View all {results.length} results →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Popular searches */}
        <Cluster gap="3" align="center" className="justify-center">
          <span className="text-micro font-bold uppercase tracking-widest text-white/60">
            Trending:
          </span>
          {[
            "Monsooned Malabar",
            "Chikmagalur",
            "Natural Process",
            "Blue Tokai",
          ].map((term) => (
            <Button
              key={term}
              onClick={() => openSearch(term)}
              size="sm"
              variant="chip"
              className="bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/20"
            >
              <span className="flex items-center gap-1.5">
                {term}
                <Icon
                  className="opacity-40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  name="ArrowRight"
                  size={12}
                />
              </span>
            </Button>
          ))}
        </Cluster>
      </Stack>
    </div>
  );
}
