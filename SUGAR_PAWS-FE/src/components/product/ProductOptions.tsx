import { Product, ProductDetail } from "@/types/product";
import React from "react";
import { getColorCode } from "@/helper/colorHelper";

interface ProductOptionsProps {
  colors: Product["colors"];
  sizes: Product["sizes"];
  types?: Product["types"];
  selectedColor: string;
  selectedSize: string;
  selectedType: string;
  onColorSelect: (color: string) => void;
  onSizeSelect: (size: string) => void;
  onTypeSelect: (type: string) => void;
  productDetails?: ProductDetail[];
  errors?: {
    color?: string;
    size?: string;
    type?: string;
  };
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  colors,
  sizes,
  types,
  selectedColor,
  selectedSize,
  selectedType,
  onColorSelect,
  onSizeSelect,
  onTypeSelect,
  productDetails = [],
  errors = {},
}) => {
  // Helper function to check if a color is available based on current selections
  const isColorAvailable = (color: string) => {
    if (!productDetails.length) return true;

    // Colors should always be available if they exist in the product details with stock > 0
    // They should not be disabled by size or type selections
    return productDetails.some((detail) => {
      return detail.color === color && detail.stock > 0;
    });
  };

  // Helper function to check if a size is available based on current selections
  const isSizeAvailable = (size: string) => {
    if (!productDetails.length) return true;

    // Size is available if there's a combination with selected color/type that has stock
    return productDetails.some((detail) => {
      const sizeMatch = detail.size === size;
      // Only check color constraint if a color is selected
      const colorMatch = !selectedColor || detail.color === selectedColor;
      // Only check type constraint if a type is selected
      const typeMatch = !selectedType || detail.type === selectedType;
      const inStock = detail.stock > 0;

      return sizeMatch && colorMatch && typeMatch && inStock;
    });
  };

  // Helper function to check if a type is available based on current selections
  const isTypeAvailable = (type: string) => {
    if (!productDetails.length) return true;

    // Type is available if there's a combination with selected color/size that has stock
    return productDetails.some((detail) => {
      const typeMatch = detail.type === type;
      // Only check color constraint if a color is selected
      const colorMatch = !selectedColor || detail.color === selectedColor;
      // Only check size constraint if a size is selected
      const sizeMatch = !selectedSize || detail.size === selectedSize;
      const inStock = detail.stock > 0;

      return typeMatch && colorMatch && sizeMatch && inStock;
    });
  };
  const renderColorButton = (color: string, isSelected: boolean) => {
    const colorCode = getColorCode(color);
    const isAvailable = isColorAvailable(color);
    let backgroundStyle: string;

    if (Array.isArray(colorCode) && colorCode.length === 2) {
      backgroundStyle = `linear-gradient(to bottom right, ${colorCode[0]} 50%, ${colorCode[1]} 50%)`;
    } else {
      backgroundStyle =
        typeof colorCode === "string"
          ? colorCode
          : (colorCode && colorCode[0]) || "transparent";
    }

    return (
      <button
        aria-label={`Select color ${color}`}
        onClick={() => isAvailable && onColorSelect(color)}
        disabled={!isAvailable}
        className={`w-8 h-8 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-custom-rose transition-all duration-150 ${
          isSelected
            ? "ring-2 ring-offset-1 ring-custom-rose border-white shadow-md"
            : "border-gray-300 hover:border-gray-400"
        } ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
        style={{ background: backgroundStyle }}
      >
        {isSelected && <span className="sr-only">(Selected)</span>}
        {!isAvailable && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-0.5 bg-gray-500 rotate-45 absolute"></div>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-4 mt-4">
      {colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            Choose a Color
          </p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, idx) => (
              <React.Fragment key={idx}>
                {renderColorButton(color, selectedColor === color)}
              </React.Fragment>
            ))}
          </div>
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color}</p>
          )}
        </div>
      )}

      {sizes && sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Choose a Size</p>
            <a href="#" className="text-sm text-custom-rose hover:underline">
              Size Guide
            </a>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size, index) => {
              const isAvailable = isSizeAvailable(size);
              return (
                <button
                  key={index}
                  onClick={() => isAvailable && onSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-custom-pink ${
                    selectedSize === size
                      ? "bg-custom-rose text-white border-custom-rose"
                      : "bg-white text-gray-700 border-custom-pink hover:border-custom-rose"
                  } ${!isAvailable ? "opacity-30 cursor-not-allowed line-through" : "cursor-pointer"}`}
                >
                  {size}
                </button>
              );
            })}
          </div>
          {errors.size && (
            <p className="mt-1 text-sm text-red-600">{errors.size}</p>
          )}
        </div>
      )}

      {types && types.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            Choose a Type
          </p>
          <div className="flex flex-wrap gap-2">
            {types.map((type, index) => {
              const isAvailable = isTypeAvailable(type);
              return (
                <button
                  key={index}
                  onClick={() => isAvailable && onTypeSelect(type)}
                  disabled={!isAvailable}
                  className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-custom-pink ${
                    selectedType === type
                      ? "bg-custom-rose text-white border-custom-rose"
                      : "bg-white text-gray-700 border-custom-pink hover:border-custom-rose"
                  } ${!isAvailable ? "opacity-30 cursor-not-allowed line-through" : "cursor-pointer"}`}
                >
                  {type}
                </button>
              );
            })}
          </div>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductOptions;
