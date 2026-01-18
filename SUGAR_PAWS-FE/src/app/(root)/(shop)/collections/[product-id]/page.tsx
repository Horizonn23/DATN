/* eslint-disable prettier/prettier */
"use client";

import Breadcrumbs from "@/components/ui/BreadCrum";
import DefaultLoading from "@/components/loading/DefaultLoading";
import DeliveryInfo from "@/components/product/DeliveryInfo";
import ProductDescription from "@/components/product/ProductDescription";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductOptions from "@/components/product/ProductOptions";
import QuantityAddToCart from "@/components/product/QuantityAddToCart";
import ProductReviews from "@/components/product/rating/ProductReviews";
import { ImageDetail, ProductDetail } from "@/types/product";
import { useGetProductDetail } from "@/hooks/queries/useProducts";
import {
  useGetProductReviews,
  useGetProductReviewStats,
} from "@/hooks/queries/useReviews";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import LoginRequiredModal from "@/components/ui/LoginRequiredModal";
import { useAddProductToCart } from "@/hooks/queries/useCart";
import { showSuccessToast } from "@/components/ui/SuccessToast";
import { showErrorToast } from "@/components/ui/ErrorToast";
import { setSelectedItems } from "@/store/slices/cartSlice";
import { CartItem } from "@/types/cart";
import RelatedProducts from "@/components/product/RelatedProducts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fetchReviewsData = async (productId: string) => {
  // This function is now replaced by the useGetProductReviews hook
  // Keeping for backward compatibility but not used
  return [];
};

