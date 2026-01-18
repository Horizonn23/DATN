import { useState, useEffect, useCallback } from "react";
import { useSearchProducts } from "./queries/useProducts";
import { Product } from "@/types/product";

interface UseSearchDropdownResult {
  searchQuery: string;
  searchResults: Product[];
  totalProducts: number;
  isSearching: boolean;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
}

export function useSearchDropdown(): UseSearchDropdownResult {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // Use search API
  const { searchProducts } = useSearchProducts({
    searchTerm: debouncedSearchQuery,
    page: 1,
    itemPerPage: 5, // Limit results for dropdown
  });

  const { data, isLoading } = searchProducts;

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedSearchQuery("");
  }, []);

  return {
    searchQuery,
    searchResults: data?.products || [],
    totalProducts: data?.totalProducts || 0,
    isSearching: isLoading,
    setSearchQuery,
    clearSearch,
  };
}
