/* eslint-disable prettier/prettier */
// components/product/ProductImageGallery.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ImageDetail } from "@/types/product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface ProductImageGalleryProps {
  images: ImageDetail[];
  selectedImage: ImageDetail | null;
  onThumbnailClick: (image: ImageDetail) => void;
  productTitle: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  selectedImage,
  onThumbnailClick,
  productTitle,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const maxVisibleThumbnails = 5;

  useEffect(() => {
    const preloadImages = () => {
      images.forEach((image) => {
        const img = new window.Image();
        img.src = image.url;
      });
    };

    preloadImages();
  }, [images]);

  useEffect(() => {
    if (selectedImage) {
      const index = images.findIndex(
        (img) => img.id === selectedImage.id && img.url === selectedImage.url
      );
      if (index !== -1) {
        setCurrentImageIndex(index);
        // Ensure the selected thumbnail is visible
        if (index < startIndex) {
          setStartIndex(index);
        } else if (index >= startIndex + maxVisibleThumbnails) {
          setStartIndex(Math.max(0, index - maxVisibleThumbnails + 1));
        }
      }
    }
  }, [selectedImage, images, startIndex]);

  // Get the current image URL
  const getCurrentImageUrl = () => {
    if (selectedImage) return selectedImage.url;
    if (images.length > 0) return images[0].url;
    return "/placeholder.jpg";
  };

  // Handlers
  const openPreview = () => {
    setShowPreview(true);
    document.body.style.overflow = "hidden";
  };

  const closePreview = () => {
    setShowPreview(false);
    document.body.style.overflow = "";
  };

  const handlePrevImage = () => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    onThumbnailClick(images[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex = (currentImageIndex + 1) % images.length;
    onThumbnailClick(images[newIndex]);
  };

  const handleThumbnailScroll = (e: React.WheelEvent) => {
    if (images.length <= maxVisibleThumbnails) return;

    if (e.deltaY > 0) {
      // Scroll down/right
      setStartIndex(
        Math.min(images.length - maxVisibleThumbnails, startIndex + 1)
      );
    } else {
      // Scroll up/left
      setStartIndex(Math.max(0, startIndex - 1));
    }
    e.preventDefault();
  };

  const handlePagePrev = () => {
    const newStartIndex = Math.max(0, startIndex - maxVisibleThumbnails);
    setStartIndex(newStartIndex);
    // Select the first image of the new visible set
    onThumbnailClick(images[newStartIndex]);
  };

  const handlePageNext = () => {
    const newStartIndex = Math.min(
      images.length - maxVisibleThumbnails,
      startIndex + maxVisibleThumbnails
    );
    setStartIndex(newStartIndex);
    // Select the first image of the new visible set
    onThumbnailClick(images[newStartIndex]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-sm border border-gray-200 group cursor-pointer"
        onClick={openPreview}
      >
        <Image
          src={getCurrentImageUrl()}
          alt={`Main view of ${productTitle}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className="object-cover transition-all duration-500 ease-in-out hover:scale-105"
          priority
        />

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening preview
                handlePrevImage();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center shadow-md transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:left-4"
              aria-label="Previous image"
            >
              <FontAwesomeIcon
                icon={faChevronLeft}
                className="w-4 h-4 text-gray-700"
              />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening preview
                handleNextImage();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white/90 flex items-center justify-center shadow-md transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:right-4"
              aria-label="Next image"
            >
              <FontAwesomeIcon
                icon={faChevronRight}
                className="w-4 h-4 text-gray-700"
              />
            </button>
          </>
        )}
      </div>

      {/* Full-screen image preview modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center transition-opacity duration-300">
          <div className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto flex flex-col items-center justify-center p-4">
            <button
              onClick={closePreview}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-all duration-300"
              aria-label="Close preview"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-white" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={getCurrentImageUrl()}
                alt={`Full view of ${productTitle}`}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full 
                    bg-black/30 hover:bg-black/50 flex items-center justify-center transition-all duration-300
                    border border-white/50 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                    aria-label="Previous image"
                  >
                    <FontAwesomeIcon
                      icon={faChevronLeft}
                      className="w-4 h-4 md:w-5 md:h-5 text-white"
                    />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full 
                    bg-black/30 hover:bg-black/50 flex items-center justify-center transition-all duration-300
                    border border-white/50 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                    aria-label="Next image"
                  >
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="w-4 h-4 md:w-5 md:h-5 text-white"
                    />
                  </button>
                </>
              )}
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      {images.length > 1 && (
        <div className="relative w-full">
          <div
            className="flex justify-center gap-2 mx-auto cursor-grab active:cursor-grabbing overflow-hidden relative"
            onWheel={handleThumbnailScroll}
            style={{ userSelect: "none", touchAction: "pan-x" }}
          >
            {/* Indicator for more images to the left */}
            {startIndex > 0 && (
              <div
                className="absolute left-0 top-0 h-full w-8 z-10 flex items-center cursor-pointer"
                onClick={handlePagePrev}
              >
                <div className="bg-white/80 w-5 h-5 rounded-full hover:shadow-md hover:scale-105 flex items-center justify-center shadow-sm ml-1 hover:bg-white transition-colors">
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="w-3 h-3 text-gray-600"
                  />
                </div>
              </div>
            )}

            {images
              .slice(startIndex, startIndex + maxVisibleThumbnails)
              .map((img, index) => (
                <div
                  key={startIndex + index}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    selectedImage &&
                    selectedImage.id === img.id &&
                    selectedImage.url === img.url
                      ? "border-custom-rose ring-1 ring-custom-rose ring-offset-1"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => onThumbnailClick(img)}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${startIndex + index + 1} for ${productTitle}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              ))}

            {/* Indicator for more images to the right */}
            {startIndex + maxVisibleThumbnails < images.length && (
              <div
                className="absolute right-0 top-0 h-full w-8 z-10 flex items-center justify-end cursor-pointer"
                onClick={handlePageNext}
              >
                <div className="bg-white/80 w-5 h-5 rounded-full flex items-center justify-center hover:shadow-md hover:scale-105 shadow-sm mr-1 hover:bg-white transition-colors">
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="w-3 h-3 text-gray-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Image counter indicator */}
          {images.length > maxVisibleThumbnails && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
