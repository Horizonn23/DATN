import React, { ReactNode } from "react";
import ProductLoading from "@/components/loading/ProductLoading";
import ProductsSection from "@/components/product/ProductsSection";
import { Product } from "@/types/product";
import CtaButton from "../ui/CtaButton";
import Link from "next/link";

interface CategoryPageLayoutProps {
  isLoading: boolean;
  error: unknown;
  products: Product[];
  filters: ReactNode;
  isEmpty?: string;
  sortFilterBar?: ReactNode;
  totalProducts?: number;
  pagination?: ReactNode;
}

const CategoryPageLayout = ({
  isLoading,
  error,
  products,
  filters,
  isEmpty = "Sorry, there are no products in this collection.",
  sortFilterBar,
  pagination,
  totalProducts,
}: CategoryPageLayoutProps) => {
  return (
    <>
      <div className="px-10 flex gap-8 text-[12px]">
        {filters}
        <div className="w-full relative">
          {sortFilterBar && (
            <div className="sticky top-[52px] z-10 pt-4 bg-custom-yellow">
              {sortFilterBar}
            </div>
          )}

          {isLoading ? (
            <ProductLoading />
          ) : error ? (
            <div className="flex-1 flex justify-center items-center min-h-[300px]">
              <p>Error loading products. Please try again later.</p>
            </div>
          ) : totalProducts === 0 ? (
            <div className="flex-1 flex flex-col gap-4 justify-center items-center min-h-[300px]">
              <p>{isEmpty}</p>
              <Link href={"/"}>
                <CtaButton text="return to home" onClick={() => {}} />
              </Link>
            </div>
          ) : (
            <>
              <ProductsSection products={products} />
              {pagination}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryPageLayout;
