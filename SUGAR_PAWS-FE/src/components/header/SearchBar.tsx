"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";
import SearchDropdown from "../SearchDropdown";
import { useSearchDropdown } from "@/hooks/useSearchDropdown";
import "@/styles/Search.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchBarProps {
  // No longer need sampleProducts as we're using API
}

const SearchBar: React.FC<SearchBarProps> = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    searchQuery,
    searchResults,
    totalProducts,
    isSearching,
    setSearchQuery,
    clearSearch,
  } = useSearchDropdown();
  const router = useRouter();

  const handleSearchIconClick = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus on input when opening search
      setTimeout(() => {
        const searchInput = document.getElementById("search-input");
        if (searchInput) {
          searchInput.focus();
        }
      }, 300);
    } else {
      // Clear search when closing
      clearSearch();
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
    clearSearch();
  }, [clearSearch]);

  // Handle search outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isSearchOpen &&
        !target.closest(".search-container") &&
        !target.closest(".search-icon")
      ) {
        handleSearchClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen, handleSearchClose]);

  // Handle keyboard events for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        handleSearchClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, handleSearchClose]);

  return (
    <div className="flex items-center mr-5 relative search-container">
      <div
        className={`flex items-center search-input-container transition-all duration-300 ease-in-out ${
          isSearchOpen
            ? "w-64 bg-white/95 backdrop-blur-md rounded-full border border-gray-300 shadow-lg expanded"
            : "w-auto"
        }`}
      >
        <FiSearch
          size={20}
          className={`hover:text-custom-rose cursor-pointer search-icon transition-all duration-300 ${
            isSearchOpen
              ? "ml-3 text-gray-600"
              : "search-icon-pulse hover:scale-110"
          }`}
          onClick={handleSearchIconClick}
        />
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          placeholder="Search products..."
          className={`transition-all duration-300 ease-in-out bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500 ${
            isSearchOpen
              ? "w-48 ml-2 mr-3 py-2 opacity-100"
              : "w-0 opacity-0 pointer-events-none"
          }`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
              handleSearchClose();
            }
          }}
        />
        {isSearchOpen && searchQuery && (
          <button
            onClick={() => {
              clearSearch();
            }}
            className="mr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            ×
          </button>
        )}
      </div>

      <SearchDropdown
        searchResults={searchResults}
        totalProducts={totalProducts}
        isVisible={isSearchOpen && searchQuery.trim().length > 0}
        searchQuery={searchQuery}
        isLoading={isSearching}
        onClose={handleSearchClose}
      />
    </div>
  );
};

export default SearchBar;
