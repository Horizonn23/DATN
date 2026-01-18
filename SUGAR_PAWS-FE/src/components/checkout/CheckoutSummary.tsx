import React from "react";
import { CartItem } from "@/types/cart";
import { useCreateOrder } from "@/hooks/queries/useOrder";
import { CreateOrderDto, CreateOrderItemDto } from "@/api/service/orderService";
import { PaymentMethod } from "@/types/payment";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import { showSuccessToast } from "@/components/ui/SuccessToast";
import { showErrorToast } from "@/components/ui/ErrorToast";
import CheckoutSectionHeader from "./CheckoutSectionHeader";
import CtaButton from "@/components/ui/CtaButton";
import { useCheckoutContext } from "@/provider/CheckoutProvider";

interface CheckoutSummaryProps {
  selectedItems: CartItem[];
  selectedAddressId: number | null;
  shippingFee: number;
  paymentMethod: PaymentMethod;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
  selectedItems,
  selectedAddressId,
  shippingFee,
  paymentMethod,
}) => {
  const router = useRouter();
  const createOrderMutation = useCreateOrder();
  const { selectedVoucher, voucherCode, orderCalculation } =
    useCheckoutContext();

  // Calculate subtotal
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.productDetail.price * item.quantity,
    0,
  );

  // Use order calculation if available (with voucher), otherwise use basic calculation
  const finalAmount = orderCalculation
    ? orderCalculation.finalAmount
    : subtotal + (shippingFee || 0);
  const discountAmount = orderCalculation?.discountAmount || 0;

  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      showErrorToast("Please select a shipping address");
      return;
    }

    if (selectedItems.length === 0) {
      showErrorToast("No items to checkout");
      return;
    }

    try {
      const orderItems: CreateOrderItemDto[] = selectedItems.map((item) => ({
        productDetailId: item.productDetail.id,
        quantity: item.quantity,
      }));

      const orderData: CreateOrderDto = {
        shippingAddressId: selectedAddressId,
        paymentMethod: paymentMethod,
        orderItems: orderItems,
        voucherCode: voucherCode || undefined, // Add voucher code if available
      };

      const result = await createOrderMutation.mutateAsync(orderData);

      showSuccessToast("Order created successfully!");

      if (result) {
        if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
          router.push(`/user/orders/${result.id}/qr-code`);
        } else {
          router.push(`/user/orders/${result.id}`);
        }
      } else {
        showErrorToast("Error retrieving order details");
      }
    } catch (error) {
      console.error("Failed to create order:", error);
      showErrorToast("Failed to create order. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <CheckoutSectionHeader
        icon="📋"
        title="Order Summary"
        gradient="from-custom-rose to-custom-pink"
      />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Order Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-custom-dark text-sm">
            <span className="font-medium">
              Subtotal ({selectedItems.length} items)
            </span>
            <span className="font-semibold">
              {subtotal.toLocaleString("en-US", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>

          <div className="flex justify-between items-center text-custom-dark text-sm">
            <span className="font-medium">Shipping Fee</span>
            <span className="font-semibold text-green-600">
              {shippingFee
                ? shippingFee.toLocaleString("en-US", {
                    style: "currency",
                    currency: "VND",
                  })
                : "Free"}
            </span>
          </div>

          {/* Discount Section */}
          {discountAmount > 0 && selectedVoucher && (
            <div className="flex justify-between items-center text-custom-dark text-sm">
              <span className="font-medium text-green-600">
                {selectedVoucher.type === "SHIPPING"
                  ? "Shipping Discount"
                  : "Product Discount"}{" "}
                ({selectedVoucher.code})
              </span>
              <span className="font-semibold text-green-600">
                -
                {discountAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          )}

          <div className="border-t border-custom-pink/30 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-custom-dark">
                Total Payment
              </span>
              <span className="text-xl font-bold text-custom-wine">
                {finalAmount.toLocaleString("en-US", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-700 font-medium">
              🔒 Secure checkout with SSL encryption
            </span>
          </div>
        </div>

        <CtaButton
          text="Place Order"
          onClick={handleCreateOrder}
          disabled={createOrderMutation.isPending || !selectedAddressId}
          isLoading={createOrderMutation.isPending}
          loadingText="Processing..."
          loadingIcon={<Spinner size="sm" />}
          className="w-full"
        />

        {/* Disclaimer */}
        <p className="text-xs text-custom-purple text-center leading-relaxed">
          By placing your order, you agree to our Terms of Service and Privacy
          Policy. Your payment information is secure and encrypted.
        </p>
      </div>
    </div>
  );
};

export default CheckoutSummary;
