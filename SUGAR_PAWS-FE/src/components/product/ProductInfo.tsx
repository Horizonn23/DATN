// components/product/ProductInfo.tsx
import { Product, ProductDetail } from "@/types/product";
import React from "react";
import { FiHeart, FiShare2 } from "react-icons/fi";
import StarRating from "./rating/StarRating";
import { formatCurrency } from "@/helper/renderNumber";
import { useGetProductReviewStats } from "@/hooks/queries/useReviews";

interface ProductInfoProps {
  product: Product;
  selectedProductDetail?: ProductDetail | null;
  onWishlistClick?: () => void;
  onShareClick?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedProductDetail,
  onWishlistClick,
  onShareClick,
}) => {
  // Fetch review stats for the product
  const { data: reviewStats } = useGetProductReviewStats(product.id.toString());

  // Calculate recommendation percentage (4+ star reviews)
  const calculateRecommendationPercentage = () => {
    if (!reviewStats?.ratingDistribution || reviewStats.totalReviews === 0) {
      return 0;
    }

    const positiveReviews =
      (reviewStats.ratingDistribution[4] || 0) +
      (reviewStats.ratingDistribution[5] || 0);
    return Math.round((positiveReviews / reviewStats.totalReviews) * 100);
  };

  const recommendationPercentage = calculateRecommendationPercentage();

  const calculateTotals = () => {
    if (!product.productDetails?.length) {
      return {
        cheapestPrice: product.minPrice,
        totalStock: product.totalStock,
        totalSales: product.totalSales || 0,
      };
    }

    const cheapestPrice = Math.min(
      ...product.productDetails.map((detail) => detail.price),
    );
    const totalStock = product.productDetails.reduce(
      (sum, detail) => sum + detail.stock,
      0,
    );
    const totalSales = product.productDetails.reduce(
      (sum, detail) => sum + detail.sale,
      0,
    );

    return { cheapestPrice, totalStock, totalSales };
  };

  const { cheapestPrice, totalStock, totalSales } = calculateTotals();

  const displayPrice = selectedProductDetail?.price || cheapestPrice;
  const oldPrice =
    selectedProductDetail?.oldPrice ||
    (product.maxPrice !== product.minPrice ? product.maxPrice : null);
  const stockInfo =
    selectedProductDetail?.stock !== undefined
      ? selectedProductDetail.stock
      : totalStock;
  const salesInfo =
    selectedProductDetail?.sale !== undefined
      ? selectedProductDetail.sale
      : totalSales;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {product.name}
        </h1>
        <div className="flex gap-3 text-gray-500 pt-1">
          <button
            aria-label="Add to Wishlist"
            className="hover:text-red-500"
            onClick={onWishlistClick}
          >
            <FiHeart size={20} />
          </button>
          <button
            aria-label="Share Product"
            className="hover:text-custom-rose"
            onClick={onShareClick}
          >
            <FiShare2 size={20} />
          </button>
        </div>
      </div>

      <p className="text-gray-500 text-sm">{product.vendor}</p>

      <div className="flex items-center gap-3 mt-2">
        <span className="text-2xl md:text-3xl font-bold text-gray-900">
          {formatCurrency(displayPrice)}₫
        </span>
        {oldPrice && (
          <span className="text-lg line-through text-gray-400">
            {formatCurrency(oldPrice)}₫
          </span>
        )}
      </div>

      {/* Stock and Sales Information */}
      <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1 mb-1">
        <span className="flex items-center">
          <span className="font-medium mr-1">In Stock:</span>
          <span
            className={stockInfo > 10 ? "text-green-600" : "text-orange-500"}
          >
            {stockInfo || 0} items
          </span>
        </span>
        <span className="text-gray-400 hidden sm:inline">|</span>
        <span className="flex items-center">
          <span className="font-medium mr-1">Sold:</span>
          <span className="text-blue-600">{salesInfo || 0} items</span>
        </span>
        {!selectedProductDetail && product.productDetails?.length && (
          <>
            <span className="text-gray-400 hidden sm:inline">|</span>
            <span className="text-xs text-gray-500">
              (Total from all variants)
            </span>
          </>
        )}
      </div>

      {stockInfo < 10 && stockInfo > 0 && (
        <div className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-md mb-2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          Hurry! Only {stockInfo} items left in stock
          {!selectedProductDetail && product.productDetails?.length && (
            <span className="ml-1">(across all variants)</span>
          )}
        </div>
      )}

      <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600 mt-1">
        <StarRating rating={product.rating ?? 5} size={16} />
        <span className="font-medium">{(product.rating ?? 5).toFixed(1)}</span>
        <span className="text-gray-400 hidden sm:inline">|</span>
        <a href="#reviews-section" className="hover:underline">
          {reviewStats?.totalReviews !== undefined
            ? `${reviewStats.totalReviews} ${reviewStats.totalReviews === 1 ? "Review" : "Reviews"}`
            : "0 Reviews"}
        </a>
        <span className="text-gray-400 hidden sm:inline">|</span>
        <span className="text-green-600 font-medium">
          {reviewStats?.totalReviews && reviewStats.totalReviews > 0
            ? `${recommendationPercentage}% Recommended`
            : "No recommendations yet"}
        </span>
      </div>
    </div>
  );
};

export default ProductInfo;
