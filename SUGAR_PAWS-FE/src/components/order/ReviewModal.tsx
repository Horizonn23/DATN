import React from "react";
import Image from "next/image";
import { FaStar, FaTimes } from "react-icons/fa";
import { OrderItem } from "@/types/order";
import { ensureAbsoluteUrl } from "@/helper/renderNumber";

interface ReviewModalProps {
  isOpen: boolean;
  selectedItem: OrderItem | null;
  reviewData: {
    rating: number;
    comment: string;
  };
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onUpdateReview: (data: { rating: number; comment: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  selectedItem,
  reviewData,
  isSubmitting,
  onClose,
  onSubmit,
  onUpdateReview,
}) => {
  const getProductImageUrl = (orderItem: OrderItem) => {
    if (orderItem.productDetail?.image?.url) {
      return ensureAbsoluteUrl(orderItem.productDetail.image.url);
    }
    if (orderItem.productDetail?.product?.displayImage?.[0]) {
      return ensureAbsoluteUrl(orderItem.productDetail.product.displayImage[0]);
    }
    return "/assets/images/plus-size/plus-size1.png";
  };

  if (!isOpen || !selectedItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Write Review</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex items-start gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 relative flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={getProductImageUrl(selectedItem)}
              alt={selectedItem.productDetail?.product?.name || "Product"}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">
              {selectedItem.productDetail?.product?.name || "Product"}
            </h4>
            <p className="text-xs text-gray-600">
              Quantity: {selectedItem.quantity}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => onUpdateReview({ ...reviewData, rating: star })}
                className="transition-colors"
              >
                <FaStar
                  size={24}
                  className={
                    star <= reviewData.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            value={reviewData.comment}
            onChange={(e) =>
              onUpdateReview({ ...reviewData, comment: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-wine focus:border-transparent resize-none"
            placeholder="Share your experience with this product..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={reviewData.rating === 0 || isSubmitting}
            className="flex-1 px-4 py-2 bg-custom-wine text-white rounded-lg hover:bg-custom-wine/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
