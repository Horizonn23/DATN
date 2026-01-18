import React from "react";
import Image from "next/image";

const DefaultLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-custom-rose bg-opacity-75 absolute w-full h-full top-0 left-0 z-50">
      <div className="relative w-40 h-40">
        <Image
          src="/assets/images/loading/default-load.png"
          alt="Loading"
          fill
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
          className="animate-bounce"
        />
      </div>
      <p className="mt-4 text-white text-xl font-bold italic animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default DefaultLoading;
