// components/ui/StarRating.tsx
import React from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalStars = 5,
  size = 16,
  className = "",
}) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={`full-${i}`} size={size} className="text-yellow-400" />
      ))}
      {halfStar && <FaStarHalfAlt size={size} className="text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FaStar key={`empty-${i}`} size={size} className="text-gray-300" />
      ))}
    </div>
  );
};

export default StarRating;
