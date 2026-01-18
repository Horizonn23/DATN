import React from "react";
import { useRouter } from "next/navigation";

const NotFoundState: React.FC = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <div className="flex flex-col items-center justify-center py-24">
        <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="40" fill="#F3F4F6" />
          <rect
            x="25"
            y="30"
            width="30"
            height="30"
            rx="4"
            fill="#fff"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          <path
            d="M35 40L45 40M35 46L42 46"
            stroke="#E5E7EB"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2 mt-6">
          Order Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The order you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <button
          onClick={() => router.push("/user/orders")}
          className="bg-custom-wine text-white px-6 py-3 rounded-lg hover:bg-custom-wine/90 transition-colors font-medium"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default NotFoundState;
