// hooks/queries/useProductSearch.ts
import { useState, useCallback } from "react";
import { useSearchProducts } from "./useProducts";
import { Product } from "@/types/product";

export interface UseProductSearchResult {
  searchTerm: string;
  searchResults: Product[];
  isSearching: boolean;
  searchError: string | null;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  setSearchTerm: (term: string) => void;
  performSearch: (term: string, page?: number) => void;
  clearSearch: () => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export function useProductSearch(
  itemsPerPage: number = 20,
): UseProductSearchResult {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { searchProducts } = useSearchProducts({
    searchTerm,
    page: currentPage,
    itemPerPage: itemsPerPage,
  });

  const { data, isLoading, error } = searchProducts;

  const performSearch = useCallback((term: string, page: number = 1) => {
    setSearchTerm(term);
    setCurrentPage(page);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const nextPage = useCallback(() => {
    if (data?.totalProducts) {
      const totalPages = Math.ceil(data.totalProducts / itemsPerPage);
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  }, [currentPage, data?.totalProducts, itemsPerPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (data?.totalProducts) {
        const totalPages = Math.ceil(data.totalProducts / itemsPerPage);
        if (page >= 1 && page <= totalPages) {
          setCurrentPage(page);
        }
      }
    },
    [data?.totalProducts, itemsPerPage]
  );

  const totalPages = data?.totalProducts
    ? Math.ceil(data.totalProducts / itemsPerPage)
    : 0;

  return {
    searchTerm,
    searchResults: data?.products || [],
    isSearching: isLoading,
    searchError: error?.message || null,
    totalResults: data?.totalProducts || 0,
    currentPage,
    totalPages,
    setSearchTerm,
    performSearch,
    clearSearch,
    nextPage,
    prevPage,
    goToPage,
  };
}
