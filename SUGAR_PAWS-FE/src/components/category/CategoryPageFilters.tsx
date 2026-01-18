import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FilterSection from "@/components/FilterSection";
import { Colors } from "../ColorCheckboxes";

interface CategoryPageFiltersProps {
  pathname: string;
  categoryName?: string;
  subCategoryName?: string;
  sizes: string[];
  colors: Colors[];
  availability: string[];
  selectedSizes: string[];
  selectedColors: Colors[];
  selectedAvailability: string[];
  minPrice?: number;
  maxPrice?: number;
  handleSizeChange: (size: string) => void;
  handleColorChange: (colorName: string) => void;
  handleAvailabilityChange: (status: string) => void;
  handlePriceRangeChange: (
    minPrice: number | undefined,
    maxPrice: number | undefined,
  ) => void;
  handleRemoveSize: (size: string) => void;
  handleRemoveColor: (colorCode: string) => void;
  handleRemoveAvailability: (status: string) => void;
  handleRemovePriceRange: () => void;
  handleClearAllFilters: () => void;
}

const CategoryPageFilters = ({
  pathname,
  categoryName,
  subCategoryName,
  sizes,
  colors,
  availability,
  selectedSizes,
  selectedColors,
  selectedAvailability,
  minPrice,
  maxPrice,
  handleSizeChange,
  handleColorChange,
  handleAvailabilityChange,
  handlePriceRangeChange,
  handleRemoveSize,
  handleRemoveColor,
  handleRemoveAvailability,
  handleClearAllFilters,
}: CategoryPageFiltersProps) => {
  const hasPriceFilter = minPrice !== undefined || maxPrice !== undefined;
  const totalFilters =
    selectedSizes.length +
    selectedAvailability.length +
    selectedColors.length +
    (hasPriceFilter ? 1 : 0);

  return (
    <div className="flex flex-col w-[268px] sticky top-[52px] py-8 self-start max-h-[calc(100vh-52px)] overflow-y-auto scrollbar-hide">
      <div className="font-light italic">
        <Link href={"/"} className="hover:underline">
          Home
        </Link>{" "}
        /{" "}
        {subCategoryName ? (
          <>
            <Link href={`/${categoryName}`} className="hover:underline">
              {(categoryName ?? "").charAt(0).toUpperCase() +
                (categoryName ?? "").slice(1)}
            </Link>{" "}
            /{" "}
            <Link href={pathname} className="hover:underline">
              {(subCategoryName ?? "").charAt(0).toUpperCase() +
                (subCategoryName ?? "").slice(1)}
            </Link>
          </>
        ) : (
          <Link href={pathname} className="hover:underline">
            {(categoryName ?? "").charAt(0).toUpperCase() +
              (categoryName ?? "").slice(1)}
          </Link>
        )}
      </div>

      <div className="mt-4 mb-4 border-b-2 border-b-custom-rose">
        <div className="flex justify-between w-full">
          <h1 className="text-[14px] font-bold">
            Filters
            {totalFilters > 0 && `  (${totalFilters})`}
          </h1>
          {totalFilters > 0 && (
            <button
              className="underline font-light"
              onClick={handleClearAllFilters}
            >
              Clear all
            </button>
          )}
        </div>
        <div
          className={`flex flex-wrap gap-2 mb-2 pb-1 ${
            totalFilters > 0 ? "pt-4" : ""
          }`}
        >
          {selectedSizes.length > 0 &&
            selectedSizes.map((size) => (
              <div
                key={size}
                className="flex items-center gap-2 bg-gray-200 py-1 px-3 rounded-full"
              >
                {size}
                <button
                  onClick={() => handleRemoveSize(size)}
                  className="ml-2 text-custom-rose"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}

          {selectedAvailability.length > 0 &&
            selectedAvailability.map((status) => (
              <div
                key={status}
                className="flex items-center gap-2 bg-gray-200 py-1 px-3 rounded-full"
              >
                {status}
                <button
                  onClick={() => handleRemoveAvailability(status)}
                  className="ml-2 text-custom-rose"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}

          {selectedColors.length > 0 &&
            selectedColors.map((color, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-200 py-1 px-3 rounded-full"
              >
                {color.colorName}
                <button
                  onClick={() => handleRemoveColor(color.colorName)}
                  className="ml-2 text-custom-rose"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
        </div>
      </div>
      <FilterSection
        sizes={sizes}
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
      />
    </div>
  );
};

export default CategoryPageFilters;
