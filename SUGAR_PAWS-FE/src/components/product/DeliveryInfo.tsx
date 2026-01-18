import React from "react";
import { FiTruck, FiRefreshCw } from "react-icons/fi";

const DeliveryInfo: React.FC = () => {
  return (
    <div className="pt-4 mt-6 space-y-3 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <FiTruck className="text-gray-500 flex-shrink-0" size={18} />
        <p>
          <span className="font-medium text-gray-800">Free Delivery</span> —{" "}
          <button className="text-custom-rose hover:underline focus:outline-none">
            Enter your Postal code
          </button>{" "}
          for Delivery Availability
        </p>
      </div>
      <div className="flex items-center gap-2">
        <FiRefreshCw className="text-gray-500 flex-shrink-0" size={18} />
        <p>
          <span className="font-medium text-gray-800">Return Delivery</span> —
          Free 30 days Delivery Return.{" "}
          <button className="text-custom-rose hover:underline focus:outline-none">
            Details
          </button>
        </p>
      </div>
    </div>
  );
};

export default DeliveryInfo;
