import React from "react";
import Image from "next/image";

const ImageGrid = () => {
  return (
    <div className="max-w-[1200px] min-w-[928px] w-[60%] m-auto grid gap-4 p-6">
      <div className="grid grid-cols-[2fr_1fr] gap-4 h-[226px]">
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src="/assets/images/about/about-7.png"
            alt="Image 1"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{ objectFit: "cover" }}
          />
          {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h2 className="text-[32px] font-bold">Title 1</h2>
            <p className="text-[12px] mt-1">Description 1</p>
          </div> */}
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src="/assets/images/about/about-8.jpg"
            alt="Image 2"
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            style={{ objectFit: "cover" }}
          />
          {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h2 className="text-[32px] font-bold">Title 2</h2>
            <p className="text-[12px] mt-1">Description 2</p>
          </div> */}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-4 h-[226px]">
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src="/assets/images/about/about-9.png"
            alt="Image 3"
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            style={{ objectFit: "cover" }}
          />
          {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h2 className="text-[32px] font-bold">Title 3</h2>
            <p className="text-[12px] mt-1">Description 3</p>
          </div> */}
        </div>
        <div className="relative rounded-xl overflow-hidden">
          <Image
            src="/assets/images/about/about-10.png"
            alt="Image 4"
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            style={{ objectFit: "cover" }}
          />
          {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
            <h2 className="text-[32px] font-bold">Title 4</h2>
            <p className="text-[12px] mt-1">Description 4</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ImageGrid;
