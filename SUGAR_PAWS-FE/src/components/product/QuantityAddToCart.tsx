// components/product/QuantityAddToCart.tsx
import React from "react";
// Import an icon, e.g., from react-icons
import { FaShoppingBag } from "react-icons/fa";
import CtaButton from "../ui/CtaButton";
import SecondaryButton from "../ui/SecondaryButton";

interface QuantityAddToCartProps {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const QuantityAddToCart: React.FC<QuantityAddToCartProps> = ({
  quantity,
  onDecrement,
  onIncrement,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueString = e.target.value;
    if (valueString === "") {
      onQuantityChange(1);
    } else {
      const value = parseInt(valueString);
      if (!isNaN(value) && value >= 1) {
        onQuantityChange(value);
      } else if (isNaN(value) || value < 1) {
        onQuantityChange(1);
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e.target.value === "" ||
      parseInt(e.target.value) < 1 ||
      isNaN(parseInt(e.target.value))
    ) {
      onQuantityChange(1);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-6">
      <div className="flex items-center bg-white rounded-full">
        <button
          onClick={onDecrement}
          className="px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed rounded-l-full" // Added rounding consistency
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
        >
          -
        </button>
        <input
          type="number" // Keep type number for semantics, but styling overrides browser spinner
          min="1"
          value={quantity}
          onChange={handleInputChange}
          onBlur={handleBlur} // Add blur handler to ensure minimum value
          className="w-10 text-center py-2 focus:outline-none text-md font-[600] text-gray-700 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          aria-label="Quantity"
        />
        <button
          onClick={onIncrement}
          className="px-4 py-2 text-custom-rose text-lg hover:bg-gray-100 hover:text-gray-900 focus:outline-none rounded-r-full" // Added rounding consistency
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 flex-grow">
        <SecondaryButton
          text="Add To Cart"
          onClick={onAddToCart}
          className="flex-1 py-2.5"
        />
        <CtaButton
          text="Buy Now"
          onClick={onBuyNow}
          icon={<FaShoppingBag className="w-4 h-4 mr-3" />}
          className="flex-1 py-2.5 hover:opacity-90"
        />
      </div>
    </div>
  );
};

export default QuantityAddToCart;
