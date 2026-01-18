"use client";

import React, { useState } from "react";
import CheckoutProductList from "@/components/checkout/CheckoutProductList";
import CheckoutShipping from "@/components/checkout/CheckoutShipping";
import CheckoutVoucher from "@/components/checkout/CheckoutVoucher";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import NewCheckoutAddress from "@/components/checkout/NewCheckoutAddress";
import { CheckoutProvider } from "@/provider/CheckoutProvider";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import { selectCartSelectedItems } from "@/store/slices/cartSlice";
import { PaymentMethod } from "@/types/payment";
import { Toaster } from "react-hot-toast";
import { useCalculateShippingFee } from "@/hooks/queries/useOrder";

export default function CheckoutPage() {
  const router = useRouter();
  const selectedItems = useAppSelector(selectCartSelectedItems);
  console.log(selectedItems);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );

  const { data: shippingFeeData } = useCalculateShippingFee(
    selectedAddressId || 0
  );

  React.useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      router.replace("/cart");
    }
  }, [selectedItems, router]);

  // Loading state while redirecting
  if (!selectedItems || selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-custom-yellow flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-rose mx-auto mb-4"></div>
          <p className="text-custom-purple">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  return (
    <CheckoutProvider>
      <main className="min-h-screen bg-custom-yellow py-4 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-custom-dark mb-2">
              Secure Checkout
            </h1>
            <p className="text-custom-purple text-sm md:text-base">
              Complete your order safely and securely
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Left Column - Checkout Forms */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="animate-fadeIn">
                <NewCheckoutAddress
                  setSelectedAddressId={setSelectedAddressId}
                />
              </div>
              <div className="animate-fadeIn animation-delay-100">
                <CheckoutProductList selectedItems={selectedItems} />
              </div>
              <div className="animate-fadeIn animation-delay-200">
                <CheckoutShipping addressId={selectedAddressId} />
              </div>
              <div className="animate-fadeIn animation-delay-300">
                <CheckoutVoucher
                  selectedItems={selectedItems}
                  selectedAddressId={selectedAddressId}
                />
              </div>
              <div className="animate-fadeIn animation-delay-400">
                <CheckoutPayment
                  selectedMethod={paymentMethod}
                  onSelectMethod={setPaymentMethod}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-10 md:top-20 animate-fadeIn animation-delay-500">
                <CheckoutSummary
                  selectedItems={selectedItems}
                  selectedAddressId={selectedAddressId}
                  shippingFee={shippingFeeData?.shippingFee ?? 0}
                  paymentMethod={paymentMethod}
                />
              </div>
            </div>
          </div>
        </div>
        <Toaster position="top-center" />
      </main>
    </CheckoutProvider>
  );
}
