import React from "react";
import { Spinner } from "@/components/ui/Spinner";
import { useCalculateShippingFee } from "@/hooks/queries/useOrder";
import CheckoutSectionHeader from "./CheckoutSectionHeader";

interface CheckoutShippingProps {
  addressId: number | null;
}

const CheckoutShipping: React.FC<CheckoutShippingProps> = ({ addressId }) => {
  const { data: shippingFeeData, isLoading } = useCalculateShippingFee(
    addressId || 0,
  );

  const today = new Date();
  const deliveryStart = new Date(today);
  deliveryStart.setDate(today.getDate() + 2);
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(today.getDate() + 4);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <CheckoutSectionHeader
        icon="🚚"
        title="Shipping Method"
        gradient="from-custom-rose to-custom-pink"
      />

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          <div className="border-2 border-custom-pink/50 bg-custom-yellow/30 rounded-lg p-3 relative">
            <div className="absolute top-2 right-2">
              <span className="bg-custom-rose text-white px-2 py-1 rounded-full text-xs font-semibold">
                Recommended
              </span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-custom-wine rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">⚡</span>
                </div>
                <div>
                  <div className="font-bold text-custom-dark">
                    Express Delivery
                  </div>
                  <div className="text-sm text-custom-purple">
                    Fastest delivery option
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-lg p-3 border border-custom-pink/30">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-custom-wine">📅</span>
                  <span className="font-medium text-custom-dark">
                    Estimated Delivery
                  </span>
                </div>
                <div className="text-right">
                  {isLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    <div className="font-bold text-custom-wine text-lg">
                      {shippingFeeData?.shippingFee
                        ? shippingFeeData.shippingFee.toLocaleString("en-US", {
                            style: "currency",
                            currency: "VND",
                          })
                        : "Free"}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-sm text-custom-purple">
                <span className="font-semibold text-custom-wine">
                  {formatDate(deliveryStart)} - {formatDate(deliveryEnd)}
                </span>
              </div>
              <div className="text-xs text-custom-purple mt-1">
                Business days only, excluding weekends and holidays
              </div>
            </div>
          </div>

          {/* Alternative Options */}
          <div className="border border-gray-200 rounded-lg p-4 opacity-75">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white">📦</span>
                </div>
                <div>
                  <div className="font-medium text-gray-600">
                    Standard Delivery
                  </div>
                  <div className="text-sm text-gray-500">5-7 business days</div>
                </div>
              </div>
              <div className="text-gray-500 text-sm">Currently unavailable</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutShipping;
