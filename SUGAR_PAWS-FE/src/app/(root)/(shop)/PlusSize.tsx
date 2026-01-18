"use client";

import CtaButton from "@/components/ui/CtaButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type PlusSizeItem = { imgSrc: string; name: string; price: string };

const products: PlusSizeItem[] = [
  {
    imgSrc: "/assets/images/plus-size/plus-size1.png",
    name: "Be day go crime T-shirt 1",
    price: "$29.99",
  },
  {
    imgSrc: "/assets/images/plus-size/plus-size2.png",
    name: "Be day go crime T-shirt 2",
    price: "$34.99",
  },
  {
    imgSrc: "/assets/images/plus-size/plus-size3.png",
    name: "Be day go crime T-shirt 3",
    price: "$39.99",
  },
  {
    imgSrc: "/assets/images/plus-size/plus-size4.png",
    name: "Be day go crime T-shirt 4",
    price: "$44.99",
  },
];

const PlusSize = () => {
  const router = useRouter();
  return (
    <div className="max-w-[1200px] min-w-[928px] w-[60%] flex justify-between items-center gap-10">
      <div className="w-[40%]">
        <h2 className="text-[32px] text-custom-purple font-bold mb-6">
          Plus Size? We got you!
        </h2>
        <p className="mb-6 text-[12px]">
          Look cute at any size with dresses, skirts, blouses, legwear and more.
        </p>
        <p className="leading-relaxed mt-4 mb-6 italic text-[12px]">
          We define our plus-size garments as having a bust equal to or greater
          than 125cm (49 in) and a waist equal to or greater than 100cm (39 in).
          Some of our items can go up to 178cm (70 in)!
        </p>
        <CtaButton
          text="BROWSE ALL PLUS PRICE"
          onClick={() => router.push("/plus-size")}
        />
      </div>
      <div className="w-[50%]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="w-full h-[260px] relative rounded-[10px] overflow-hidden">
                <Image
                  src={product.imgSrc}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="mt-2 flex justify-between w-full text-[12px]">
                <h3 className="font-medium group-hover:font-semibold">
                  {product.name}
                </h3>
                <p className="font-light">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlusSize;
