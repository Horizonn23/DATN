import React from "react";
import Image from "next/image";

interface CategoryPageBannerProps {
  title: string;
  description?: string;
  imageSrc?: string;
  isLoading?: boolean;
}

const CategoryPageBanner = ({
  title,
  description = "Explore our exclusive collection.",
  imageSrc = "/assets/images/product-banner.jpg",
  isLoading = false,
}: CategoryPageBannerProps) => {
  return (
    <div className="w-full">
      {isLoading ? (
        <div className="bg-custom-pink h-[200px] flex items-center justify-center relative">
          <div className="relative text-center">
            <div className="w-[200px] h-[32px] bg-gray-300 animate-pulse mb-2 rounded"></div>
            <div className="w-[300px] h-[16px] bg-gray-300 animate-pulse rounded"></div>
          </div>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center relative">
          {imageSrc && (
            <Image
              fill
              src={imageSrc}
              alt={title}
              sizes="100vw"
              className="absolute inset-0 w-full h-full object-cover blur-sm"
            />
          )}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-white text-2xl sm:text-4xl font-bold drop-shadow-md animate-fade-in">
              {title}
            </h1>
            {description && (
              <p className="text-white text-sm sm:text-base mt-2 max-w-xl drop-shadow-sm animate-fade-in delay-100">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPageBanner;
