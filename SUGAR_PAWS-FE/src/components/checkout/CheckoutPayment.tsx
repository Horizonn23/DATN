import React, { useState } from "react";
import { PaymentMethod } from "@/types/payment";
import PaymentMethodModal from "./PaymentMethodModal";
import CheckoutSectionHeader from "./CheckoutSectionHeader";
import { FaMoneyBillWave, FaCreditCard, FaUniversity } from "react-icons/fa";

interface CheckoutPaymentProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const CheckoutPayment: React.FC<CheckoutPaymentProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const getPaymentMethodText = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH:
        return "Cash on Delivery";
      case PaymentMethod.CREDIT_CARD:
        return "Credit Card";
      case PaymentMethod.BANK_TRANSFER:
        return "Bank Transfer";
      default:
        return "Cash on Delivery";
    }
  };

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CASH:
        return <FaMoneyBillWave className="text-green-500 text-lg" />;
      case PaymentMethod.CREDIT_CARD:
        return <FaCreditCard className="text-blue-500 text-lg" />;
      case PaymentMethod.BANK_TRANSFER:
        return <FaUniversity className="text-purple-500 text-lg" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <CheckoutSectionHeader
        icon="💳"
        title="Payment Method"
        gradient="from-custom-rose to-custom-pink"
      />

      <button
        className="bg-custom-pink border-[1px] border-custom-wine text-custom-wine mt-2 ml-4 px-3 py-[2px] rounded-full text-[12px] transition-colors"
        onClick={() => setModalOpen(true)}
      >
        Change
      </button>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-gray-200">
            {getPaymentMethodIcon(selectedMethod)}
          </div>
          <div className="flex-1">
            <div className="font-bold text-gray-800 text-base">
              {getPaymentMethodText(selectedMethod)}
            </div>
            <div className="text-gray-500 text-sm">
              {selectedMethod === PaymentMethod.CASH && "Payment upon delivery"}
              {selectedMethod === PaymentMethod.CREDIT_CARD &&
                "Secure online payment"}
              {selectedMethod === PaymentMethod.BANK_TRANSFER &&
                "Direct bank transfer"}
            </div>
          </div>
          {selectedMethod === PaymentMethod.CASH && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
              Most Popular
            </span>
          )}
        </div>
      </div>

      <PaymentMethodModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedMethod={selectedMethod}
        onSelectMethod={onSelectMethod}
      />
    </div>
  );
};

export default CheckoutPayment;
