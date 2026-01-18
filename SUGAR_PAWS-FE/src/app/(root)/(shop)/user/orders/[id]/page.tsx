"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOrderById } from "@/hooks/queries/useOrder";
import DefaultLoading from "@/components/loading/DefaultLoading";
import Breadcrumbs from "@/components/ui/BreadCrum";
import CtaButton from "@/components/ui/CtaButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Image from "next/image";
import { formatCurrency, ensureAbsoluteUrl } from "@/helper/renderNumber";
import {
  FiCheckCircle,
  FiTruck,
  FiBox,
  FiCreditCard,
  FiSmartphone,
} from "react-icons/fi";
import type { OrderItem } from "@/types/order";

const ORDER_STATUS_STEPS = [
  { key: "PENDING", label: "Order Placed", icon: <FiBox /> },
  { key: "CONFIRMED", label: "Confirmed", icon: <FiCreditCard /> },
  { key: "DELIVERED", label: "Delivered", icon: <FiTruck /> },
  { key: "COMPLETED", label: "Completed", icon: <FiCheckCircle /> },
];

const statusToStepIndex = (status: string) => {
  switch (status) {
    case "PENDING":
      return 0;
    case "CONFIRMED":
      return 1;
    case "DELIVERED":
      return 2;
    case "COMPLETED":
      return 3;
    case "CANCELLED":
    case "REFUNDED":
      return 2;
    case "REQUESTCANCEL":
      return 1;
    default:
      return 0;
  }
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId =
    params?.id && !isNaN(Number(params.id)) ? Number(params.id) : undefined;
  const { data: order, isLoading, error } = useGetOrderById(orderId as number);

  if (!orderId) {
    return (
      <div className="container mx-auto py-20 text-center text-red-600">
        Invalid order ID.
      </div>
    );
  }

  if (isLoading) return <DefaultLoading />;
  if (error || !order) {
    return (
      <div className="container mx-auto py-20 text-center text-red-600">
        {error?.message || "Order not found."}
      </div>
    );
  }

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "My Orders", href: "/user/orders" },
    { name: `Order #${order.id}` },
  ];

  const currentStep = statusToStepIndex(order.status);
  const address = order.shippingAddress;
  const addressString = address
    ? [
        address.fullName,
        address.phoneNumber,
        address.homeNumber,
        address.moreDetail,
        address.ward?.name,
        address.ward?.district?.name,
        address.ward?.district?.city?.name,
      ]
        .filter(Boolean)
        .join(", ")
    : "-";

  const trackingHistory = [
    order.createdAt && {
      time: order.createdAt,
      label: "Order placed",
    },
    order.confirmedAt && {
      time: order.confirmedAt,
      label: "Order confirmed",
    },
    order.deliveredAt && {
      time: order.deliveredAt,
      label: "Order delivered",
    },
    order.completedAt && {
      time: order.completedAt,
      label: "Order completed",
    },
  ].filter(Boolean);

  return (
    <main className="min-h-screen bg-[#fff4dd] py-8 flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col gap-2">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="flex items-center justify-between mb-8 w-[80%] m-auto relative">
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0"></div>
          <div
            className="absolute top-5 left-0 h-1 bg-custom-wine z-0 w-[95%]"
            style={{
              width:
                currentStep >= 0
                  ? `${(currentStep / (ORDER_STATUS_STEPS.length - 1)) * 100}%`
                  : "0%",
              transition: "width 0.5s ease-in-out",
            }}
          ></div>

          {ORDER_STATUS_STEPS.map((step, idx) => (
            <div key={step.key} className="flex flex-col items-center relative">
              <div
                className={`rounded-full w-10 h-10 z-10 flex items-center justify-center text-xl mb-1 border-2 relative ${
                  idx <= currentStep
                    ? "bg-custom-wine text-white border-custom-wine"
                    : "bg-gray-200 text-gray-400 border-gray-200"
                }`}
              >
                {step.icon}
                <span
                  className={`text-xs font-medium absolute bottom-[-20px] w-[300%] text-center left-1/2 -translate-x-1/2  ${
                    idx <= currentStep ? "text-custom-wine" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6  flex flex-col gap-2">
          <div>
            <div className="font-semibold text-custom-purple mb-1">
              Shipping Address
            </div>
            <div className="text-sm text-gray-700">{addressString}</div>
          </div>
          <div>
            <div className="font-semibold text-custom-purple mb-1">
              Order Timeline
            </div>
            <ol className="text-sm text-gray-600 space-y-1">
              {trackingHistory.length === 0 ? (
                <li>No tracking info available.</li>
              ) : (
                trackingHistory.map((item, idx) =>
                  item ? (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-40 text-xs text-gray-500">
                        {item && item.time
                          ? new Date(
                              item.time as string | number | Date,
                            ).toLocaleString()
                          : "-"}
                      </span>
                      <span>{item && item.label ? item.label : "-"}</span>
                    </li>
                  ) : null,
                )
              )}
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 ">
          <div className="font-semibold text-custom-purple text-lg mb-2">
            Products
          </div>
          <div className="divide-y">
            {order.orderItems?.map((item: OrderItem) => (
              <div
                key={item.id}
                className="flex items-center gap-5 py-4 px-2 rounded-xl transition-shadow hover:shadow-lg hover:bg-[#f9f6f1] border border-transparent hover:border-custom-wine/30 mb-2"
                onClick={() =>
                  router.push(`/collections/${item.productDetail?.product?.id}`)
                }
                style={{
                  cursor: item.productDetail?.product?.id
                    ? "pointer"
                    : "default",
                }}
              >
                <div className="w-20 h-20 relative flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm">
                  <Image
                    src={
                      item.productDetail?.image?.url
                        ? ensureAbsoluteUrl(item.productDetail.image.url)
                        : item.productDetail?.product?.displayImage?.[0]
                          ? ensureAbsoluteUrl(
                              item.productDetail.product?.displayImage[0],
                            )
                          : "/assets/images/plus-size/plus-size1.png"
                    }
                    alt={
                      item.productDetail?.name ||
                      item.productDetail?.product?.name ||
                      "product"
                    }
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                  <div className="font-semibold truncate flex items-center gap-2 text-base text-custom-wine">
                    {item.productDetail?.product?.name ||
                      item.productDetail?.name ||
                      "Product"}
                    <span className="text-xs text-gray-500 font-semibold ml-1 bg-gray-100 px-2 py-0.5 rounded-full">
                      x{item.quantity}
                    </span>
                  </div>
                  {item.productDetail?.product?.vendor && (
                    <div className="text-xs text-gray-400 mt-0.5">
                      Vendor:{" "}
                      <span className="font-medium text-gray-600">
                        {item.productDetail.product.vendor}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1 flex gap-2">
                    <span>
                      Color:{" "}
                      <span className="font-semibold text-gray-700">
                        {item.productDetail?.color}
                      </span>
                    </span>
                    {item.productDetail?.size && (
                      <span>
                        | Size:{" "}
                        <span className="font-semibold text-gray-700">
                          {item.productDetail.size}
                        </span>
                      </span>
                    )}
                    {item.productDetail?.type && (
                      <span>
                        | Type:{" "}
                        <span className="font-semibold text-gray-700">
                          {item.productDetail.type}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="font-bold text-base whitespace-nowrap text-right text-custom-purple min-w-[90px]">
                  {formatCurrency(
                    (item.productDetail?.price ?? 0) * item.quantity,
                  )}{" "}
                  <span className="text-xs font-normal text-gray-500">VND</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex flex-col gap-2">
          <div className="flex justify-between text-base">
            <span>Subtotal</span>
            <span>
              {formatCurrency(
                order.originalAmount ||
                  order.totalAmount - (order.shippingFee || 0),
              )}{" "}
              VND
            </span>
          </div>
          {order.voucher &&
            order.discountAmount &&
            order.discountAmount > 0 && (
              <div className="flex justify-between text-base text-green-600">
                <span className="flex items-center gap-1">
                  Voucher Discount
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-1">
                    {order.voucher.code}
                  </span>
                </span>
                <span>-{formatCurrency(order.discountAmount)} VND</span>
              </div>
            )}
          <div className="flex justify-between text-base">
            <span>Shipping Fee</span>
            <span>{formatCurrency(order.shippingFee || 0)} VND</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-custom-purple border-t pt-2 mt-2">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)} VND</span>
          </div>
          <div className="flex justify-between text-base">
            <span>Payment Method</span>
            <span className="capitalize">{order.payment?.method || "-"}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>Payment Status</span>
            <span
              className={`capitalize font-semibold ${
                order.payment?.status === "UNPAID"
                  ? "text-red-600"
                  : order.payment?.status === "PAID"
                    ? "text-green-600"
                    : "text-gray-600"
              }`}
            >
              {order.payment?.status || "-"}
              {order.payment?.method === "BANK_TRANSFER" &&
                order.payment?.status === "UNPAID" && (
                  <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    Payment Required
                  </span>
                )}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {/* Bank Transfer Payment Button - Show if payment method is BANK_TRANSFER and status is UNPAID */}
          {order.payment?.method === "BANK_TRANSFER" &&
            order.payment?.status === "UNPAID" && (
              <button
                className="bg-green-600 text-[13px] uppercase hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center gap-2 shadow-lg"
                onClick={() => router.push(`/user/orders/${order.id}/qr-code`)}
              >
                <FiSmartphone className="text-lg" />
                Pay Now - QR Code
              </button>
            )}
          <CtaButton
            text="Buy Again"
            onClick={() => router.push("/collections")}
          />
          <SecondaryButton text="Contact Seller" onClick={() => {}} />
        </div>
      </div>
    </main>
  );
}
