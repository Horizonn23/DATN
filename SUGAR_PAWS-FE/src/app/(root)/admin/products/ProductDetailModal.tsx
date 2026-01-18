import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { Product, ImageDetail } from "@/types/product";
import ProductDescription from "@/components/product/ProductDescription";
import ProductImageGallery from "@/components/product/ProductImageGallery";

interface PreviewProductProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

const PreviewProduct: React.FC<PreviewProductProps> = ({
  product,
  open,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<ImageDetail | null>(null);

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
      const allImages = [...images, ...productDetailImages];
      setSelectedImage(allImages[0] || null);
    }
  }, [product]);

  if (!product) return null;

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
  const allImages = [...images, ...productDetailImages];

  return (
    <Modal open={open} onClose={onClose} width="1200px">
      <div className="container mx-auto px-4 md:px-[10%] lg:px-[15%] py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery giống trang [product-id] */}
          <div>
            <ProductImageGallery
              images={allImages}
              selectedImage={selectedImage}
              onThumbnailClick={setSelectedImage}
              productTitle={product.name}
            />
          </div>
          {/* Product Info */}
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-custom-wine mb-2">
              {product.name}
            </h2>
            <div className="flex flex-wrap gap-4 items-center text-lg font-semibold">
              <span className="text-custom-rose">
                {product.minPrice.toLocaleString()}₫
              </span>
              {product.maxPrice !== product.minPrice && (
                <span className="text-gray-400 line-through">
                  {product.maxPrice.toLocaleString()}₫
                </span>
              )}
              {product.discount ? (
                <span className="text-green-600 font-medium">
                  -{product.discount}% OFF
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>
                Stock: <b>{product.totalStock}</b>
              </span>
              <span>
                Sold: <b>{product.totalSales ?? 0}</b>
              </span>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {product.colors && product.colors.length > 0 && (
                <>
                  <span className="font-semibold text-custom-wine">
                    Colors:
                  </span>
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="w-6 h-6 rounded-full border border-gray-300 inline-block"
                      style={{ background: color }}
                      title={color}
                    ></span>
                  ))}
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {product.productDetails && (
                <>
                  <span className="font-semibold text-custom-wine">Sizes:</span>
                  {Array.from(
                    new Set(
                      product.productDetails.map((d) => d.size).filter(Boolean),
                    ),
                  ).map((size) => (
                    <span
                      key={size as string}
                      className="px-2 py-1 border rounded text-xs bg-gray-50 border-gray-300"
                    >
                      {size}
                    </span>
                  ))}
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {product.productDetails &&
                Array.from(
                  new Set(
                    product.productDetails.map((d) => d.type).filter(Boolean),
                  ),
                ).length > 0 && (
                  <>
                    <span className="font-semibold text-custom-wine">
                      Types:
                    </span>
                    {Array.from(
                      new Set(
                        product.productDetails
                          .map((d) => d.type)
                          .filter(Boolean),
                      ),
                    ).map((type) => (
                      <span
                        key={type as string}
                        className="px-2 py-1 border rounded text-xs bg-gray-50 border-gray-300"
                      >
                        {type}
                      </span>
                    ))}
                  </>
                )}
            </div>
            {/* Description section giống trang [product-id] */}
            {product.description && (
              <div className="w-full mt-4">
                <ProductDescription description={product.description} />
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PreviewProduct;
