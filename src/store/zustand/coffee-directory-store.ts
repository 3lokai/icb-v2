import { create } from "zustand";
import type { CoffeeFilters, CoffeeSort } from "@/types/coffee-types";

/**
 * Coffee Directory State
 * Pure state management - no URL/router dependencies
 */
interface CoffeeDirectoryState {
  filters: CoffeeFilters;
  page: number;
  sort: CoffeeSort;
  limit: number;

  // Actions
  setAll: (state: {
    filters: CoffeeFilters;
    page: number;
    sort: CoffeeSort;
    limit: number;
  }) => void;
  setFilters: (
    filters: CoffeeFilters | ((prev: CoffeeFilters) => CoffeeFilters)
  ) => void;
  setPage: (page: number) => void;
  setSort: (sort: CoffeeSort) => void;
  resetFilters: () => void;
  updateFilters: (partial: Partial<CoffeeFilters>) => void;
}

const DEFAULT_FILTERS: CoffeeFilters = {};
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 24;
const DEFAULT_SORT: CoffeeSort = "relevance";

export const useCoffeeDirectoryStore = create<CoffeeDirectoryState>((set) => ({
  // Initial state
  filters: DEFAULT_FILTERS,
  page: DEFAULT_PAGE,
  sort: DEFAULT_SORT,
  limit: DEFAULT_LIMIT,

  // Actions
  setAll: (state) => set(state),

  setFilters: (filters) =>
    set((state) => ({
      filters: typeof filters === "function" ? filters(state.filters) : filters,
    })),

  setPage: (page) => set({ page }),

  setSort: (sort) => set({ sort }),

  resetFilters: () =>
    set({
      filters: DEFAULT_FILTERS,
      page: DEFAULT_PAGE,
    }),

  updateFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
      page: DEFAULT_PAGE, // Reset to page 1 when filters change
    })),
}));
