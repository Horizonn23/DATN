"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CtaButton from "@/components/ui/CtaButton";
import CartItemRow from "@/components/cart/CartItemRow";
import {
  useGetCartItems,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/hooks/queries/useCart";
import { CartItem as ApiCartItem } from "@/types/cart";
import { useRouter } from "next/navigation";
import {
  selectItem,
  deselectItem,
  selectAll as selectAllAction,
  deselectAll as deselectAllAction,
  selectCartSelectedItems,
} from "@/store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

const CartPage = () => {
  const [cartItems, setCartItems] = useState<ApiCartItem[]>([]);

  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(selectCartSelectedItems);

  const [selectAll, setSelectAll] = useState(false);

  const { getCartItems } = useGetCartItems();
  const { data: cartData, isSuccess } = getCartItems;
  const removeCartItemMutation = useRemoveCartItem();
  const updateCartItemMutation = useUpdateCartItem();

  const router = useRouter();

  // Sync cartItems with API data
  useEffect(() => {
    if (isSuccess && cartData?.cartItems) {
      setCartItems(cartData.cartItems);
    }
  }, [isSuccess, cartData]);

  useEffect(() => {
    if (selectAll) {
      dispatch(selectAllAction(cartItems));
    } else {
      dispatch(deselectAllAction());
    }
  }, [selectAll, cartItems, dispatch]);

  // Update selectAll status when individual selections change
  useEffect(() => {
    setSelectAll(
      selectedItems.length === cartItems.length && cartItems.length > 0,
    );
  }, [selectedItems, cartItems.length]);

  // Calculate total amount from selected cart items
  const selectedTotal = selectedItems.reduce(
    (total, item) => total + item.productDetail.price * item.quantity,
    0,
  );

  // Calculate total of all items (regardless of selection)
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.productDetail.price * item.quantity,
    0,
  );

  const handleSelectItem = (id: number, selected: boolean) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    if (selected) {
      dispatch(selectItem(item));
    } else {
      dispatch(deselectItem(item));
    }
  };

  const handleSelectAll = () => {
    setSelectAll((prev) => !prev);
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    // Call API to update cart item quantity
    updateCartItemMutation.mutate({
      cartItemId: id,
      quantity: Math.max(1, newQuantity),
    });
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item,
      ),
    );
  };

  const handleUpdateColor = (id: number, newColor: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              productDetail: { ...item.productDetail, color: newColor },
            }
          : item,
      ),
    );
  };

  const handleUpdateSize = (id: number, newSize: string) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              productDetail: { ...item.productDetail, size: newSize },
            }
          : item,
      ),
    );
  };

  const handleRemoveItem = (id: number) => {
    removeCartItemMutation.mutate(id);
    const item = cartItems.find((i) => i.id === id);
    if (item && selectedItems.some((si) => String(si.id) === String(id))) {
      dispatch(deselectItem(item));
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-custom-yellow py-4 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-custom-dark mb-2">
            Shopping Cart
          </h1>
          <p className="text-custom-purple text-sm md:text-base">
            Review and manage your selected items
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold mb-4 text-custom-dark">
                Your cart is empty
              </h2>
              <p className="mb-8 text-custom-purple">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <Link href="/collections">
                <CtaButton
                  text="Continue Shopping"
                  onClick={() => console.log("continue shopping")}
                />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 items-center bg-gradient-to-r from-custom-rose to-custom-pink">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="w-5 h-5 accent-custom-wine"
                    />
                  </div>
                  <div className="col-span-11 md:col-span-6 lg:col-span-5">
                    <span className="font-semibold text-white">Product</span>
                  </div>
                  <div className="hidden md:block md:col-span-1 text-center">
                    <span className="font-semibold text-white">Price</span>
                  </div>
                  <div className="hidden md:block md:col-span-2 text-center">
                    <span className="font-semibold text-white">Quantity</span>
                  </div>
                  <div className="hidden md:block md:col-span-2 text-center">
                    <span className="font-semibold text-white">Subtotal</span>
                  </div>
                  <div className="hidden md:block md:col-span-1"></div>
                </div>

                {cartItems.map((item) => (
                  <CartItemRow
                    key={String(item.id)}
                    id={item.id}
                    product={item.productDetail}
                    quantity={item.quantity}
                    isSelected={selectedItems.some(
                      (si) => String(si.id) === String(item.id),
                    )}
                    onSelect={handleSelectItem}
                    onUpdateQuantity={handleUpdateQuantity}
                    onUpdateColor={handleUpdateColor}
                    onUpdateSize={handleUpdateSize}
                    onRemove={handleRemoveItem}
                  />
                ))}

                <div className="p-4">
                  <Link
                    href="/collections"
                    className="text-custom-wine inline-flex items-center hover:underline transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-2">📋</span>
                  <h3 className="font-semibold text-xl text-custom-dark">
                    Cart Summary
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-custom-dark text-sm">
                    <span className="font-medium">Items Selected:</span>
                    <span className="font-semibold text-custom-dark">
                      {selectedItems.length} of {cartItems.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-custom-dark text-sm">
                    <span className="font-medium">
                      Subtotal ({selectedItems.length} items)
                    </span>
                    <span className="font-semibold">
                      {selectedTotal.toLocaleString("en-US", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-custom-dark text-sm">
                    <span className="font-medium">Shipping Fee</span>
                    <span className="font-semibold text-green-600">
                      {selectedItems.length > 0
                        ? "Calculated at checkout"
                        : "—"}
                    </span>
                  </div>

                  <div className="border-t border-custom-pink/30 pt-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-custom-dark">
                        Total Payment
                      </span>
                      <span className="text-xl font-bold text-custom-wine">
                        {selectedTotal.toLocaleString("en-US", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    {selectedItems.length < cartItems.length && (
                      <div className="text-xs text-custom-purple my-2">
                        Cart total (all items):{" "}
                        {cartTotal.toLocaleString("en-US", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  {/* Security Badge */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700 font-medium">
                        🔒 Secure checkout with SSL encryption
                      </span>
                    </div>
                  </div>

                  <CtaButton
                    text="Checkout Selected Items"
                    className={`w-full py-3 ${selectedItems.length === 0 ? "opacity-70 cursor-not-allowed" : ""}`}
                    onClick={handleCheckout}
                    disabled={selectedItems.length === 0}
                  />
                </div>

                {/* Disclaimer */}
                <div className="text-sm text-custom-purple mt-4 space-y-1">
                  <p>• Taxes and shipping calculated at checkout</p>
                  <p>• Only selected items will be included in checkout</p>
                  <p className="text-xs text-custom-purple text-center leading-relaxed pt-2 border-t border-custom-pink/30">
                    By proceeding to checkout, you agree to our Terms of Service
                    and Privacy Policy. Your payment information is secure and
                    encrypted.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <h4 className="font-semibold mb-3 text-custom-dark flex items-center">
                  <span className="mr-2">💳</span>
                  We Accept
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    MC
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">
                    AMEX
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    PP
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
