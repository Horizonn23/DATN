"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOrderById } from "@/hooks/queries/useOrder";
import { generateVietQR } from "@/api/service/qrService";
import { Spinner } from "@/components/ui/Spinner";
import { formatCurrency } from "@/helper/renderNumber";
import Image from "next/image";

export default function QRCodePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params?.id);

  const [qrData, setQrData] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  const { data: order, isLoading, error } = useGetOrderById(orderId);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!order?.totalAmount || !orderId) return;

      setQrLoading(true);
      setQrError(null);

      try {
        const result = await generateVietQR({
          amount: order.totalAmount,
          orderId: orderId,
        });

        if (result.success) {
          setQrData(result.qrDataURL);
        } else {
          setQrError(result.error || "Failed to generate QR code");
        }
      } catch {
        setQrError("Failed to generate QR code");
      } finally {
        setQrLoading(false);
      }
    };

    if (order && order.payment?.method === "BANK_TRANSFER") {
      generateQRCode();
    }
  }, [order, orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fff4dd] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#fff4dd] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Order not found
          </h1>
          <button
            onClick={() => router.push("/user/orders")}
            className="bg-custom-wine text-white px-6 py-2 rounded-lg hover:bg-custom-rose transition"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (order.payment?.method !== "BANK_TRANSFER") {
    return (
      <div className="min-h-screen bg-[#fff4dd] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-orange-600 mb-4">
            QR Code not available
          </h1>
          <p className="text-gray-600 mb-4">
            This order does not use bank transfer payment method
          </p>
          <button
            onClick={() => router.push(`/user/orders/${orderId}`)}
            className="bg-custom-wine text-white px-6 py-2 rounded-lg hover:bg-custom-rose transition"
          >
            Back to Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-custom-purple mb-2">
          Bank Transfer Payment
        </h1>
        <p className="text-gray-600">Order #{orderId}</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Order Total:</span>
          <span className="text-lg font-bold text-custom-purple">
            {formatCurrency(order.totalAmount)} VND
          </span>
        </div>
      </div>

      {/* QR Code Section */}
      <div className="text-center mb-6">
        {qrLoading && (
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-gray-600">Generating QR code...</p>
          </div>
        )}

        {qrError && (
          <div className="text-center">
            <p className="text-red-600 mb-4">{qrError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-custom-wine text-white px-4 py-2 rounded-lg hover:bg-custom-rose transition"
            >
              Retry
            </button>
          </div>
        )}

        {qrData && !qrLoading && !qrError && (
          <div className="flex flex-col items-center">
            <Image
              src={qrData}
              alt="VietQR Code"
              width={256}
              height={256}
              className="border border-gray-200 rounded-lg mb-4"
            />
            <p className="text-sm text-gray-600 mb-2">
              Scan this QR code with your banking app
            </p>
          </div>
        )}
      </div>

      {/* Bank Information */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          Bank Transfer Details
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Bank:</span>
            <span className="font-medium">VietinBank</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Account Number:</span>
            <span className="font-medium">106875363958</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Account Name:</span>
            <span className="font-medium">NGUYEN KIEU LINH</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Amount:</span>
            <span className="font-medium">
              {formatCurrency(order.totalAmount)} VND
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Transfer Note:</span>
            <span className="font-medium">Thanh toan don hang #{orderId}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-900 mb-3">
          Payment Instructions
        </h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
          <li>Open your banking app and scan the QR code above</li>
          <li>Verify the transfer amount and recipient information</li>
          <li>Complete the transfer with the exact amount shown</li>
          <li>Your order will be processed after payment confirmation</li>
        </ol>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push(`/user/orders/${orderId}`)}
          className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
        >
          Back to Order
        </button>
        <button
          onClick={() => router.push("/user/orders")}
          className="flex-1 bg-custom-wine text-white py-3 rounded-lg hover:bg-custom-rose transition font-semibold"
        >
          All Orders
        </button>
      </div>
    </div>
  );
}
