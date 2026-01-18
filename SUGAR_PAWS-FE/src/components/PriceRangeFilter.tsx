import React, { useState, useEffect } from "react";
import CtaButton from "./ui/SecondaryButton";

interface PriceRangeFilterProps {
  onApply: (minPrice: number | undefined, maxPrice: number | undefined) => void;
  minPrice?: number;
  maxPrice?: number;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  onApply,
  minPrice,
  maxPrice,
}) => {
  const [minPriceInput, setMinPriceInput] = useState<string>(
    minPrice !== undefined ? minPrice.toString() : "",
  );
  const [maxPriceInput, setMaxPriceInput] = useState<string>(
    maxPrice !== undefined ? maxPrice.toString() : "",
  );

  // Update local state when props change
  useEffect(() => {
    setMinPriceInput(minPrice !== undefined ? minPrice.toString() : "");
    setMaxPriceInput(maxPrice !== undefined ? maxPrice.toString() : "");
  }, [minPrice, maxPrice]);

  const handleApply = () => {
    const min = minPriceInput ? parseInt(minPriceInput) : undefined;
    const max = maxPriceInput ? parseInt(maxPriceInput) : undefined;
    onApply(min, max);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setMinPriceInput(value);
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setMaxPriceInput(value);
    }
  };

  return (
    <div className="w-full mb-6">
      <h2 className="text-[14px] font-bold mb-3">Price Range</h2>
      <div className="flex flex-col gap-2 mb-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="From"
            value={minPriceInput}
            onChange={handleMinPriceChange}
            className="border border-gray-300 rounded-md p-2 w-full text-xs focus:outline-none focus:ring-1 focus:ring-red-200 focus:border-custom-wine transition-all pl-12 h-9"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
            VND
          </span>
        </div>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="To"
            value={maxPriceInput}
            onChange={handleMaxPriceChange}
            className="border border-gray-300 rounded-md p-2 w-full text-xs focus:outline-none focus:ring-1 focus:ring-red-200 focus:border-custom-wine transition-all pl-12 h-9"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
            VND
          </span>
        </div>
      </div>
      <CtaButton
        text="APPLY"
        onClick={handleApply}
        className="w-[80%] m-auto text-xs h-8"
      />
    </div>
  );
};

export default PriceRangeFilter;
