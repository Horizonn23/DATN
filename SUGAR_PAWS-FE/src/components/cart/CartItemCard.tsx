// components/CartItemCard.tsx
import { formatCurrency } from "@/helper/renderNumber";
import { CartItem } from "@/types/cart";
import Image from "next/image";
import { useImageSrc } from "@/hooks/useImageSrc";

type Props = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  const imageSrc = useImageSrc(
    item.productDetail?.image?.url ??
      (item.productDetail?.displayImage &&
      item.productDetail?.displayImage?.length > 0
        ? item.productDetail?.displayImage[0]
        : null),
  );

  return (
    <div className="flex gap-6 py-4 border-b text-[12px] text-custom-dark items-stretch">
      <div className="w-[112px] min-h-[112px] relative aspect-square">
        {item.productDetail?.image?.url || item.productDetail?.displayImage ? (
          <Image
            src={imageSrc}
            alt={item.productDetail?.name ?? ""}
            fill
            sizes="112px"
            className="rounded-md object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-md text-center p-1 text-[10px] text-gray-500">
            This product doesn&apos;t have a preview
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-between gap-1">
        <h3 className="text-[13px]">{item.productDetail.name ?? ""}</h3>

        <div className="flex flex-col gap-2">
          <div className="text-gray-600">
            {item.productDetail.color && (
              <p>
                <span className="font-semi">Color:</span>{" "}
                {item.productDetail.color}
              </p>
            )}
            {item.productDetail.size && (
              <p>
                <span className="font-semi">Size:</span>{" "}
                {item.productDetail.size}
              </p>
            )}
            {item.productDetail.type && (
              <p>
                <span className="font-semi">Type:</span>{" "}
                {item.productDetail.type}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center border border-[#D9D9D9] rounded-md overflow-hidden">
            <button
              onClick={onIncrease}
              className="px-3 py-1 hover:bg-gray-100 border-r border-[#D9D9D9] text-md"
            >
              +
            </button>
            <span className="px-4">{item.quantity}</span>
            <button
              onClick={onDecrease}
              className="px-3 py-1 hover:bg-gray-100 border-l border-[#D9D9D9] text-md"
            >
              -
            </button>
          </div>

          <button
            onClick={onRemove}
            className="text-custom-wine font-medium hover:underline"
          >
            Remove
          </button>
        </div>

        <p className="text-custom-wine font-semibold">
          {formatCurrency(item.productDetail.price)} VND
        </p>
      </div>
    </div>
  );
}
