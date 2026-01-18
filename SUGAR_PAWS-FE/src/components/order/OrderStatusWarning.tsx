import React from "react";

const OrderStatusWarning: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg
            className="w-4 h-4 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="font-medium text-amber-800 mb-1">
            Reviews not available yet
          </h3>
          <p className="text-amber-700 text-sm">
            Reviews are only available for completed orders. Please wait until
            your order is marked as completed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusWarning;
