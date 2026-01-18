import React, { useState } from "react";
import CheckoutSectionHeader from "./CheckoutSectionHeader";
import VoucherModal from "./VoucherModal";
import { useCheckoutContext } from "@/provider/CheckoutProvider";
import { useActiveVouchers } from "@/hooks/queries/useVoucher";
import { useCalculateOrderTotal } from "@/hooks/queries/useOrder";
import { CartItem } from "@/types/cart";
import { Voucher } from "@/types/order";
import { showErrorToast } from "@/components/ui/ErrorToast";
import { showSuccessToast } from "@/components/ui/SuccessToast";

interface CheckoutVoucherProps {
  selectedItems: CartItem[];
  selectedAddressId: number | null;
}

const CheckoutVoucher: React.FC<CheckoutVoucherProps> = ({
  selectedItems,
  selectedAddressId,
}) => {
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const {
    voucherCode,
    setVoucherCode,
    selectedVoucher,
    setSelectedVoucher,
    setOrderCalculation,
    isApplyingVoucher,
    setIsApplyingVoucher,
  } = useCheckoutContext();

  const { data: activeVouchers, isLoading: loadingVouchers } =
    useActiveVouchers();
  const calculateTotalMutation = useCalculateOrderTotal();

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      showErrorToast("Please enter a voucher code");
      return;
    }

    if (!selectedAddressId) {
      showErrorToast("Please select a shipping address first");
      return;
    }

    setIsApplyingVoucher(true);

    try {
      // Calculate total with voucher
      const orderItems = selectedItems.map((item) => ({
        productDetailId: item.productDetail.id,
        quantity: item.quantity,
      }));

      const result = await calculateTotalMutation.mutateAsync({
        orderItems,
        shippingAddressId: selectedAddressId,
        voucherCode: voucherCode.trim(),
      });

      if (result.voucher) {
        setSelectedVoucher(result.voucher);
        setOrderCalculation(result);
        showSuccessToast(
          `Voucher applied! You saved ${result.discountAmount.toLocaleString(
            "en-US",
            {
              style: "currency",
              currency: "VND",
            },
          )}`,
        );
      } else {
        showErrorToast("Voucher is not valid for this order");
      }
    } catch (error) {
      console.error("Failed to apply voucher:", error);
      showErrorToast("Failed to apply voucher. Please try again.");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = async () => {
    if (!selectedAddressId) return;

    try {
      // Recalculate without voucher
      const orderItems = selectedItems.map((item) => ({
        productDetailId: item.productDetail.id,
        quantity: item.quantity,
      }));

      const result = await calculateTotalMutation.mutateAsync({
        orderItems,
        shippingAddressId: selectedAddressId,
      });

      setSelectedVoucher(null);
      setVoucherCode("");
      setOrderCalculation(result);
      showSuccessToast("Voucher removed");
    } catch (error) {
      console.error("Failed to remove voucher:", error);
      showErrorToast("Failed to remove voucher");
    }
  };

  const handleSelectVoucher = async (voucher: Voucher) => {
    setVoucherCode(voucher.code);
    setShowVoucherModal(false); // Close modal after selection

    // Auto-apply the selected voucher
    if (!selectedAddressId) {
      showErrorToast("Please select a shipping address first");
      return;
    }

    setIsApplyingVoucher(true);

    try {
      // Calculate total with the selected voucher
      const orderItems = selectedItems.map((item) => ({
        productDetailId: item.productDetail.id,
        quantity: item.quantity,
      }));

      const result = await calculateTotalMutation.mutateAsync({
        orderItems,
        shippingAddressId: selectedAddressId,
        voucherCode: voucher.code,
      });

      if (result.voucher) {
        setSelectedVoucher(result.voucher);
        setOrderCalculation(result);
        showSuccessToast(
          `Voucher applied! You saved ${result.discountAmount.toLocaleString(
            "en-US",
            {
              style: "currency",
              currency: "VND",
            },
          )}`,
        );
      } else {
        showErrorToast("Voucher is not valid for this order");
      }
    } catch (error) {
      console.error("Failed to apply voucher:", error);
      showErrorToast("Failed to apply voucher. Please try again.");
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <CheckoutSectionHeader
        icon="🎫"
        title="Voucher & Discounts"
        gradient="from-custom-rose to-custom-pink"
      />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Applied Voucher Display */}
        {selectedVoucher && (
          <div
            className={`rounded-lg p-3 ${
              selectedVoucher.type === "SHIPPING"
                ? "bg-blue-50 border border-blue-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`${
                    selectedVoucher.type === "SHIPPING"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {selectedVoucher.type === "SHIPPING" ? "🚚" : "✅"}
                </span>
                <div>
                  <div
                    className={`font-medium ${
                      selectedVoucher.type === "SHIPPING"
                        ? "text-blue-800"
                        : "text-green-800"
                    }`}
                  >
                    {selectedVoucher.name}
                  </div>
                  <div
                    className={`text-sm ${
                      selectedVoucher.type === "SHIPPING"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    Code: {selectedVoucher.code} •{" "}
                    {selectedVoucher.type === "SHIPPING"
                      ? "Free Shipping"
                      : "Discount Voucher"}
                  </div>
                </div>
              </div>
              <button
                onClick={handleRemoveVoucher}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Voucher Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-custom-dark">
            Enter voucher code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Enter your voucher code"
              className="flex-1 px-3 py-2 border border-custom-pink/50 rounded-lg focus:ring-2 focus:ring-custom-rose focus:border-custom-rose transition-colors text-sm"
              disabled={isApplyingVoucher}
            />
            <button
              onClick={handleApplyVoucher}
              disabled={!voucherCode.trim() || isApplyingVoucher}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                !voucherCode.trim() || isApplyingVoucher
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-custom-wine hover:bg-custom-wine/90 text-white shadow-md hover:shadow-lg"
              }`}
            >
              {isApplyingVoucher ? "Applying..." : "Apply"}
            </button>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-custom-dark">Available Vouchers</h4>
            <button
              onClick={() => setShowVoucherModal(true)}
              className="text-custom-wine hover:text-custom-rose text-sm font-medium"
            >
              View All
            </button>
          </div>

          {/* Compact Scrollable Voucher List */}
          <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
            {loadingVouchers ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-custom-rose mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">
                  Loading vouchers...
                </p>
              </div>
            ) : activeVouchers && activeVouchers.length > 0 ? (
              activeVouchers.slice(0, 3).map((voucher) => (
                <div
                  key={voucher.id}
                  className={`flex items-center justify-between p-3 bg-gradient-to-r ${
                    voucher.type === "SHIPPING"
                      ? "from-blue-50 to-purple-50 border-blue-200"
                      : "from-yellow-50 to-orange-50 border-yellow-200"
                  } border rounded-lg transition-colors ${
                    isApplyingVoucher
                      ? "cursor-not-allowed opacity-60"
                      : voucher.type === "SHIPPING"
                        ? "hover:border-blue-300 cursor-pointer"
                        : "hover:border-orange-300 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (!isApplyingVoucher) {
                      handleSelectVoucher(voucher);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        voucher.type === "SHIPPING"
                          ? "bg-gradient-to-br from-blue-500 to-purple-500"
                          : "bg-gradient-to-br from-yellow-500 to-orange-500"
                      }`}
                    >
                      <span className="text-white text-sm font-bold">
                        {voucher.type === "SHIPPING" ? "🚚" : "%"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">
                        {voucher.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {voucher.description || voucher.code}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectVoucher(voucher);
                    }}
                    disabled={isApplyingVoucher}
                    className={`text-sm font-medium transition-colors ${
                      isApplyingVoucher
                        ? "text-gray-400 cursor-not-allowed"
                        : voucher.type === "SHIPPING"
                          ? "text-blue-600 hover:text-blue-700"
                          : "text-orange-500 hover:text-orange-600"
                    }`}
                  >
                    {isApplyingVoucher ? "Applying..." : "Apply"}
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No vouchers available</p>
              </div>
            )}

            {/* Show "View All" hint if there are more vouchers */}
            {activeVouchers && activeVouchers.length > 3 && (
              <div className="text-center py-2">
                <button
                  onClick={() => setShowVoucherModal(true)}
                  className="text-custom-wine hover:text-custom-rose text-sm font-medium"
                >
                  +{activeVouchers.length - 3} more vouchers
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reward Points */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600">💎</span>
            <span className="font-medium text-blue-800">Reward Points</span>
          </div>
          <div className="text-sm text-blue-600">
            You have <span className="font-bold">0 points</span> available
          </div>
          <div className="text-xs text-blue-500 mt-1">
            Points cannot be used for this order
          </div>
        </div>
      </div>

      <VoucherModal
        isOpen={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        vouchers={activeVouchers}
        isLoading={loadingVouchers}
        onSelectVoucher={handleSelectVoucher}
        isApplyingVoucher={isApplyingVoucher}
      />
    </div>
  );
};

export default CheckoutVoucher;
