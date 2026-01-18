import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { PaymentMethod } from "@/types/payment";
import { FaMoneyBillWave, FaCreditCard, FaUniversity } from "react-icons/fa";

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  open,
  onClose,
  selectedMethod,
  onSelectMethod,
}) => {
  const [method, setMethod] = useState<PaymentMethod>(selectedMethod);

  const handleSave = () => {
    onSelectMethod(method);
    onClose();
  };

  const paymentMethods = [
    {
      id: PaymentMethod.CASH,
      label: "Cash on Delivery",
      icon: <FaMoneyBillWave className="text-green-500 text-lg" />,
    },
    {
      id: PaymentMethod.CREDIT_CARD,
      label: "Credit Card",
      icon: <FaCreditCard className="text-blue-500 text-lg" />,
    },
    {
      id: PaymentMethod.BANK_TRANSFER,
      label: "Bank Transfer",
      icon: <FaUniversity className="text-purple-500 text-lg" />,
    },
  ];

  // Đảm bảo đồng bộ khi selectedMethod thay đổi từ ngoài vào
  React.useEffect(() => {
    setMethod(selectedMethod);
  }, [selectedMethod]);

  return (
    <Modal open={open} onClose={onClose} size="small">
      <div className="text-lg font-semibold text-custom-purple mb-4 text-center">
        Select Payment Method
      </div>
      <div className="space-y-2 pb-2">
        {paymentMethods.map((paymentMethod) => (
          <div
            key={paymentMethod.id}
            className={`p-3 border rounded-lg cursor-pointer transition flex items-center gap-3 ${
              method === paymentMethod.id
                ? "border-custom-purple bg-purple-50 shadow"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setMethod(paymentMethod.id)}
          >
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-150 ${
                method === paymentMethod.id
                  ? "border-custom-purple"
                  : "border-gray-400"
              }`}
            >
              {method === paymentMethod.id && (
                <div className="w-3 h-3 rounded-full bg-custom-purple"></div>
              )}
            </div>
            <span className="mr-2">{paymentMethod.icon}</span>
            <span className="text-sm font-medium">{paymentMethod.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 text-sm bg-custom-rose text-white rounded-lg hover:bg-pink-500"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default PaymentMethodModal;
