"use client";
import { CartItem } from "@/types/cart";
import CartItemCard from "./CartItemCard";
import CtaButton from "../ui/CtaButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "@/helper/renderNumber";
import SecondaryButton from "../ui/SecondaryButton";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/store";
import { selectAll } from "@/store/slices/cartSlice";

type Props = {
  cartItems: CartItem[];
  onUpdateItem: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClose: () => void;
};

export default function Cart({
  cartItems,
  onUpdateItem,
  onRemoveItem,
  onClose,
}: Props) {
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.productDetail.price * item.quantity,
    0,
  );

  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div className="w-[400px] max-w-[100vw] h-full flex flex-col bg-custom-yellow shadow-md">
      <div className="bg-custom-wine text-white text-[12px] text-center p-1">
        Shopping for someone? A Gift Card makes choosing easy ♥
      </div>

      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">
          Shopping Cart ({cartItems.length})
        </h2>
        <button
          className="text-gray-500 hover:text-custom-rose"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
      </div>

      <div className="flex-grow overflow-auto px-4 cart-scrollbar">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Your cart is empty
          </div>
        ) : (
          cartItems.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onIncrease={() => onUpdateItem(item.id, item.quantity + 1)}
              onDecrease={() =>
                onUpdateItem(item.id, Math.max(1, item.quantity - 1))
              }
              onRemove={() => onRemoveItem(item.id)}
            />
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Total:</span>
          <span className="font-bold">{formatCurrency(totalPrice)} VND</span>
        </div>
        <div className="flex justify-between">
          <SecondaryButton
            text="Go To Cart"
            onClick={() => {
              router.push("/cart");
              onClose();
            }}
            className="px-9"
          />
          <CtaButton
            text="Check out"
            onClick={() => {
              dispatch(selectAll(cartItems));
              router.push("/checkout");
              onClose();
            }}
            className="px-9"
          />
        </div>

        <p className="text-[12px] mt-2 text-gray-500 text-center">
          Shipping & taxes calculated at checkout
        </p>
      </div>
    </div>
  );
}
