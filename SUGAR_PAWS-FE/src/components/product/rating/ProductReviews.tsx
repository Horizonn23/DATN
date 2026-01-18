/* eslint-disable prettier/prettier */
import { Review } from "@/types/product";
import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import StarRating from "./StarRating";

interface ProductReviewsProps {
  productRating: number;
  reviews: Review[];
  totalReviews?: number;
  ratingDistribution?: { [key: number]: number };
}

const RatingSummary: React.FC<{
  rating: number;
  distribution: { [key: number]: number };
  totalReviews: number;
}> = ({ rating, distribution, totalReviews }) => (
  <div className="flex flex-col m-auto sm:flex-row w-full md:w-2/3 items-start sm:items-center gap-4 md:gap-6 bg-white p-4 md:p-7 rounded-lg border border-gray-200 shadow mb-6">
    <div className="text-center flex-shrink-0 px-4">
      <p className="text-5xl font-bold text-gray-800 mb-1">
        {rating.toFixed(1)}
      </p>
      <StarRating rating={rating} size={18} className="justify-center mb-1.5" />
      <p className="text-sm text-gray-500">({totalReviews} Reviews)</p>
    </div>
    <div className="flex-grow w-full">
      {Object.entries(distribution)
        .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
        .map(([stars, percentage]) => (
          <div key={stars} className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-medium text-gray-600 w-6 text-right">
              {stars}
              <FaStar className="w-3 h-3 ml-0.5 text-yellow-400 inline-block" />
            </span>
            <div className="flex-grow bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-yellow-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-600 w-10 text-right">
              {percentage.toFixed(0)}%
            </span>
          </div>
        ))}
    </div>
  </div>
);

const ReviewItem: React.FC<{ review: Review }> = ({ review }) => {
  const displayName = review.userName || review.name || "Anonymous";
  const displayTime =
    review.time ||
    (review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "");
  const displayTitle = review.title || "";
  const displayComment = review.comment || "";

  return (
    <div className="pt-5 first:pt-0">
      <div className="flex items-start gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold text-sm">
          {displayName.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
            <p className="font-semibold text-sm text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500 mt-0.5 sm:mt-0">
              {displayTime}
            </p>
          </div>
          <StarRating rating={review.rating} size={16} className="mb-1.5" />
          {review.isVerified && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Verified Purchase
            </span>
          )}
        </div>
      </div>
      <div className="pl-0 md:pl-13">
        {displayTitle && (
          <h4 className="font-medium text-base text-gray-800 mb-1">
            {displayTitle}
          </h4>
        )}
        <p className="text-sm text-gray-600 leading-relaxed">
          {displayComment}
        </p>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <button className="hover:text-indigo-600 transition-colors font-medium">
            Helpful
          </button>
          <span className="text-gray-300">|</span>
          <button className="hover:text-indigo-600 transition-colors font-medium">
            Reply
          </button>
          <span className="text-gray-300">|</span>
          <button className="hover:text-red-600 transition-colors font-medium">
            Report
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productRating,
  reviews = [],
  totalReviews,
  ratingDistribution,
}) => {
  const calculateDistribution = (
    reviewsToCalc: Review[]
  ): { [key: number]: number } => {
    const counts: { [key: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsToCalc.forEach((review) => {
      const ratingKey = Math.round(review.rating);
      if (ratingKey >= 1 && ratingKey <= 5) {
        counts[ratingKey]++;
      }
    });
    const total = reviewsToCalc.length;
    const distribution: { [key: number]: number } = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };
    if (total > 0) {
      for (const stars in counts) {
        if (Object.prototype.hasOwnProperty.call(counts, stars)) {
          const starKey = parseInt(stars);
          distribution[starKey] = (counts[starKey] / total) * 100;
        }
      }
    }
    return distribution;
  };

  const finalRatingDistribution =
    ratingDistribution || calculateDistribution(reviews);
  const finalTotalReviews = totalReviews || reviews.length;
  const [visibleReviews, setVisibleReviews] = useState(5);
  const showViewAllButton = reviews.length > visibleReviews;
  const handleViewAll = () => setVisibleReviews(reviews.length);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
          Customer Feedback
        </h2>
        <RatingSummary
          rating={productRating}
          distribution={finalRatingDistribution}
          totalReviews={finalTotalReviews}
        />
      </div>

      <div>
        <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4">
          Reviews ({finalTotalReviews})
        </h3>
        {finalTotalReviews > 0 ? (
          <div className="space-y-5 mb-6">
            {reviews.slice(0, visibleReviews).map((review) => (
              <ReviewItem key={review.id ?? Math.random()} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            No reviews yet for this product.
          </p>
        )}
        {showViewAllButton && (
          <div className="text-center mt-6">
            <button
              onClick={handleViewAll}
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View All {reviews.length} Reviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
