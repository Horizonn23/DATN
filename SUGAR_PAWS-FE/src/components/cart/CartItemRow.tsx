import React from "react";
import Image from "next/image";
import { formatCurrency, ensureAbsoluteUrl } from "@/helper/renderNumber";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { ProductDetail } from "@/types/product";

type CartItemProps = {
  id: number;
  product: ProductDetail;
  quantity: number;
  isSelected: boolean;
  onSelect: (id: number, selected: boolean) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onUpdateColor: (id: number, color: string) => void;
  onUpdateSize: (id: number, size: string) => void;
  onRemove: (id: number) => void;
};

const CartItemRow: React.FC<CartItemProps> = ({
  id,
  product,
  quantity,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onUpdateColor,
  onUpdateSize,
  onRemove,
}) => {
  const subtotal = product.price * quantity;
  const [showVariants, setShowVariants] = React.useState(false);

  // Generate colors and sizes from available options
  const colors = ["White", "Black", "Red", "Blue", "Pink"];
  const sizes = ["XS", "S", "M", "L", "XL"];
  return (
    <div className="grid grid-cols-12 gap-4 items-center py-6 border-b border-gray-200">
      {/* Checkbox for selection */}
      <div className="col-span-1 flex justify-center items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(id, e.target.checked)}
          className="w-5 h-5 accent-custom-wine"
        />
      </div>

      {/* Product image and info */}
      <div className="col-span-11 md:col-span-6 lg:col-span-5 flex gap-4">
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          {product.image?.url ||
          (product.displayImage && product.displayImage.length > 0) ? (
            <Image
              src={ensureAbsoluteUrl(
                product.image?.url ??
                  (product.displayImage && product.displayImage.length > 0
                    ? product.displayImage[0]
                    : ""),
              )}
              alt={product.name ?? ""}
              fill
              sizes="100vw"
              className="object-cover w-full h-full rounded-md"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-center p-1 text-[10px] text-gray-500">
              This product doesn&apos;t have a preview
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <h3 className="font-medium text-sm md:text-base">{product.name}</h3>
          <div className="flex flex-col gap-1 text-xs text-gray-600">
            {/* Display current color, size, and type */}
            <div className="flex items-center gap-2">
              <span>
                Color: <b>{product.color}</b>
              </span>
              <span className="mx-1">|</span>
              <span>
                Size: <b>{product.size}</b>
              </span>
              {product.type && (
                <>
                  <span className="mx-1">|</span>
                  <span>
                    Type: <b>{product.type}</b>
                  </span>
                </>
              )}
              <button
                onClick={() => setShowVariants(!showVariants)}
                className="text-custom-wine text-xs ml-2 hover:underline"
              >
                {showVariants ? "Hide Options" : "Change"}
              </button>
            </div>

            {/* Color and Size options (toggleable) */}
            {showVariants && (
              <div className="mt-3 p-3 border rounded-md bg-gray-50">
                {/* Color options */}
                <div className="mb-3">
                  <p className="font-medium mb-1">Color:</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => onUpdateColor(id, color)}
                        className={`px-2 py-1 text-xs rounded-md ${
                          product.color === color
                            ? "bg-custom-wine text-white"
                            : "bg-white border border-gray-300 hover:border-custom-wine"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size options */}
                <div>
                  <p className="font-medium mb-1">Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => onUpdateSize(id, size)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${
                          product.size === size
                            ? "bg-custom-wine text-white"
                            : "bg-white border border-gray-300 hover:border-custom-wine"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mobile price display */}
            <div className="block md:hidden mt-1">
              Price: {formatCurrency(product.price)} VND
            </div>
          </div>
        </div>
      </div>

      {/* Price - hidden on mobile */}
      <div className="hidden md:block md:col-span-1 text-sm font-medium text-center">
        {formatCurrency(product.price)} VND
      </div>

      {/* Quantity selector */}
      <div className="col-span-6 md:col-span-2 flex justify-center">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) =>
              onUpdateQuantity(id, Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-10 h-8 text-center border-x border-gray-300 focus:outline-none"
          />
          <button
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="col-span-4 md:col-span-2 text-sm font-semibold text-custom-wine text-right md:text-center">
        {formatCurrency(subtotal)} VND
      </div>

      {/* Remove button */}
      <div className="col-span-1 flex justify-center items-center">
        <button
          onClick={() => onRemove(id)}
          className="text-gray-500 hover:text-custom-wine"
          aria-label="Remove item"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CartItemRow;
