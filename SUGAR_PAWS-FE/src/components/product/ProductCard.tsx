import React, { useState } from "react";
import { Product } from "@/types/product";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FiShoppingCart } from "react-icons/fi";
import Modal from "../ui/Modal";
import Link from "next/link";
import { getColorCode } from "@/helper/colorHelper";
import { useAddProductToCart } from "@/hooks/queries/useCart";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import LoginRequiredModal from "../ui/LoginRequiredModal";
import { showSuccessToast } from "../ui/SuccessToast";
import { showErrorToast } from "../ui/ErrorToast";
import ProductOptionsSelector from "./ProductOptionsSelector";
import { useImageSrc } from "@/hooks/useImageSrc";

// Component để xử lý product images với protocol-relative URLs
const ProductImage: React.FC<{
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}> = ({ src, alt, fill, sizes, className, style, priority }) => {
  const imageSrc = useImageSrc(src);
  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      style={style}
      priority={priority}
    />
  );
};

type ProductCardProps = {
  product: Product;
};

const renderColorButton = (color: string, className: string = "") => {
  const colorCode = getColorCode(color);
  let backgroundStyle: string;

  if (Array.isArray(colorCode) && colorCode.length === 2) {
    backgroundStyle = `linear-gradient(to bottom right, ${colorCode[0]} 50%, ${colorCode[1]} 50%)`;
  } else {
    backgroundStyle =
      typeof colorCode === "string"
        ? colorCode
        : (colorCode && colorCode[0]) || "transparent";
  }

  return (
    <div
      className={`rounded-full border border-gray-300 ${className}`}
      style={{ background: backgroundStyle }}
    />
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    id,
    name,
    minPrice,
    maxPrice,
    displayImage,
    colors,
    discount,
    totalStock,
    totalSales,
    sizes,
    types,
    reviewStars,
  } = product;

  const [hovered, setHovered] = useState<boolean>(false);
  const [buttonHovered, setButtonHovered] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { addProductToCart: addToCart } = useAddProductToCart();
  const user = useSelector(selectUser);

  const handleAddToCartClick = () => {
    if (!user || !user.username) {
      setIsLoginModalOpen(true);
      return;
    }

    // If no color, size, and type selection required, add to cart directly
    if (
      (!colors || colors.length === 0) &&
      (!sizes || sizes.length === 0) &&
      (!types || types.length === 0)
    ) {
      if (product.productDetails && product.productDetails.length > 0) {
        const productDetail = product.productDetails[0];
        addToCart(productDetail.id, 1);
        showSuccessToast(`${product.name} added to cart!`);
        return;
      }
    }

    setIsModalOpen(true);
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedType(null);
    setValidationError(null);
    // Set initial preview image - useImageSrc will handle protocol conversion
    setPreviewImage(displayImage[0]);
  };

  const updatePreviewImage = (
    color?: string | null,
    size?: string | null,
    type?: string | null,
  ) => {
    if (product.productDetails && product.productDetails.length > 0) {
      // Get available options from productDetails
      const availableColors = Array.from(
        new Set(
          product.productDetails.map((detail) => detail.color).filter(Boolean),
        ),
      );
      const availableSizes = Array.from(
        new Set(
          product.productDetails.map((detail) => detail.size).filter(Boolean),
        ),
      );
      const availableTypes = Array.from(
        new Set(
          product.productDetails.map((detail) => detail.type).filter(Boolean),
        ),
      );

      // Find best matching detail even with partial selections
      let bestMatch = null;

      // If we have any selections, try to find the best match
      if (color || size || type) {
        const candidates = product.productDetails.filter((detail) => {
          const colorMatch =
            !color || !availableColors.length || detail.color === color;
          const sizeMatch =
            !size || !availableSizes.length || detail.size === size;
          const typeMatch =
            !type || !availableTypes.length || detail.type === type;

          return colorMatch && sizeMatch && typeMatch;
        });

        if (candidates.length > 0) {
          // If multiple candidates, prefer the one that matches more attributes
          bestMatch = candidates.reduce((best, current) => {
            const currentScore =
              (color && current.color === color ? 1 : 0) +
              (size && current.size === size ? 1 : 0) +
              (type && current.type === type ? 1 : 0);

            const bestScore =
              (color && best.color === color ? 1 : 0) +
              (size && best.size === size ? 1 : 0) +
              (type && best.type === type ? 1 : 0);

            return currentScore > bestScore ? current : best;
          });
        }
      } else {
        // If no selections, use the first product detail
        bestMatch = product.productDetails[0];
      }

      if (bestMatch && bestMatch.image) {
        // useImageSrc will handle protocol conversion in the component
        setPreviewImage(bestMatch.image.url);
      } else {
        // Fallback to display image - useImageSrc will handle protocol conversion
        setPreviewImage(displayImage[0]);
      }
    }
  };

  const addProductToCart = () => {
    // Check if product has multiple productDetails, then validation is required
    const hasMultipleDetails =
      product.productDetails && product.productDetails.length > 1;

    if (hasMultipleDetails) {
      // Validate selections for products with multiple details
      if (colors.length > 0 && !selectedColor) {
        setValidationError("Please select a color");
        return;
      }

      if (sizes && sizes.length > 0 && !selectedSize) {
        setValidationError("Please select a size");
        return;
      }

      if (types && types.length > 0 && !selectedType) {
        setValidationError("Please select a type");
        return;
      }
    }

    setValidationError(null);
    const quantity = 1;

    try {
      if (product.productDetails && product.productDetails.length > 0) {
        const productDetail = product.productDetails.find(
          (detail) =>
            (!selectedColor || detail.color === selectedColor) &&
            (!selectedSize || detail.size === selectedSize) &&
            (!selectedType || detail.type === selectedType),
        );

        if (!productDetail) {
          setValidationError("No product available with selected options");
          return;
        }
        addToCart(productDetail.id, quantity);
        showSuccessToast(`${product.name} added to cart!`);

        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      setValidationError("Failed to add product to cart");
      showErrorToast("Failed to add product to cart");
    }
  };

  const finalMinPrice = discount ? minPrice * (1 - discount / 100) : minPrice;
  const finalMaxPrice = discount ? maxPrice * (1 - discount / 100) : maxPrice;

  return (
    <div className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-3 bg-white w-full text-[12px] leading-[1.4] relative">
      <div
        className="relative w-full mb-3 rounded-xl overflow-hidden group aspect-square"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Primary image */}
        <ProductImage
          src={displayImage[0]}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
          className="object-cover transition-opacity duration-500"
          style={{ opacity: hovered && displayImage[1] ? 0 : 1 }}
          priority
        />
        {/* Hover image - only rendered if it exists */}
        {displayImage[1] && (
          <ProductImage
            src={displayImage[1]}
            alt={`${name} - hover view`}
            fill
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
            className="object-cover transition-opacity duration-300"
            style={{ opacity: hovered ? 1 : 0 }}
            priority
          />
        )}

        <div className="absolute bottom-2 right-2 group">
          <button
            className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full bg-custom-rose text-white 
            transition-all duration-300 hover:w-32 hover:gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 
            hover:flex hover:justify-center"
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            onClick={handleAddToCartClick}
          >
            <FiShoppingCart size={20} />
            <span
              className={`text-[12px] whitespace-nowrap transition-all duration-300 ease-in-out
              ${
                buttonHovered
                  ? "opacity-100 max-w-[100px] translate-x-0"
                  : "opacity-0 max-w-0 -translate-x-2"
              }`}
            >
              ADD TO CART
            </span>
          </button>
        </div>
      </div>

      <Modal
        onClose={() => setIsModalOpen(false)}
        size="large"
        open={isModalOpen}
      >
        <ProductOptionsSelector
          name={name}
          sizes={sizes}
          colors={colors}
          types={types}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          selectedType={selectedType}
          validationError={validationError}
          previewImage={previewImage}
          onSizeSelect={(size) => {
            setSelectedSize(size);
            updatePreviewImage(selectedColor, size, selectedType);
          }}
          onColorSelect={(color) => {
            setSelectedColor(color);
            updatePreviewImage(color, selectedSize, selectedType);
          }}
          onTypeSelect={(type) => {
            setSelectedType(type);
            updatePreviewImage(selectedColor, selectedSize, type);
          }}
          onAddToCart={addProductToCart}
          productDetails={product.productDetails}
        />
      </Modal>

      <Link
        className="font-semibold text-gray-800 line-clamp-2 mb-2 hover:text-custom-rose transition-all duration-300"
        href={`/collections/${id}`}
      >
        {name}
      </Link>

      {!totalStock && (
        <div className="text-sm font-medium mb-2 text-red-600">
          OUT OF STOCK
        </div>
      )}

      <div className="flex items-center flex-wrap gap-1 mb-2">
        {colors.map((color, idx) => (
          <div key={idx} title={color} className="w-4 h-4">
            {renderColorButton(color, "w-full h-full")}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        {discount ? (
          <div className="flex flex-col">
            <span className="text-gray-400 line-through">
              {minPrice === maxPrice
                ? `${minPrice.toLocaleString()}₫`
                : `${minPrice.toLocaleString()}₫ - ${maxPrice.toLocaleString()}₫`}
            </span>
            <span className="text-red-500 font-semibold">
              {finalMinPrice === finalMaxPrice
                ? `${finalMinPrice.toLocaleString()}₫`
                : `${finalMinPrice.toLocaleString()}₫ - ${finalMaxPrice.toLocaleString()}₫`}
            </span>
          </div>
        ) : (
          <span className="text-gray-800 font-semibold">
            {minPrice === maxPrice
              ? `${minPrice.toLocaleString()}₫`
              : `${minPrice.toLocaleString()}₫ - ${maxPrice.toLocaleString()}₫`}
          </span>
        )}
        {discount && (
          <span className="text-green-600 font-medium whitespace-nowrap">
            -{discount}% OFF
          </span>
        )}
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex justify-between text-gray-500 text-[11px]">
        <span className="text-yellow-500 font-medium">
          {reviewStars}
          <FontAwesomeIcon icon={faStar} />
        </span>
        {totalSales !== undefined && (
          <span>{totalSales.toLocaleString()} sold</span>
        )}
      </div>

      {/* Login Required Modal */}
      <LoginRequiredModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        message="You need to sign in to add products to your cart"
      />
    </div>
  );
};

export default ProductCard;
