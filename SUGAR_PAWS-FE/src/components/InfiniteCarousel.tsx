import React from "react";
import Image from "next/image";
import styles from "./InfiniteCarousel.module.css";

const brands = [
  "/assets/images/brand-img/brand1.png",
  "/assets/images/brand-img/brand2.png",
  "/assets/images/brand-img/brand3.png",
  "/assets/images/brand-img/brand4.png",
  "/assets/images/brand-img/brand1.png",
  "/assets/images/brand-img/brand6.png",
  "/assets/images/brand-img/brand7.png",
  "/assets/images/brand-img/brand8.png",
  "/assets/images/brand-img/brand9.png",
];

const InfiniteCarousel = () => {
  return (
    <div className={styles.sliderContainer}>
      <div className={styles.slider}>
        <div className={styles.slideTrack}>
          {brands.map((brand, index) => (
            <div key={`brand-${index}`} className={styles.slide}>
              <Image
                src={brand}
                alt={`Brand ${index + 1}`}
                width={240}
                height={160}
              />
            </div>
          ))}
          {brands.map((brand, index) => (
            <div key={`brand-duplicate-${index}`} className={styles.slide}>
              <Image
                src={brand}
                alt={`Brand ${index + 1}`}
                width={240}
                height={160}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
