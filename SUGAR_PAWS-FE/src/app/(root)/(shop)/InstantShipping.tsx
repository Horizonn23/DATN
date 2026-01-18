"use client";

import CtaButton from "@/components/ui/CtaButton";
import React from "react";

const InstantShipping = () => {
  return (
    <div className="w-1/2">
      <div className="mb-6">
        <p className="text-[20px] text-custom-purple">INSTANT SHIPPING</p>
        <p className="font-semibold text-custom-purple text-[32px] underline underline-offset-8 decoration-1">
          High Laced Collar Blouse
        </p>
        <p className="font-semibold text-[32px] text-[rgba(51,16,72,0.5)]">
          Ruffled Heart Pumpkin Pants All Instant Shipping Items
        </p>
      </div>
      <div className="mb-6 text-[12px]">
        <p className="leading-relaxed text-custom-purple font-medium">
          Instant Shipping! High Laced Collar Long Sleeve Blouse 1.132.000 VND
        </p>
        <p className="leading-relaxed">
          Aristocratic AirAdd the High Laced Collar Long Sleeve Blouse from
          Xilia for Victorian splendor. The blouse features a high lace collar
          that is enclosed with with pintucks and ru...
        </p>
      </div>
      <CtaButton text="CHECK IT OUT" onClick={() => console.log("clicked")} />
    </div>
  );
};

export default InstantShipping;
