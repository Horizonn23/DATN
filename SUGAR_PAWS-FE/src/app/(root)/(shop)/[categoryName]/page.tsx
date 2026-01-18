/* eslint-disable prettier/prettier */
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  useGetColors,
  useGetProducts,
  useGetSizes,
} from "@/hooks/queries/useProducts";
import { getColorCode } from "@/helper/colorHelper";
import { scrollToTop } from "@/helper/scrollToTop";
import CategoryPageFilters from "@/components/category/CategoryPageFilters";
import CategoryPageLayout from "@/components/category/CategoryPageLayout";
import SortFilterBar from "@/components/category/SortFilterBar";
import { Colors } from "@/components/ColorCheckboxes";
import Pagination from "@/components/ui/Pagination";

const CategoryPage = () => {
  const pathname = usePathname();
  const categoryName = (pathname ?? "").split("/").pop();

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
    []
  );
  const [selectedColors, setSelectedColors] = useState<Colors[]>([]);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemPerPage = 40;

  const { getProducts } = useGetProducts({
    categoryName: categoryName || "",
    sizes: selectedSizes,
    colors: selectedColors.map((color) => color.colorName),
    availability: selectedAvailability,
    minPrice: minPrice,
    maxPrice: maxPrice,
    sortBy: sortOption,
    page: currentPage,
    itemPerPage,
  });

  const { getColors } = useGetColors({
    categoryName: categoryName || "",
  });
  const { getSizes } = useGetSizes({
    categoryName: categoryName || "",
  });

  const { data: productsData, isLoading, error, refetch } = getProducts;

  useEffect(() => {
    refetch();
  }, [
    selectedSizes,
    selectedColors,
    selectedAvailability,
    minPrice,
    maxPrice,
    sortOption,
    refetch,
  ]);

  useEffect(() => {
    if (productsData?.totalProducts) {
      setTotalPages(Math.ceil(productsData.totalProducts / itemPerPage));
    }
  }, [productsData, itemPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedSizes,
    selectedColors,
    selectedAvailability,
    minPrice,
    maxPrice,
    sortOption,
  ]);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const { data: sizes } = getSizes;
  const { data: colorsData } = getColors;
  const availability = ["In Stock", "Out of Stock"];
  const colors =
    colorsData?.map(
      (color) =>
        ({
          colorName: color,
          colorCode: getColorCode(color) || "",
        }) as Colors
    ) || [];

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prevSelectedSizes) =>
      prevSelectedSizes.includes(size)
        ? prevSelectedSizes.filter((s) => s !== size)
        : [...prevSelectedSizes, size]
    );
  };

  const handleAvailabilityChange = (status: string) => {
    setSelectedAvailability((prevSelectedAvailability) =>
      prevSelectedAvailability.includes(status)
        ? prevSelectedAvailability.filter((s) => s !== status)
        : [...prevSelectedAvailability, status]
    );
  };

  const handleColorChange = (colorName: string) => {
    setSelectedColors((prevSelectedColors) => {
      const selectedColor = colors.find(
        (color) => color.colorName === colorName
      );
      if (!selectedColor) return prevSelectedColors;
      return prevSelectedColors.some((color) => color.colorName === colorName)
        ? prevSelectedColors.filter((color) => color.colorName !== colorName)
        : [...prevSelectedColors, selectedColor];
    });
  };

  const handlePriceRangeChange = (
    min: number | undefined,
    max: number | undefined
  ) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const handleRemoveSize = (size: string) => {
    setSelectedSizes(selectedSizes.filter((s) => s !== size));
  };

  const handleRemoveAvailability = (status: string) => {
    setSelectedAvailability(selectedAvailability.filter((s) => s !== status));
  };

  const handleRemoveColor = (colorName: string) => {
    setSelectedColors(
      selectedColors.filter((color) => color.colorName !== colorName)
    );
  };

  const handleRemovePriceRange = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
  };

  const handleClearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedAvailability([]);
    setSelectedColors([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSortOption("");
  };

  const products = productsData?.products || [];

  return (
    <CategoryPageLayout
      totalProducts={productsData?.totalProducts || 0}
      isLoading={isLoading}
      error={error}
      products={products}
      sortFilterBar={
        <SortFilterBar
          totalProducts={productsData?.totalProducts || 0}
          sortOption={sortOption}
          handleSortChange={handleSortChange}
        />
      }
      isEmpty="Sorry, there are no products in this collection."
      filters={
        <CategoryPageFilters
          pathname={pathname ?? ""}
          categoryName={categoryName}
          sizes={sizes || []}
          selectedSizes={selectedSizes}
          handleSizeChange={handleSizeChange}
          availability={availability}
          selectedAvailability={selectedAvailability}
          handleAvailabilityChange={handleAvailabilityChange}
          colors={colors}
          selectedColors={selectedColors}
          handleColorChange={handleColorChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          handlePriceRangeChange={handlePriceRangeChange}
          handleRemoveSize={handleRemoveSize}
          handleRemoveColor={handleRemoveColor}
          handleRemoveAvailability={handleRemoveAvailability}
          handleRemovePriceRange={handleRemovePriceRange}
          handleClearAllFilters={handleClearAllFilters}
        />
      }
      pagination={
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            scrollToTop();
          }}
        />
      }
    />
  );
};

export default CategoryPage;
