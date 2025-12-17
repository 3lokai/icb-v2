"use client";

import type Fuse from "fuse.js";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SearchableItem } from "@/types/search";

type SearchState = {
  isOpen: boolean;
  query: string;
  results: SearchableItem[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

const FUSE_CONFIG = {
  keys: [
    { name: "title", weight: 0.4 },
    { name: "searchableText", weight: 0.3 },
    { name: "description", weight: 0.2 },
    { name: "tags", weight: 0.1 },
  ],
  threshold: 0.3, // Lower = more strict matching (0.0 = exact, 1.0 = match anything)
  includeScore: true,
  minMatchCharLength: 2,
  shouldSort: true, // Sort results by score (already default, but explicit)
  ignoreLocation: false, // Consider location of match in string
  ignoreDiacritics: true, // Ignore accents/diacritics for better matching
  findAllMatches: false, // Only find first match per key (faster)
};

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    isOpen: false,
    query: "",
    results: [],
    isLoading: false,
    isReady: false,
    error: null,
  });

  const fuseRef = useRef<Fuse<SearchableItem> | null>(null);
  const indexDataRef = useRef<SearchableItem[]>([]);
  const fuseModuleRef = useRef<typeof Fuse | null>(null);
  const lastSearchedQueryRef = useRef<string>("");

  // Lazy load Fuse.js and fetch index
  const ensureIndexLoaded = useCallback(async () => {
    const isAlreadyReady = state.isReady && fuseRef.current;
    if (isAlreadyReady) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Lazy load Fuse.js
      if (!fuseModuleRef.current) {
        const fuseModule = await import("fuse.js");
        fuseModuleRef.current = fuseModule.default;
      }

      // Fetch search index
      const response = await fetch("/api/search-index");
      if (!response.ok) {
        let errorMessage = "Failed to fetch search index";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response isn't JSON, use status text
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const items: SearchableItem[] = await response.json();
      indexDataRef.current = items;

      // Initialize Fuse
      if (fuseModuleRef.current) {
        fuseRef.current = new fuseModuleRef.current(items, FUSE_CONFIG);
      }

      setState((prev) => ({
        ...prev,
        isReady: true,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to load search index:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isReady: false,
        error: "Search is temporarily unavailable. Try again later.",
      }));
    }
  }, [state.isReady]);

  // Open search modal
  const open = useCallback(() => {
    console.log("[useSearch] open() called");
    setState((prev) => {
      console.log("[useSearch] Setting isOpen to true, previous:", prev.isOpen);
      return { ...prev, isOpen: true };
    });
    ensureIndexLoaded();
  }, [ensureIndexLoaded]);

  // Close search modal
  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      query: "",
      results: [],
      error: null,
    }));
  }, []);

  // Set query and run search
  const setQuery = useCallback((query: string) => {
    setState((prev) => {
      const newState = { ...prev, query };
      // If index is ready, run search immediately
      if (fuseRef.current && prev.isReady && query.trim()) {
        const fuseResults = fuseRef.current.search(query.trim());
        newState.results = fuseResults.map((result) => result.item);
        lastSearchedQueryRef.current = query.trim();
      } else if (!query.trim()) {
        newState.results = [];
        lastSearchedQueryRef.current = "";
      }
      // Note: If index isn't ready yet, we don't update lastSearchedQueryRef
      // so the useEffect can catch it when ready
      return newState;
    });
  }, []);

  // Run search when index becomes ready and there's already a query that hasn't been searched yet
  useEffect(() => {
    if (
      state.isReady &&
      fuseRef.current &&
      state.query.trim() &&
      lastSearchedQueryRef.current !== state.query.trim()
    ) {
      const fuseResults = fuseRef.current.search(state.query.trim());
      const results = fuseResults.map((result) => result.item);
      lastSearchedQueryRef.current = state.query.trim();
      setState((prev) => ({ ...prev, results }));
    }
  }, [state.isReady, state.query]);

  // Keyboard shortcut: Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        open();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return {
    ...state,
    open,
    close,
    setQuery,
  };
}
