"use client";

import React from "react";
import { usePathname } from "next/navigation";
import CategoryPageBanner from "./CategoryPageBanner";

const CategoryBannerClient = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Get the last segment as the current category/subcategory
  const currentName = pathSegments[pathSegments.length - 1];
  const pageTitle = currentName
    ? currentName.charAt(0).toUpperCase() + currentName.slice(1)
    : "Products";

  const description =
    pathSegments.length > 1
      ? "Explore our exclusive collection of accessories."
      : "Explore our exclusive collection.";

  return (
    <CategoryPageBanner
      title={pageTitle}
      description={description}
      isLoading={false}
    />
  );
};

export default CategoryBannerClient;
