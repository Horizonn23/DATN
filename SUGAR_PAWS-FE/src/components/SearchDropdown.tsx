"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { FiSearch } from "react-icons/fi";
import { useImageSrc } from "@/hooks/useImageSrc";

// Component để hiển thị loading
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-6">
    <div className="flex items-center space-x-3">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-custom-rose border-t-transparent"></div>
      <span className="text-sm text-gray-600">Searching...</span>
    </div>
  </div>
);

// Component để xử lý image với protocol-relative URL
const SearchResultImage: React.FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => {
  const imageSrc = useImageSrc(src);
  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="48px"
      className="object-cover product-image"
    />
  );
};

interface SearchDropdownProps {
  searchResults: Product[];
  totalProducts: number;
  isVisible: boolean;
  searchQuery: string;
  isLoading: boolean;
  onClose: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  searchResults,
  totalProducts,
  isVisible,
  searchQuery,
  isLoading,
  onClose,
}) => {
  if (!isVisible || !searchQuery.trim()) return null;

  return (
    <div
      className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-[60] max-h-96 overflow-y-auto transform transition-all duration-300 ease-in-out mt-1 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-2 scale-95"
      }`}
      style={{ minWidth: "320px" }}
    >
      {isLoading && searchQuery.trim().length > 0 ? (
        <LoadingSpinner />
      ) : searchResults.length > 0 ? (
        <>
          <div className="p-3 border-b border-gray-100 text-sm text-gray-600">
            Found {totalProducts} product
            {totalProducts > 1 ? "s" : ""} for &ldquo;{searchQuery}
            &rdquo;
          </div>
          <div className="divide-y divide-gray-100">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/collections/${product.id}`}
                onClick={onClose}
                className="flex items-center p-3 hover:bg-gray-50 transition-colors duration-200 search-result-item"
              >
                <div className="relative w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {product.displayImage && product.displayImage[0] && (
                    <SearchResultImage
                      src={product.displayImage[0]}
                      alt={product.name}
                    />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center mt-1">
                    <span className="text-sm font-medium text-custom-rose">
                      ${product.minPrice}
                      {product.maxPrice > product.minPrice && (
                        <span className="text-gray-500">
                          - ${product.maxPrice}
                        </span>
                      )}
                    </span>
                    {product.discount && (
                      <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                  {product.vendor && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      by {product.vendor}
                    </p>
                  )}
                </div>
                <div className="ml-3 flex items-center text-xs text-gray-400">
                  {product.rating && (
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{product.rating}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {totalProducts > searchResults.length && (
            <div className="p-3 border-t border-gray-100 text-center bg-gray-50">
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery)}`}
                onClick={onClose}
                className="inline-flex items-center text-sm text-custom-rose hover:text-custom-rose/80 font-medium transition-colors"
              >
                <FiSearch className="h-4 w-4 mr-2" />
                View all {totalProducts} results
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="p-6 text-center">
          <FiSearch className="mx-auto text-gray-400 text-2xl mb-2" />
          <p className="text-sm text-gray-500">
            No products found for &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try different keywords or check your spelling
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
