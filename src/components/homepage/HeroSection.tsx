// src/components/home/HeroSection.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/common/Icon";
import {
  Announcement,
  AnnouncementShinyText,
  AnnouncementTitle,
} from "@/components/ui/announcement";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchContext } from "@/providers/SearchProvider";
import type { SearchableItem } from "@/types/search";
import { Input } from "../ui/input";

const MAX_RESULTS = 5;

export default function HeroSection() {
  const router = useRouter();
  const searchContext = useSearchContext();
  const { openSearch, results, isReady, setQuery } = searchContext;
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      setShowResults(false);
      setQuery("");
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

  // Ensure video plays
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        // Autoplay was prevented, try again after user interaction
        console.warn("Video autoplay prevented:", error);
      }
    };

    // Try to play immediately
    playVideo();

    // Also try to play when video can play through
    video.addEventListener("canplaythrough", playVideo);

    return () => {
      video.removeEventListener("canplaythrough", playVideo);
    };
  }, []);

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
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
          ref={videoRef}
          src="/videos/hero-bg.mp4"
        />
      </div>

      {/* Enhanced overlay with glassmorphism guide principles */}
      <div className="hero-overlay" />

      {/* Main content container */}
      <div className="hero-content">
        {/* Hero badge */}
        <div className="mb-8 inline-flex animate-fade-in-scale items-center">
          <Announcement
            className="border-white/20 bg-white/10 backdrop-blur-sm"
            variant="outline"
          >
            <AnnouncementTitle className="gap-2">
              <Icon className="text-accent" name="MapPin" size={16} />
              <AnnouncementShinyText className="text-white/90">
                India&apos;s First Coffee Directory
              </AnnouncementShinyText>
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            </AnnouncementTitle>
          </Announcement>
        </div>

        {/* Main heading */}
        <div className="mb-8 animate-fade-in-scale delay-100">
          <h1 className="mb-6 text-display text-white leading-tight">
            Discover India&apos;s Finest Coffee Beans
          </h1>
          <p className="mx-auto max-w-3xl text-white/90 text-xl leading-relaxed">
            Explore exceptional Indian specialty coffee beans, roasters, and the
            stories behind each perfect cup.
          </p>
        </div>

        {/* FIXED: Simple search bar with proper spacing */}
        <div className="mx-auto mb-8 max-w-2xl animate-fade-in-scale delay-300">
          <div className="relative mb-6">
            <div className="pointer-events-none absolute inset-y-0 left-4 z-10 flex items-center">
              <Icon
                className="text-white/90"
                name="MagnifyingGlass"
                size={20}
              />
            </div>
            <Input
              className="h-12 w-full rounded-xl border border-white/30 bg-white/15 py-3 pr-32 pl-12 text-white backdrop-blur-sm transition-all duration-300 placeholder:text-white/60 focus:border-white/50 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50"
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (hasResults) {
                  setShowResults(true);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search for coffee, roasters, or regions..."
              ref={inputRef}
              type="text"
              value={searchQuery}
            />
            {/* FIXED: Proper button positioning with adequate spacing */}
            <div className="-translate-y-1/2 absolute top-1/2 right-2 flex items-center gap-1">
              {searchQuery && (
                <Button
                  className="h-8 w-8 rounded-lg text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white"
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
                className="rounded-lg bg-primary/90 px-4 py-1.5 text-primary-foreground transition-all duration-300 hover:bg-primary"
                disabled={!searchQuery.trim()}
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>

            {/* Search Results Dropdown */}
            {showResults && hasResults && (
              <div
                className="absolute top-full z-50 mt-2 max-h-[400px] w-full overflow-y-auto rounded-xl border border-border bg-popover shadow-xl backdrop-blur-md"
                ref={resultsRef}
              >
                <div className="p-2">
                  {displayedResults.map((item, index) => (
                    <button
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        index === selectedIndex
                          ? "bg-accent/80 text-accent-foreground"
                          : "text-popover-foreground hover:bg-accent/50"
                      }`}
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
                        <div className="font-medium text-popover-foreground text-sm">
                          {item.title}
                        </div>
                        <div className="line-clamp-1 text-muted-foreground text-xs">
                          {item.description}
                        </div>
                        {(item.tags.length > 0 || item.flavorNotes) && (
                          <div className="flex flex-wrap gap-1">
                            {item.flavorNotes?.slice(0, 2).map((note) => (
                              <Badge
                                className="text-xs"
                                key={note}
                                variant="secondary"
                              >
                                {note}
                              </Badge>
                            ))}
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge
                                className="text-xs"
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
                        <div className="shrink-0 text-muted-foreground text-xs">
                          ⭐ {item.metadata.coffee.rating.toFixed(1)}
                        </div>
                      )}

                      {item.metadata.roaster?.coffeeCount && (
                        <div className="shrink-0 text-muted-foreground text-xs">
                          {item.metadata.roaster.coffeeCount} coffees
                        </div>
                      )}
                    </button>
                  ))}
                  {results.length > MAX_RESULTS && (
                    <button
                      className="mt-2 w-full rounded-lg border border-border bg-accent/50 px-3 py-2 text-center text-popover-foreground text-sm transition-colors hover:bg-accent/70"
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

          {/* Popular searches - with proper spacing */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="font-medium text-sm text-white/70">Popular:</span>
            {[
              "Monsooned Malabar",
              "Chikmagalur",
              "Natural Process",
              "Blue Tokai",
            ].map((term) => (
              <button
                className="group rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white/15 hover:text-white"
                key={term}
                onClick={() => {
                  openSearch(term);
                }}
                type="button"
              >
                <span className="flex items-center gap-1">
                  {term}
                  <Icon
                    className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    name="ArrowRight"
                    size={12}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex animate-fade-in-scale flex-col items-center justify-center gap-4 delay-300 sm:flex-row">
          <Link className="btn-primary hover-lift" href="/coffees">
            <Icon className="mr-2" name="Coffee" size={18} />
            Explore Coffees
          </Link>
          <Link
            className="btn-secondary hover-lift whitespace-nowrap"
            href="/roasters"
          >
            <Icon className="mr-2" name="Storefront" size={18} />
            Meet Roasters
          </Link>
        </div>
      </div>
    </section>
  );
}
