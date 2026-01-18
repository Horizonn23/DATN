import React from "react";
import { CartItem } from "@/types/cart";
import { ensureAbsoluteUrl, formatCurrency } from "@/helper/renderNumber";
import Image from "next/image";

interface CheckoutOrderItemProps {
  item: CartItem;
  showQuantityControl?: boolean;
}

const CheckoutOrderItem: React.FC<CheckoutOrderItemProps> = ({ item }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      {/* Product Image */}
      <div className="w-16 h-16 relative flex-shrink-0">
        <Image
          src={ensureAbsoluteUrl(
            item.productDetail.image?.url ??
              (item.productDetail.displayImage &&
              item.productDetail.displayImage.length > 0
                ? item.productDetail.displayImage[0]
                : ""),
          )}
          alt={item.productDetail.name || "product"}
          fill
          className="rounded-lg object-cover border border-white shadow-sm"
          sizes="64px"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-800 text-sm mb-1 truncate">
          {item.productDetail.vendor && (
            <span className="text-xs text-custom-wine font-medium mr-2 bg-custom-pink/30 px-2 py-0.5 rounded">
              {item.productDetail.vendor}
            </span>
          )}
          {item.productDetail.name || "Product name"}
        </div>

        {/* Product Variants */}
        <div className="flex flex-wrap items-center gap-1 text-xs text-gray-600 mb-1">
          <span className="inline-flex items-center gap-1 bg-custom-pink/50 text-custom-purple px-2 py-0.5 rounded-full">
            🎨 {item.productDetail.color}
          </span>
          {item.productDetail.size && (
            <span className="inline-flex items-center gap-1 bg-custom-yellow/50 text-custom-purple px-2 py-0.5 rounded-full">
              📏 {item.productDetail.size}
            </span>
          )}
          {item.productDetail.type && (
            <span className="inline-flex items-center gap-1 bg-custom-wine/20 text-custom-wine px-2 py-0.5 rounded-full">
              🏷️ {item.productDetail.type}
            </span>
          )}
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between">
          <div className="text-custom-wine font-semibold text-sm">
            {formatCurrency(item.productDetail.price)} VND
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Qty:</span>
            <span className="bg-custom-wine/10 text-custom-wine px-2 py-0.5 rounded-full text-xs font-semibold">
              {item.quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutOrderItem;
