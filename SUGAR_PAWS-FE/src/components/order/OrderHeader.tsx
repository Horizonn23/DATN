import React from "react";
import { useRouter } from "next/navigation";

interface OrderHeaderProps {
  orderId: number;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ orderId }) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Review Order #{orderId}
        </h1>
        <p className="text-gray-600 mt-1">
          Share your experience with the products you received
        </p>
      </div>
      <button
        onClick={() => router.push("/user/orders")}
        className="flex items-center gap-2 text-gray-600 hover:text-custom-wine transition-colors font-medium"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Orders
      </button>
    </div>
  );
};

export default OrderHeader;
