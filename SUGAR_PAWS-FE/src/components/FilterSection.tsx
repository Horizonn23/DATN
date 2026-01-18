import React from "react";
import SizeCheckboxes from "./SizeCheckboxes";
import AvailabilityCheckboxes from "./AvailabilityCheckboxes";
import ColorCheckboxes, { Colors } from "./ColorCheckboxes";
import PriceRangeFilter from "./PriceRangeFilter";

interface FilterSectionProps {
  sizes: string[];
  selectedSizes: string[];
  handleSizeChange: (size: string) => void;
  availability: string[];
  selectedAvailability: string[];
  handleAvailabilityChange: (status: string) => void;
  colors: Colors[];
  selectedColors: Colors[];
  handleColorChange: (colorName: string) => void;
  minPrice?: number;
  maxPrice?: number;
  handlePriceRangeChange: (
    minPrice: number | undefined,
    maxPrice: number | undefined,
  ) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  sizes,
  selectedSizes,
  handleSizeChange,
  availability,
  selectedAvailability,
  handleAvailabilityChange,
  colors,
  selectedColors,
  handleColorChange,
  minPrice,
  maxPrice,
  handlePriceRangeChange,
}) => {
  return (
    <>
      <PriceRangeFilter
        onApply={handlePriceRangeChange}
        minPrice={minPrice}
        maxPrice={maxPrice}
      />
      <SizeCheckboxes
        sizes={sizes}
        selectedSizes={selectedSizes}
        handleSizeChange={handleSizeChange}
      />
      <AvailabilityCheckboxes
        availability={availability}
        selectedAvailability={selectedAvailability}
        handleAvailabilityChange={handleAvailabilityChange}
      />
      <ColorCheckboxes
        colors={colors}
        selectedColors={selectedColors}
        handleColorChange={handleColorChange}
      />
    </>
  );
};

export default FilterSection;
