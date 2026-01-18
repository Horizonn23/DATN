import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { OrderItem } from "@/types/order";
import { Review } from "@/types/product";
import { formatCurrency, ensureAbsoluteUrl } from "@/helper/renderNumber";

interface OrderItemCardProps {
  item: OrderItem;
  hasReview: boolean;
  existingReview?: Review;
  canReviewOrder: boolean;
  onWriteReview: (item: OrderItem) => void;
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({
  item,
  hasReview,
  existingReview,
  canReviewOrder,
  onWriteReview,
}) => {
  const router = useRouter();

  const getProductImageUrl = (orderItem: OrderItem) => {
    if (orderItem.productDetail?.image?.url) {
      return ensureAbsoluteUrl(orderItem.productDetail.image.url);
    }
    if (orderItem.productDetail?.product?.displayImage?.[0]) {
      return ensureAbsoluteUrl(orderItem.productDetail.product.displayImage[0]);
    }
    return "/assets/images/plus-size/plus-size1.png";
  };

  return (
    <div
      key={item.id}
      className="flex items-center gap-5 py-4 px-2 rounded-xl transition-shadow hover:shadow-lg hover:bg-[#f9f6f1] border border-transparent hover:border-custom-wine/30 mb-2"
      onClick={() =>
        router.push(`/collections/${item.productDetail?.product?.id}`)
      }
      style={{
        cursor: item.productDetail?.product?.id ? "pointer" : "default",
      }}
    >
      <div className="w-20 h-20 relative flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
        <Image
          src={getProductImageUrl(item)}
          alt={
            item.productDetail?.name ||
            item.productDetail?.product?.name ||
            "product"
          }
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <div className="font-semibold truncate flex items-center gap-2 text-base text-custom-wine">
          {item.productDetail?.product?.name ||
            item.productDetail?.name ||
            "Product"}
          <span className="text-xs text-gray-500 font-semibold ml-1 bg-gray-100 px-2 py-0.5 rounded-full">
            x{item.quantity}
          </span>
        </div>
        {item.productDetail?.product?.vendor && (
          <div className="text-xs text-gray-400 mt-0.5">
            Vendor:{" "}
            <span className="font-medium text-gray-600">
              {item.productDetail.product.vendor}
            </span>
          </div>
        )}
        <div className="text-xs text-gray-500 mt-1 flex gap-2">
          <span>
            Color:{" "}
            <span className="font-semibold text-gray-700">
              {item.productDetail?.color}
            </span>
          </span>
          {item.productDetail?.size && (
            <span>
              | Size:{" "}
              <span className="font-semibold text-gray-700">
                {item.productDetail.size}
              </span>
            </span>
          )}
          {item.productDetail?.type && (
            <span>
              | Type:{" "}
              <span className="font-semibold text-gray-700">
                {item.productDetail.type}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-start justify-between mt-2 gap-4">
          <div className="flex-1">
            {hasReview ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-green-700 text-sm font-medium">
                      Reviewed
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          size={16}
                          className={
                            star <= (existingReview?.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {existingReview?.rating}/5
                    </span>
                  </div>
                </div>
                {existingReview?.comment && (
                  <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-custom-wine">
                    <p className="text-gray-700 text-sm italic">
                      &ldquo;{existingReview.comment}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ) : canReviewOrder ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <span className="text-blue-700 text-sm font-medium">
                    Ready for review
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm font-medium">
                    Cannot review yet
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3 min-w-[90px]">
        <div className="font-bold text-base whitespace-nowrap text-right text-custom-purple">
          {formatCurrency((item.productDetail?.price ?? 0) * item.quantity)}{" "}
          <span className="text-xs font-normal text-gray-500">VND</span>
        </div>
        {!hasReview && canReviewOrder && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onWriteReview(item);
            }}
            className="bg-custom-wine text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-custom-wine/90 transition-colors"
          >
            Write Review
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderItemCard;
