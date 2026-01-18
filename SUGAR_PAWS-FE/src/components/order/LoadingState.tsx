import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 max-w-4xl py-8">
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-wine"></div>
          <p className="text-gray-600 mt-2">Loading order details...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
