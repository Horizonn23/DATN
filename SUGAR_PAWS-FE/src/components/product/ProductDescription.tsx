"use client";

import React from "react";

interface ProductDescriptionProps {
  description?: string;
}

export default function ProductDescription({
  description,
}: ProductDescriptionProps) {
  if (!description || description.trim() === "") {
    return (
      <div className="text-gray-500 text-center py-8">
        No description available.
      </div>
    );
  }

  const cleanDescription = description.replace(/<meta[^>]*>/g, "");

  return (
    <div>
      <h2 className="text-2xl font-semibold text-custom-dark mb-4">
        Product Description
      </h2>
      <div
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl 
                     prose-p:text-custom-dark prose-p:leading-relaxed 
                     prose-li:marker:text-custom-rose prose-li:mb-1 
                     prose-a:text-custom-purple hover:prose-a:text-custom-wine hover:prose-a:underline 
                     prose-strong:text-custom-dark prose-img:rounded-xl 
                     prose-img:shadow-md prose-headings:text-custom-dark max-w-none"
        dangerouslySetInnerHTML={{ __html: cleanDescription }}
      />
    </div>
  );
}
