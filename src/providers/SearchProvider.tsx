"use client";

import { createContext, useContext } from "react";
import { useSearch } from "@/hooks/use-search";

type SearchContextType = ReturnType<typeof useSearch> & {
  openSearch: (query?: string) => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const search = useSearch();

  const openSearch = (query?: string) => {
    search.open();
    if (query) {
      // Small delay to ensure modal is open before setting query
      setTimeout(() => {
        search.setQuery(query);
      }, 100);
    }
  };

  const value: SearchContextType = {
    ...search,
    openSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}
