"use client";

import { useCallback, useEffect, useState } from "react";
import {
  SEARCH_MIN_CHARS,
  useSearchDirectory,
} from "@/hooks/use-search-directory";
import type { SearchableItem } from "@/types/search";

type SearchState = {
  isOpen: boolean;
  query: string;
  results: SearchableItem[];
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

const DEBOUNCE_MS = 250;

export function useSearch(
  options: { enableShortcut?: boolean } = { enableShortcut: true }
) {
  const { enableShortcut = true } = options;
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQueryState] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce the input before hitting the server. Clears (< min chars) also run
  // through the timer so we never call setState synchronously in the effect.
  useEffect(() => {
    const trimmed = query.trim();
    const next = trimmed.length >= SEARCH_MIN_CHARS ? trimmed : "";
    const timer = setTimeout(() => setDebouncedQuery(next), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const {
    data,
    isFetching,
    error: queryError,
  } = useSearchDirectory(debouncedQuery);

  const hasActiveQuery = debouncedQuery.length >= SEARCH_MIN_CHARS;
  const results = hasActiveQuery ? (data ?? []) : [];

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQueryState("");
    setDebouncedQuery("");
  }, []);

  const setQuery = useCallback((next: string) => setQueryState(next), []);

  // Keyboard shortcut: Cmd+K / Ctrl+K to open
  useEffect(() => {
    if (!enableShortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        (e.key === "k" || e.key === "K") &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        e.stopPropagation();
        open();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [open, enableShortcut]);

  const state: SearchState = {
    isOpen,
    query,
    results,
    // Only show the skeleton on the first load (nothing to display yet).
    // keepPreviousData keeps prior results visible on later keystrokes.
    isLoading: hasActiveQuery && isFetching && results.length === 0,
    isReady: true, // no index to preload anymore; search is always ready
    error: queryError
      ? "Search is temporarily unavailable. Try again later."
      : null,
  };

  return {
    ...state,
    open,
    close,
    setQuery,
  };
}
