"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
} from "react";
import { useSearch } from "@/hooks/use-search";

type SearchContextType = ReturnType<typeof useSearch> & {
  openSearch: (query?: string, ratingIntent?: boolean) => void;
  ratingIntent: boolean;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const search = useSearch();
  const [ratingIntent, setRatingIntent] = useState(false);

  const openSearch = (query?: string, ratingIntentMode = false) => {
    setRatingIntent(ratingIntentMode);
    search.open();
    if (query) {
      // Small delay to ensure modal is open before setting query
      setTimeout(() => {
        search.setQuery(query);
      }, 100);
    }
  };

  // Reset rating intent when search closes
  useEffect(() => {
    if (!search.isOpen) {
      // Use startTransition to mark as non-urgent update
      startTransition(() => {
        setRatingIntent(false);
      });
    }
  }, [search.isOpen]);

  const value: SearchContextType = {
    ...search,
    openSearch,
    ratingIntent,
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
