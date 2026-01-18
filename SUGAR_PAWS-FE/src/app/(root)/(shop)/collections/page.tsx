"use client";

import React from "react";
import { navbarItems } from "@/const/navbarItems";
import Link from "next/link";
import Image from "next/image";

const CollectionsPage = () => {
  // Lấy tất cả category (bỏ ABOUT)
  const categories = navbarItems.filter((item) => item.name !== "ABOUT");

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 md:px-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-custom-wine tracking-tight drop-shadow-sm">
        Explore Our Collections
      </h1>
      <div className="flex gap-10 flex-wrap flex-col justify-center items-start">
        {categories.map((cat) => {
          const firstImage = cat.nestedItems?.find((n) => n.imageSrc)?.imageSrc;
          return (
            <div
              key={cat.name}
              className="group bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-7 border border-gray-100 hover:border-custom-wine h-full overflow-hidden relative flex flex-col w-full"
            >
              <Link
                href={cat.link}
                className="flex flex-col items-center mb-4 hover:opacity-90 transition w-full"
              >
                {firstImage && (
                  <div className="w-full aspect-square max-h-72 mb-5 relative drop-shadow-md flex justify-center items-center">
                    <Image
                      src={firstImage}
                      alt={cat.name}
                      fill
                      className="object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <span className="text-2xl font-extrabold text-custom-wine mb-2 group-hover:underline tracking-wide drop-shadow-sm w-full text-center">
                  {cat.name}
                </span>
              </Link>
              {/* Hiển thị tất cả nhóm mục con */}
              <div className="flex flex-col gap-4 mt-auto w-full">
                {cat.nestedItems?.map((group, groupIdx) => (
                  <div
                    key={groupIdx}
                    className="bg-pink-50/60 rounded-lg p-3 border border-pink-100 w-full"
                  >
                    {group.titleItem && (
                      <Link
                        href={group.titleItem.link}
                        className="font-bold text-custom-wine text-base hover:underline"
                      >
                        {group.titleItem.name}
                      </Link>
                    )}
                    {/* Danh sách các mục con nhỏ */}
                    {group.itemlist && (
                      <div className="flex flex-wrap gap-2 mt-2 w-full">
                        {group.itemlist.map((item, idx) => (
                          <Link
                            key={item.name + idx}
                            href={item.link}
                            className="bg-custom-pink/20 text-custom-wine px-3 py-1 rounded-full text-xs font-semibold border border-custom-pink/40 shadow-sm hover:bg-custom-pink/40 transition-all"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <span className="inline-block mt-5 text-custom-wine font-bold text-base opacity-80 group-hover:opacity-100 transition text-center w-full">
                View Collection →
              </span>
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-custom-wine transition-all pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionsPage;
