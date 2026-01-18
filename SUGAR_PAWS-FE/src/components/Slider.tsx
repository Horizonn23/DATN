"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import CtaButton from "./ui/CtaButton";
import { useRouter } from "next/navigation";

type CtaButton = { text: string; link: string };

type SliderItem = {
  imageSrc: string;
  align: "left" | "right";
  textColor?: string;
  subTitle?: string;
  title?: string[];
  description?: string[];
  ctaButtons?: CtaButton[];
};

const sliderItems: SliderItem[] = [
  {
    imageSrc: "/assets/images/slider-img/slider-img1.png",
    align: "left",
    subTitle: "IN STOCK NOW",
    title: ["EMILY TEMPLE", "CUTE"],
    description: ["New Plus Sizes for", "ETC & Melody Basket"],
    ctaButtons: [
      { text: "SHOP EMILY TEMPLE CUTE", link: "/" },
      { text: "SHOP MELODY BASKET", link: "/" },
    ],
  },
  {
    imageSrc: "/assets/images/slider-img/slider-img2.webp",
    textColor: "text-custom-purple",
    align: "left",
    subTitle: "GIVE THE CHOICE OFF",
    title: ["GIFT CARD"],
    ctaButtons: [{ text: "GRAB A GIFT CARD", link: "/user/account/voucher" }],
  },
  {
    imageSrc: "/assets/images/slider-img/slider-img3.png",
    textColor: "text-custom-dark ",
    align: "right",
    title: ["Halloween is Here!"],
    description: [
      "Shop our special Halloween Collection",
      "from October 1st - 31st",
    ],
    ctaButtons: [{ text: "HAPPY HAUNTINGS!", link: "/" }],
  },
  {
    imageSrc: "/assets/images/slider-img/slider-img4.png",
    align: "left",
    textColor: "text-custom-dark ",
    title: ["PLUS SIZE"],
    description: ["We've made it even easier to find the perfect fit."],
    ctaButtons: [{ text: "ALL PLUS SIZE CLOTHING", link: "/" }],
  },
  {
    imageSrc: "/assets/images/slider-img/slider-img5.webp",
    textColor: "text-custom-purple",
    align: "left",
    subTitle: "LOVELY HEART GINGHAM CUTSEW DRESS",
    title: ["Pre-Order Today"],
    ctaButtons: [{ text: "SHOP NOW", link: "/" }],
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Set<string>>(new Set());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = sliderItems.map((item) => {
        return new Promise<string>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(item.imageSrc);
          img.onerror = () => {
            console.error(`Failed to load image: ${item.imageSrc}`);
            setImageErrors((prev) => new Set([...prev, item.imageSrc]));
            reject(new Error(`Failed to load ${item.imageSrc}`));
          };
          img.src = item.imageSrc;
        });
      });

      try {
        const loadedImages = await Promise.all(imagePromises);
        setImagesLoaded(new Set(loadedImages));
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };

    preloadImages();
  }, []);

  const extendedItems = [
    sliderItems[sliderItems.length - 1],
    ...sliderItems,
    sliderItems[0],
  ];

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    if (currentIndex === 0) {
      setCurrentIndex(sliderItems.length);
    } else if (currentIndex === sliderItems.length + 1) {
      setCurrentIndex(1);
    }
  };
  const startAutoSlide = useCallback(() => {
    // Chỉ bắt đầu auto slide khi đã load đủ ảnh (hoặc có lỗi)
    const totalProcessed = imagesLoaded.size + imageErrors.size;
    if (totalProcessed >= sliderItems.length) {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
      }, 5000);
    }
  }, [imagesLoaded.size, imageErrors.size]);

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const goToPrevious = () => {
    stopAutoSlide();
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1) % sliderItems.length);
    startAutoSlide();
  };

  const goToNext = () => {
    stopAutoSlide();
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % extendedItems.length);
    startAutoSlide();
  };
  useEffect(() => {
    const totalProcessed = imagesLoaded.size + imageErrors.size;
    if (totalProcessed >= sliderItems.length) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [startAutoSlide, imagesLoaded.size, imageErrors.size]);

  return (
    <div className="relative w-full h-[520px] overflow-hidden group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={goToPrevious}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex justify-center items-center shadow-md bg-custom-yellow text-custom-rose rounded-full transition-transform duration-300 hover:scale-125"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>

      <div className="absolute right-5 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={goToNext}
          className="w-10 h-10 flex justify-center items-center shadow-md bg-custom-yellow text-custom-rose rounded-full transition-transform duration-300 hover:scale-125"
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div className="w-full h-full overflow-hidden">
        <div
          className="flex w-full h-full"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning
              ? "transform 700ms ease-in-out"
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {" "}
          {extendedItems.map(
            (
              {
                imageSrc,
                align,
                subTitle,
                title,
                description,
                ctaButtons,
                textColor,
              },
              index,
            ) => (
              <div
                key={`${imageSrc}-${index}`}
                className="relative w-full h-full flex-shrink-0"
              >
                {!imagesLoaded.has(imageSrc) && !imageErrors.has(imageSrc) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                )}
                {imageErrors.has(imageSrc) && (
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <div className="text-gray-600">Image not found</div>
                  </div>
                )}
                {!imageErrors.has(imageSrc) && (
                  <Image
                    src={imageSrc}
                    alt={`Slide ${index}`}
                    fill
                    sizes="100vw"
                    className={`object-cover transition-opacity duration-300 ${
                      imagesLoaded.has(imageSrc) ? "opacity-100" : "opacity-0"
                    }`}
                    priority={index <= 2} // Ưu tiên load 3 ảnh đầu
                    loading={index <= 2 ? "eager" : "lazy"}
                    quality={90}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx4f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyDnyDzSlVSmzQCCQv0TyFJ5Qw=="
                    onLoad={() => {
                      setImagesLoaded((prev) => new Set([...prev, imageSrc]));
                    }}
                    onError={() => {
                      setImageErrors((prev) => new Set([...prev, imageSrc]));
                    }}
                  />
                )}
                {index === currentIndex &&
                  (imagesLoaded.has(imageSrc) || imageErrors.has(imageSrc)) && (
                    <div
                      className={`absolute h-full flex flex-col justify-center z-50 top-0 ${align === "left" ? "left-24 items-start" : "right-24 items-end"}`}
                    >
                      {subTitle && (
                        <p
                          className={`${textColor ? textColor : "text-white"} font-medium text-[21px]`}
                        >
                          {subTitle}
                        </p>
                      )}
                      {title?.length &&
                        title.map((text) => (
                          <p
                            key={text}
                            className={`${textColor ? textColor : "text-white"} font-bold text-[64px] leading-tight drop-shadow-lg`}
                          >
                            {text}
                          </p>
                        ))}
                      {description?.length &&
                        description.map((text) => (
                          <p
                            key={text}
                            className={`${textColor ? textColor : "text-white"} text-[21px]`}
                          >
                            {text}
                          </p>
                        ))}
                      {ctaButtons?.length && (
                        <div className="flex space-x-4 mt-4 mb-0">
                          {ctaButtons.map(({ text, link }) => (
                            <CtaButton
                              key={text}
                              text={text}
                              onClick={() => router.push(link)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="absolute z-20 bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {sliderItems.map((_, index) => (
          <div
            key={index}
            className={`rounded-full border-[1px] transition-all duration-300 ease-in-out ${
              index + 1 === currentIndex ? "w-8 h-3" : "w-3 h-3 opacity-60"
            } ${
              currentIndex !== 1
                ? "border-custom-purple"
                : "border-custom-yellow"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