export default function ProductDetailPage() {
  const pathname = usePathname();
  const productId = (pathname ?? "").split("/").pop();
  const router = useRouter();
  const dispatch = useDispatch();

  const { getProductDetail } = useGetProductDetail(productId ?? "");
  const { data: product, isLoading, error } = getProductDetail;

  // Fetch reviews data using API
  const { data: reviews = [], isLoading: reviewsLoading } =
    useGetProductReviews(productId ?? "");
  const { data: reviewStats } = useGetProductReviewStats(productId ?? "");

  const [selectedImage, setSelectedImage] = useState<ImageDetail | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [optionErrors, setOptionErrors] = useState<{
    color?: string;
    size?: string;
    type?: string;
  }>({});
  const [selectedProductDetail, setSelectedProductDetail] =
    useState<ProductDetail | null>(null);
  const user = useSelector(selectUser);

  // Effect for initializing selected image
  useEffect(() => {
    if (product) {
      const images: ImageDetail[] = product.displayImage.map((url) => ({
        id: "NA",
        url: url.startsWith("//") ? "https:" + url : url,
      }));

      const productDetailImages: ImageDetail[] = product.productDetails
        ? (() => {
            const uniqueIds = new Set<string>();
            return product.productDetails
              .map((productDetail) => productDetail.image)
              .filter((image) => {
                if (!image || !image.id) return false;
                if (uniqueIds.has(String(image.id))) return false;
                uniqueIds.add(String(image.id));
                return true;
              });
          })()
        : [];

      if ([...images, ...productDetailImages].length > 0 && !selectedImage) {
        setSelectedImage([...images, ...productDetailImages][0]);
      }
    }
  }, [product, selectedImage]);

  useEffect(() => {
    if (product && product.productDetails) {
      const availableColors = Array.from(
        new Set(
          product.productDetails.map((detail) => detail.color).filter(Boolean)
        )
      );
      const availableSizes = Array.from(
        new Set(
          product.productDetails.map((detail) => detail.size).filter(Boolean)
        )
      );
      const availableTypes = Array.from(
        new Set(
          product.productDetails.map((detail) => detail.type).filter(Boolean)
        )
      );

      const hasRequiredColor = availableColors.length === 0 || selectedColor;
      const hasRequiredSize = availableSizes.length === 0 || selectedSize;
      const hasRequiredType = availableTypes.length === 0 || selectedType;

      if (hasRequiredColor && hasRequiredSize && hasRequiredType) {
        const matchingDetail = product.productDetails.find(
          (detail) =>
            (!availableColors.length || detail.color === selectedColor) &&
            (!availableSizes.length || detail.size === selectedSize) &&
            (!availableTypes.length || detail.type === selectedType)
        );

        setSelectedProductDetail(matchingDetail || null);
      } else {
        setSelectedProductDetail(null);
      }

      let bestMatch = null;

      if (selectedColor || selectedSize || selectedType) {
        const candidates = product.productDetails.filter((detail) => {
          const colorMatch =
            !selectedColor ||
            !availableColors.length ||
            detail.color === selectedColor;
          const sizeMatch =
            !selectedSize ||
            !availableSizes.length ||
            detail.size === selectedSize;
          const typeMatch =
            !selectedType ||
            !availableTypes.length ||
            detail.type === selectedType;

          return colorMatch && sizeMatch && typeMatch;
        });

        if (candidates.length > 0) {
          // If multiple candidates, prefer the one that matches more attributes
          bestMatch = candidates.reduce((best, current) => {
            const currentScore =
              (selectedColor && current.color === selectedColor ? 1 : 0) +
              (selectedSize && current.size === selectedSize ? 1 : 0) +
              (selectedType && current.type === selectedType ? 1 : 0);

            const bestScore =
              (selectedColor && best.color === selectedColor ? 1 : 0) +
              (selectedSize && best.size === selectedSize ? 1 : 0) +
              (selectedType && best.type === selectedType ? 1 : 0);

            return currentScore > bestScore ? current : best;
          });
        }
      }

      // Update selected image if a matching product detail is found and has an image
      if (bestMatch && bestMatch.image) {
        setSelectedImage(bestMatch.image);
      }
    }
  }, [product, selectedColor, selectedSize, selectedType]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Clear color error when user selects a color
    if (optionErrors.color) {
      setOptionErrors((prev) => ({ ...prev, color: undefined }));
    }
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Clear size error when user selects a size
    if (optionErrors.size) {
      setOptionErrors((prev) => ({ ...prev, size: undefined }));
    }
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    // Clear type error when user selects a type
    if (optionErrors.type) {
      setOptionErrors((prev) => ({ ...prev, type: undefined }));
    }
  };
  const handleDecrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrementQuantity = () => setQuantity((q) => q + 1);
  const handleQuantityChange = (newQuantity: number) =>
    setQuantity(newQuantity);

  // Import hook for adding to cart
  const { addProductToCart } = useAddProductToCart();

  const handleAddToCart = async () => {
    if (!product) return;

    if (!user || !user.username) {
      setIsLoginModalOpen(true);
      return;
    }

    // Clear previous errors
    setOptionErrors({});

    // Check if product has multiple productDetails, then validation is required
    const hasMultipleDetails =
      product.productDetails && product.productDetails.length > 1;

    if (hasMultipleDetails) {
      const errors: { color?: string; size?: string; type?: string } = {};

      // Get available options from productDetails
      const availableColors = Array.from(
        new Set(
          product.productDetails!.map((detail) => detail.color).filter(Boolean)
        )
      );
      const availableSizes = Array.from(
        new Set(
          product.productDetails!.map((detail) => detail.size).filter(Boolean)
        )
      );
      const availableTypes = Array.from(
        new Set(
          product.productDetails!.map((detail) => detail.type).filter(Boolean)
        )
      );

      // Validate required selections
      if (availableColors.length > 0 && !selectedColor) {
        errors.color = "Please select a color";
      }

      if (availableSizes.length > 0 && !selectedSize) {
        errors.size = "Please select a size";
      }

      if (availableTypes.length > 0 && !selectedType) {
        errors.type = "Please select a type";
      }

      // If there are validation errors, show them and return
      if (Object.keys(errors).length > 0) {
        setOptionErrors(errors);
        return;
      }
    }

    try {
      const selectedProductDetail = product.productDetails?.find(
        (detail) =>
          (!selectedColor || detail.color === selectedColor) &&
          (!selectedSize || detail.size === selectedSize) &&
          (!selectedType || detail.type === selectedType)
      );

      if (!selectedProductDetail) {
        showErrorToast("No product available with selected options");
        return;
      }

      await addProductToCart(selectedProductDetail.id, quantity);
      showSuccessToast(`${product.name} added to cart successfully!`);
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        showErrorToast(error.message as string);
      } else console.log(error);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    if (!user || !user.username) {
      setIsLoginModalOpen(true);
      return;
    }

    // Clear previous errors
    setOptionErrors({});

    // Check if product has multiple productDetails, then validation is required
    const hasMultipleDetails =
      product.productDetails && product.productDetails.length > 1;

    if (hasMultipleDetails) {
      const errors: { color?: string; size?: string; type?: string } = {};

      // Get available options from productDetails
      const availableColors = Array.from(
        new Set(
          product.productDetails!.map((detail) => detail.color).filter(Boolean)
        )
      );
      const availableSizes = Array.from(
        new Set(
          product.productDetails!.map((detail) => detail.size).filter(Boolean)
        )
      );
      const availableTypes = Array.from(
        new Set(
          product.productDetails!.map((detail) => detail.type).filter(Boolean)
        )
      );

      // Validate required selections
      if (availableColors.length > 0 && !selectedColor) {
        errors.color = "Please select a color";
      }

      if (availableSizes.length > 0 && !selectedSize) {
        errors.size = "Please select a size";
      }

      if (availableTypes.length > 0 && !selectedType) {
        errors.type = "Please select a type";
      }

      // If there are validation errors, show them and return
      if (Object.keys(errors).length > 0) {
        setOptionErrors(errors);
        return;
      }
    }

    try {
      const selectedProductDetail = product.productDetails?.find(
        (detail) =>
          (!selectedColor || detail.color === selectedColor) &&
          (!selectedSize || detail.size === selectedSize) &&
          (!selectedType || detail.type === selectedType)
      );

      if (!selectedProductDetail) {
        showErrorToast("Please select all required options");
        return;
      }

      // Create a cart item for immediate checkout
      const cartItem: CartItem = {
        id: Date.now(),
        productDetail: { ...selectedProductDetail, name: product.name },
        quantity: quantity,
      };

      // Set this item as selected for checkout
      dispatch(setSelectedItems([cartItem]));

      // Navigate to checkout page
      router.push("/checkout");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        showErrorToast(error.message as string);
      } else {
        console.log(error);
        showErrorToast("An error occurred. Please try again.");
      }
    }
  };

  if (isLoading || reviewsLoading) return <DefaultLoading />;
  if (error) {
    return (
      <div className="container mx-auto text-center py-20 text-red-600">
        {error.message || "An error occurred while loading the product"}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto text-center py-20">
        Product not found.
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/collections" },
    { name: product.name },
  ];

  const images: ImageDetail[] = product.displayImage.map((url) => ({
    id: "NA",
    url: url.startsWith("//") ? "https:" + url : url,
  }));

  const productDetailImages: ImageDetail[] = product.productDetails
    ? (() => {
        const uniqueIds = new Set<string>();
        return product.productDetails
          .map((productDetail) => productDetail.image)
          .filter((image) => {
            // Skip images without an ID
            if (!image || !image.id) return false;
            // Only keep if this ID hasn't been seen yet
            if (uniqueIds.has(String(image.id))) return false;
            uniqueIds.add(String(image.id));
            return true;
          });
      })()
    : [];

  return (
    <div className="container mx-auto px-4 md:px-[10%] lg:px-[15%] py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <ProductImageGallery
          images={[...images, ...productDetailImages]}
          selectedImage={selectedImage}
          onThumbnailClick={setSelectedImage}
          productTitle={product.name}
        />

        <div className="flex flex-col gap-5">
          <ProductInfo
            product={product}
            selectedProductDetail={selectedProductDetail}
          />
          <ProductOptions
            colors={product.colors}
            sizes={
              product.productDetails
                ? Array.from(
                    new Set(
                      product.productDetails
                        .map((detail) => detail.size)
                        .filter((size): size is string => Boolean(size))
                    )
                  )
                : []
            }
            types={
              product.productDetails
                ? Array.from(
                    new Set(
                      product.productDetails
                        .map((detail) => detail.type)
                        .filter((type): type is string => Boolean(type))
                    )
                  )
                : []
            }
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedType={selectedType}
            onColorSelect={handleColorSelect}
            onSizeSelect={handleSizeSelect}
            onTypeSelect={handleTypeSelect}
            productDetails={product.productDetails}
            errors={optionErrors}
          />
          <QuantityAddToCart
            quantity={quantity}
            onDecrement={handleDecrementQuantity}
            onIncrement={handleIncrementQuantity}
            onQuantityChange={handleQuantityChange}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
          <DeliveryInfo />
        </div>
      </div>

      <div id="reviews-section" className="border-t border-gray-200 pt-8">
        <div className="flex justify-center border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-150 focus:outline-none ${
              activeTab === "description"
                ? "border-b-2 border-custom-rose text-custom-rose"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 text-sm font-medium transition-colors duration-150 focus:outline-none ${
              activeTab === "reviews"
                ? "border-b-2 border-custom-rose text-custom-rose"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Reviews ({reviewStats?.totalReviews ?? reviews.length})
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "description" ? (
            <ProductDescription description={product.description} />
          ) : (
            <ProductReviews
              productRating={reviewStats?.averageRating ?? product.rating ?? 5}
              reviews={reviews}
              totalReviews={reviewStats?.totalReviews}
              ratingDistribution={reviewStats?.ratingDistribution}
            />
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <RelatedProducts productId={productId ?? ""} className="mt-12 mb-8" />

      <LoginRequiredModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        message="You need to sign in to add products to your cart"
      />
    </div>
  );
}
