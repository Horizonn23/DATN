import React from "react";
import Image from "next/image";
import { getColorCode } from "@/helper/colorHelper";
import { useImageSrc } from "@/hooks/useImageSrc";
import { ProductDetail } from "@/types/product";

interface ProductOptionsSelectorProps {
  name: string;
  sizes?: string[];
  colors: string[];
  types?: string[];
  selectedSize: string | null;
  selectedColor: string | null;
  selectedType: string | null;
  validationError: string | null;
  previewImage: string | null;
  onSizeSelect: (size: string) => void;
  onColorSelect: (color: string) => void;
  onTypeSelect: (type: string) => void;
  onAddToCart: () => void;
  productDetails?: ProductDetail[];
}

const renderColorButton = (color: string, className: string = "") => {
  const colorCode = getColorCode(color);
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
    <div
      className={`rounded-full border border-gray-300 ${className}`}
      style={{ background: backgroundStyle }}
    />
  );
};

const ProductOptionsSelector: React.FC<ProductOptionsSelectorProps> = ({
  name,
  sizes,
  colors,
  types,
  selectedSize,
  selectedColor,
  selectedType,
  validationError,
  previewImage,
  onSizeSelect,
  onColorSelect,
  onTypeSelect,
  onAddToCart,
  productDetails = [],
}) => {
  // Helper functions to check availability based on current selections
  const isColorAvailable = (color: string) => {
    if (!productDetails.length) return true;

    return productDetails.some((detail) => {
      const colorMatch = detail.color === color;
      const sizeMatch = !selectedSize || detail.size === selectedSize;
      const typeMatch = !selectedType || detail.type === selectedType;
      const inStock = detail.stock > 0;

      return colorMatch && sizeMatch && typeMatch && inStock;
    });
  };

  const isSizeAvailable = (size: string) => {
    if (!productDetails.length) return true;

    return productDetails.some((detail) => {
      const sizeMatch = detail.size === size;
      const colorMatch = !selectedColor || detail.color === selectedColor;
      const typeMatch = !selectedType || detail.type === selectedType;
      const inStock = detail.stock > 0;

      return sizeMatch && colorMatch && typeMatch && inStock;
    });
  };

  const isTypeAvailable = (type: string) => {
    if (!productDetails.length) return true;

    return productDetails.some((detail) => {
      const typeMatch = detail.type === type;
      const colorMatch = !selectedColor || detail.color === selectedColor;
      const sizeMatch = !selectedSize || detail.size === selectedSize;
      const inStock = detail.stock > 0;

      return typeMatch && colorMatch && sizeMatch && inStock;
    });
  };
  const imageSrc = useImageSrc(previewImage);

  return (
    <div className="flex gap-4">
      {/* Preview Image */}
      <div className="w-1/3 flex-shrink-0">
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100">
          {previewImage && (
            <Image
              src={imageSrc}
              alt={`${name} preview`}
              width={200}
              height={200}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Options */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-4">Select Options</h3>

        {sizes && sizes.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Sizes:</h4>
            <div className="flex gap-2">
              {sizes.map((size, idx) => {
                const isAvailable = isSizeAvailable(size);
                return (
                  <button
                    key={idx}
                    className={`px-3 py-1 border rounded-full transition-colors ${
                      selectedSize === size
                        ? "bg-custom-rose text-white"
                        : "hover:bg-gray-200"
                    } ${!isAvailable ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                    onClick={() => isAvailable && onSizeSelect(size)}
                    disabled={!isAvailable}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {colors && colors.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Colors:</h4>
            <div className="gap-2 flex flex-wrap">
              {colors.map((color, idx) => {
                const isAvailable = isColorAvailable(color);
                return (
                  <button
                    key={idx}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 shadow-sm relative group
                      ${
                        selectedColor === color
                          ? "ring-2 ring-custom-rose scale-110"
                          : "hover:ring-2 hover:ring-custom-rose/50"
                      } ${!isAvailable ? "opacity-30 cursor-not-allowed" : ""}
                    `}
                    onClick={() => isAvailable && onColorSelect(color)}
                    disabled={!isAvailable}
                    title={color}
                    style={{
                      outline: "none",
                      border: "none",
                      padding: 0,
                      background: "transparent",
                    }}
                  >
                    {renderColorButton(color, "w-6 h-6")}
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-gray-500 rotate-45"></div>
                      </div>
                    )}
                    {/* Tooltip */}
                    <span
                      className="absolute left-1/2 -translate-x-1/2 top-10 z-10 px-2 py-1 rounded bg-black text-white text-xs opacity-0 pointer-events-none group-hover:opacity-100 transition-all"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {color} {!isAvailable && "(Out of Stock)"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {types && types.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Types:</h4>
            <div className="flex gap-2">
              {types.map((type, idx) => {
                const isAvailable = isTypeAvailable(type);
                return (
                  <button
                    key={idx}
                    className={`px-3 py-1 border rounded transition-colors ${
                      selectedType === type
                        ? "bg-custom-rose text-white"
                        : "hover:bg-gray-200"
                    } ${!isAvailable ? "opacity-30 cursor-not-allowed line-through" : ""}`}
                    onClick={() => isAvailable && onTypeSelect(type)}
                    disabled={!isAvailable}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {validationError && (
          <div className="mb-4 text-red-500 text-sm">{validationError}</div>
        )}

        <button
          className="w-full bg-custom-rose text-white py-2 px-4 rounded-md hover:bg-custom-rose/90 transition-colors"
          onClick={onAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductOptionsSelector;
