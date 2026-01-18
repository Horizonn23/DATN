// app/(root)/(shop)/search/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSearchProducts } from "@/hooks/queries/useProducts";
import ProductCard from "@/components/product/ProductCard";
import DefaultLoading from "@/components/loading/DefaultLoading";
import Pagination from "@/components/ui/Pagination";
import { FiSearch, FiFilter } from "react-icons/fi";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams?.get("q") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(query);
  const itemPerPage = 20;

  const { searchProducts } = useSearchProducts({
    searchTerm: query,
    page: currentPage,
    itemPerPage,
  });

  const { data: searchData, isLoading, error } = searchProducts;
  useEffect(() => {
    setSearchTerm(query);
    setCurrentPage(1); // Reset page when search query changes
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = searchData?.totalProducts
    ? Math.ceil(searchData.totalProducts / itemPerPage)
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 md:px-[10%] lg:px-[15%] py-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-2xl">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={query}
                    disabled
                    placeholder="Search for products..."
                    className="block w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-300 rounded-full bg-gray-100 opacity-75"
                  />
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                    <div className="bg-gray-400 text-white px-6 py-3 rounded-full font-medium">
                      Search
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <DefaultLoading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 md:px-[10%] lg:px-[15%] py-8">
        {/* Search Header - Centered */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  aria-label="Search for products"
                  className="block w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-300 rounded-full focus:ring-2 focus:ring-custom-rose focus:border-custom-rose transition-all duration-200 shadow-lg"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  aria-label="Search"
                >
                  <div className="bg-custom-rose text-white px-6 py-3 rounded-full hover:bg-custom-rose/90 transition-colors font-medium">
                    Search
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Filter Section */}
        {query && searchData?.products && searchData.products.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemPerPage + 1}-
              {Math.min(currentPage * itemPerPage, searchData.totalProducts)} of{" "}
              {searchData.totalProducts} results
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              <FiFilter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 md:px-[10%] lg:px-[15%]">
        {error ? (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <FiSearch className="h-12 w-12 mx-auto mb-4 opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Search Error
              </h3>
              <p className="text-gray-600">
                Something went wrong while searching. Please try again.
              </p>
            </div>
          </div>
        ) : !query ? (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border max-w-md mx-auto">
              <FiSearch className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Search for Products
              </h3>
              <p className="text-gray-600">
                Enter a search term to find products in our store.
              </p>
            </div>
          </div>
        ) : searchData?.products && searchData.products.length > 0 ? (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {searchData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white p-8 rounded-lg shadow-sm border max-w-lg mx-auto">
              <FiSearch className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn&apos;t find any products matching &quot;{query}&quot;.
              </p>
              <div className="text-sm text-gray-500">
                <p className="font-medium mb-2">Try:</p>
                <ul className="list-disc list-inside space-y-1 text-left max-w-xs mx-auto">
                  <li>Checking your spelling</li>
                  <li>Using different keywords</li>
                  <li>Using more general terms</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
