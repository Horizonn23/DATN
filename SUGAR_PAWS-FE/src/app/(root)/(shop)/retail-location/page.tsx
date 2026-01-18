import Image from "next/image";
import React from "react";
import Schedule from "./Schedule";
import ImageGrid from "./ImageGrid";

const RetailLocationPage = () => {
  return (
    <main>
      <section className="w-full h-[304px] bg-custom-pink px-[10%] flex flex-col justify-center relative">
        <Image
          src="/assets/images/about/about-6.png"
          alt="Retail Store"
          fill
          sizes="100vw"
          className="object-cover z-10"
        />
        <h1 className="text-white font-bold text-[40px] z-20">
          Retail Storefront
        </h1>
        <p className="text-white font-medium text-[20px] z-20">
          Lolita Collective has made a permanent home in the Kansas City,
          Missouri area.
        </p>
      </section>
      <section className="w-full flex flex-col justify-center items-center gap-20 pt-20 text-[12px]">
        <div className="max-w-[1200px] min-w-[928px] w-[60%] flex justify-between items-center gap-10">
          <div className="flex flex-col gap-6 px-4">
            <p className="text-[20px]">OUR RETAIL STORE</p>
            <h2 className="text-[32px] font-bold text-custom-purple">
              Location & Hours
            </h2>
            <div className="mt-4 text-[12px] font-light leading-relaxed">
              <p className="font-semibold text-custom-purple">
                880 NW Blue Parkway Suite C, Lee&apos;s Summit, Missouri 64086
              </p>
              <p>Thursday - Sunday: 11 am - 7 pm</p>
              <p>Monday & Tuesday: closed</p>
              <p>Wednesday: by appointment only</p>
            </div>
          </div>
          <div className="w-[50%] h-[460px] rounded-[16px] overflow-hidden relative">
            <Image
              src="/assets/images/retail-store.png"
              alt="Retail Store"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <Schedule />

        <div className="w-[60%] max-w-[1200px] min-w-[928px] bg-custom-pink h-[296px]">
          map gia dinh
        </div>

        <ImageGrid />
      </section>
    </main>
  );
};

export default RetailLocationPage;
