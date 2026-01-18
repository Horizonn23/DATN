// components/product/RelatedProducts.tsx
import React from "react";
import { Product } from "@/types/product";
import { useGetRelatedProducts } from "@/hooks/queries/useProducts";
import ProductCard from "./ProductCard";
import DefaultLoading from "@/components/loading/DefaultLoading";

interface RelatedProductsProps {
  productId: string;
  className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  className = "",
}) => {
  const { getRelatedProducts } = useGetRelatedProducts(productId);
  const { data: relatedProducts, isLoading, error } = getRelatedProducts;

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Related Products
        </h2>
        <div className="flex justify-center items-center h-32">
          <DefaultLoading />
        </div>
      </div>
    );
  }

  if (error || !relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        You May Also Like
      </h2>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-auto">
        {relatedProducts.map((product: Product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
