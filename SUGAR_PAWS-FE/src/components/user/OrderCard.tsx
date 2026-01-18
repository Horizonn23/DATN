import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/helper/renderNumber";
import { formatOrderStatus, getOrderStatusColor } from "@/helper/orderHelper";
import type { Order } from "@/types/order";
import { useCheckOrderReviewStatus } from "@/hooks/queries/useReviews";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { data: reviewStatus } = useCheckOrderReviewStatus(order.id);

  return (
    <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col gap-3 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <div>
          <div className="text-gray-500 text-xs md:text-sm">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}
          >
            {formatOrderStatus(order.status)}
          </span>
        </div>
      </div>
      <div className="divide-y">
        {order.orderItems?.slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-center py-2 gap-3">
            <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <Image
                src={
                  item.productDetail?.image?.url
                    ? item.productDetail.image.url
                    : item.productDetail?.product?.displayImage?.[0]
                      ? item.productDetail.product.displayImage[0].startsWith(
                          "http",
                        )
                        ? item.productDetail.product.displayImage[0]
                        : "https:" + item.productDetail.product.displayImage[0]
                      : "/assets/images/plus-size/plus-size1.png"
                }
                alt={
                  item.productDetail?.name ||
                  item.productDetail?.product?.name ||
                  "product"
                }
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="font-medium truncate flex items-center gap-2">
                {item.productDetail?.product?.name || "Product"}
                <span className="text-xs text-gray-500 font-semibold ml-1">
                  x{item.quantity}
                </span>
              </div>
              {item.productDetail?.product?.vendor && (
                <div className="text-xs text-gray-400 mt-0.5">
                  Vendor: {item.productDetail?.product?.vendor}
                </div>
              )}
            </div>
            <div className="font-semibold text-sm whitespace-nowrap text-right">
              {formatCurrency(item?.productDetail?.price ?? 0 * item.quantity)}{" "}
              VND
            </div>
          </div>
        ))}
        {order.orderItems && order.orderItems.length > 2 && (
          <div className="text-xs text-gray-400 py-1 text-center">
            +{order.orderItems.length - 2} more item(s)
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col">
          {order.voucher &&
            order.discountAmount &&
            order.discountAmount > 0 && (
              <div className="text-xs text-green-600 mb-1">
                Voucher: {order.voucher.code} (-
                {formatCurrency(order.discountAmount)} VND)
              </div>
            )}
          <span className="font-semibold text-base">
            Total: {formatCurrency(order.totalAmount)} VND
          </span>
        </div>
        <div className="flex gap-2 items-center">
          <Link
            href={`/user/orders/${order.id}`}
            className="text-custom-wine text-sm font-medium hover:underline"
          >
            View Details
          </Link>
          {reviewStatus?.canReview && (
            <Link
              href={`/user/orders/${order.id}/review`}
              className="bg-custom-wine text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-custom-wine/90 transition-colors"
            >
              Write Review
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
