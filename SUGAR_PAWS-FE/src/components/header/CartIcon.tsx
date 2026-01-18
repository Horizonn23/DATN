"use client";
import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { usePathname } from "next/navigation";

interface CartItem {
  id: number;
  quantity: number;
}

interface CartData {
  cartItems: CartItem[];
}

interface CartIconProps {
  cartData: CartData | null | undefined;
  onCartClick: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ cartData, onCartClick }) => {
  const pathname = usePathname() ?? "";

  return (
    <div className="flex items-center ml-5 cart-icon relative">
      <FiShoppingCart
        size={20}
        className={`${pathname === "/cart" ? "text-custom-rose" : ""} hover:text-custom-rose cursor-pointer`}
        onClick={onCartClick}
      />
      {cartData?.cartItems && cartData.cartItems.length > 0 && (
        <span className="absolute -top-2 -right-2 bg-custom-rose text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartData.cartItems.length}
        </span>
      )}
    </div>
  );
};

export default CartIcon;
