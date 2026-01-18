"use client";

import React from "react";
import { CartItem } from "@/types/cart";
import CheckoutSectionHeader from "./CheckoutSectionHeader";
import CheckoutOrderItem from "./CheckoutOrderItem";

interface CheckoutProductListProps {
  selectedItems: CartItem[];
}

const CheckoutProductList: React.FC<CheckoutProductListProps> = ({
  selectedItems,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden smooth-hover">
      {/* Header */}
      <CheckoutSectionHeader
        icon="🛍️"
        title={`Order Items (${selectedItems.length})`}
        gradient="from-custom-rose to-custom-pink"
      />

      {/* Content */}
      <div className="p-4">
        {selectedItems.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-gray-400 text-3xl mb-2">🛒</div>
            <div className="text-gray-500 font-medium">
              No products in your cart.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedItems.map((item) => (
              <CheckoutOrderItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutProductList;
