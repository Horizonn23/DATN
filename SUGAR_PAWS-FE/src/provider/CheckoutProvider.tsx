import React, { createContext, useContext, useState, ReactNode } from "react";
import { VoucherInfo, OrderCalculation } from "@/types/order";

export interface CheckoutContextType {
  // Voucher state
  selectedVoucher: VoucherInfo | null;
  setSelectedVoucher: (voucher: VoucherInfo | null) => void;
  voucherCode: string;
  setVoucherCode: (code: string) => void;

  // Order calculation
  orderCalculation: OrderCalculation | null;
  setOrderCalculation: (calculation: OrderCalculation | null) => void;

  // Loading states
  isCalculatingTotal: boolean;
  setIsCalculatingTotal: (loading: boolean) => void;
  isApplyingVoucher: boolean;
  setIsApplyingVoucher: (loading: boolean) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherInfo | null>(
    null
  );
  const [voucherCode, setVoucherCode] = useState("");
  const [orderCalculation, setOrderCalculation] =
    useState<OrderCalculation | null>(null);
  const [isCalculatingTotal, setIsCalculatingTotal] = useState(false);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  return (
    <CheckoutContext.Provider
      value={{
        selectedVoucher,
        setSelectedVoucher,
        voucherCode,
        setVoucherCode,
        orderCalculation,
        setOrderCalculation,
        isCalculatingTotal,
        setIsCalculatingTotal,
        isApplyingVoucher,
        setIsApplyingVoucher,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckoutContext() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error(
      "useCheckoutContext must be used within a CheckoutProvider"
    );
  }
  return context;
}
