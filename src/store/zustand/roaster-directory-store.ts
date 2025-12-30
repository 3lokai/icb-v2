import { create } from "zustand";
import type { RoasterFilters, RoasterSort } from "@/types/roaster-types";

type RoasterDirectoryState = {
  filters: RoasterFilters;
  page: number;
  sort: RoasterSort;
  limit: number;

  setAll: (state: {
    filters: RoasterFilters;
    page: number;
    sort: RoasterSort;
    limit: number;
  }) => void;
  setFilters: (
    filters: RoasterFilters | ((prev: RoasterFilters) => RoasterFilters)
  ) => void;
  setPage: (page: number) => void;
  setSort: (sort: RoasterSort) => void;
  resetFilters: () => void;
  updateFilters: (partial: Partial<RoasterFilters>) => void;
};

const DEFAULT_FILTERS: RoasterFilters = {};
const DEFAULT_PAGE = 1;
const DEFAULT_SORT: RoasterSort = "relevance";
const DEFAULT_LIMIT = 15;

export const useRoasterDirectoryStore = create<RoasterDirectoryState>(
  (set) => ({
    filters: DEFAULT_FILTERS,
    page: DEFAULT_PAGE,
    sort: DEFAULT_SORT,
    limit: DEFAULT_LIMIT,

    setAll: (state) => set(state),
    setFilters: (filters) =>
      set((state) => ({
        filters:
          typeof filters === "function" ? filters(state.filters) : filters,
        page: DEFAULT_PAGE, // Reset page on filter change
      })),
    setPage: (page) => set({ page }),
    setSort: (sort) =>
      set({
        sort,
        page: DEFAULT_PAGE, // Reset page on sort change
      }),
    resetFilters: () =>
      set({
        filters: DEFAULT_FILTERS,
        page: DEFAULT_PAGE,
        sort: DEFAULT_SORT,
      }),
    updateFilters: (partial) =>
      set((state) => ({
        filters: { ...state.filters, ...partial },
        page: DEFAULT_PAGE, // Reset page on filter change
      })),
  })
);
