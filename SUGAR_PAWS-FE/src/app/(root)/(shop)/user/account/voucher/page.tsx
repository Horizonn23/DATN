"use client";

import React, { useState } from "react";
import { useUserVouchers } from "@/hooks/queries/useVoucher";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaCopy,
} from "react-icons/fa";
import { Spinner } from "@/components/ui/Spinner";
import { showSuccessToast } from "@/components/ui/SuccessToast";
import { formatDate } from "@/utils/dateUtils";
import { Voucher as VoucherType } from "@/types/order";

// Define the interface for API response structure
interface Voucher
  extends Omit<
    VoucherType,
    | "startDate"
    | "endDate"
    | "createdAt"
    | "updatedAt"
    | "description"
    | "maxDiscountAmount"
    | "minOrderAmount"
    | "maxUsageCount"
  > {
  description: string | null;
  maxDiscountAmount: number | null;
  minOrderAmount: number | null;
  maxUsageCount: number | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

// Helper function to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const VoucherPage = () => {
  const { data: vouchers, isLoading, isError } = useUserVouchers();
  const [activeTab, setActiveTab] = useState<"available" | "used" | "expired">(
    "available"
  );
  const [searchTerm, setSearchTerm] = useState("");

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showSuccessToast("Voucher code copied to clipboard!");
  };

  // Filter vouchers based on active tab and search term
  const getFilteredVouchers = () => {
    if (!vouchers || !Array.isArray(vouchers)) return [];

    const now = new Date();

    return vouchers.filter((voucher) => {
      // Check if voucher has ended or is still active
      const isExpired = new Date(voucher.endDate) < now;
      // For the demo, we'll consider vouchers with currentUsageCount > 0 as "used"
      const isUsed = voucher.currentUsageCount > 0;

      // Filter by tab
      const matchesTab =
        (activeTab === "available" && !isExpired && !isUsed) ||
        (activeTab === "used" && isUsed) ||
        (activeTab === "expired" && isExpired && !isUsed);

      // Filter by search term
      const matchesSearch =
        searchTerm === "" ||
        voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (voucher.description &&
          voucher.description.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  };

  const filteredVouchers = getFilteredVouchers();

  // Get the background color based on voucher type
  const getVoucherColor = (type: string) => {
    switch (type) {
      case "SHIPPING":
        return "from-blue-50 to-purple-50 border-blue-200";
      case "DISCOUNT":
        return "from-yellow-50 to-orange-50 border-yellow-200";
      default:
        return "from-gray-50 to-gray-100 border-gray-200";
    }
  };

  // Render the discount caption with more details
  const getDiscountCaption = (voucher: Voucher) => {
    let caption = "";

    if (voucher.type === "SHIPPING") {
      caption = "Free shipping on your order";
    } else if (voucher.discountType === "PERCENTAGE") {
      caption = `${voucher.discountValue}% discount`;
      if (voucher.maxDiscountAmount) {
        caption += ` (Up to ${formatCurrency(voucher.maxDiscountAmount)})`;
      }
    } else {
      caption = `${formatCurrency(voucher.discountValue)} discount`;
    }

    if (voucher.minOrderAmount) {
      caption += ` for orders over ${formatCurrency(voucher.minOrderAmount)}`;
    }

    return caption;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Spinner size="lg" color="text-custom-wine" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-8 text-custom-wine text-center tracking-tight drop-shadow-sm">
          My Vouchers
        </h2>
        <div className="text-red-500 text-center py-8">
          <FaTimesCircle className="text-4xl mx-auto mb-4" />
          <p>Failed to load vouchers. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 w-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-custom-dark flex items-center gap-2">
          <span className="text-custom-rose">🎫</span>
          <span>My Voucher Wallet</span>
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${
            activeTab === "available"
              ? "text-custom-wine"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Available
          {activeTab === "available" && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-custom-wine"></span>
          )}
        </button>
        <button
          className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${
            activeTab === "used"
              ? "text-custom-wine"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("used")}
        >
          Used
          {activeTab === "used" && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-custom-wine"></span>
          )}
        </button>
        <button
          className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${
            activeTab === "expired"
              ? "text-custom-wine"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("expired")}
        >
          Expired
          {activeTab === "expired" && (
            <span className="absolute bottom-0 inset-x-0 h-0.5 bg-custom-wine"></span>
          )}
        </button>
      </div>

      {/* Search input */}
      <div className="mb-5">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code or name..."
            className="w-full px-4 py-3 border border-custom-pink/30 rounded-lg focus:ring-2 focus:ring-custom-rose focus:border-custom-rose transition-colors pl-11 bg-gray-50"
          />
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-custom-rose/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Voucher List */}
      <div className="flex flex-col gap-4">
        {!vouchers || filteredVouchers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <p className="text-base font-medium text-gray-600">
              No vouchers found
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {activeTab !== "available"
                ? `No ${activeTab} vouchers available`
                : "Check back later for new offers"}
            </p>
          </div>
        ) : (
          filteredVouchers.map((voucher) => {
            return (
              <div
                key={voucher.id}
                className={`border rounded-xl overflow-hidden shadow-sm bg-gradient-to-r ${getVoucherColor(
                  voucher.type
                )} relative hover:shadow-md transition-all`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          voucher.type === "SHIPPING"
                            ? "bg-gradient-to-br from-blue-500 to-purple-500"
                            : "bg-gradient-to-br from-yellow-500 to-orange-500"
                        }`}
                      >
                        <span className="text-white text-base font-bold">
                          {voucher.type === "SHIPPING" ? "🚚" : "%"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {voucher.name}
                          </h4>
                          {new Date(voucher.endDate).getTime() -
                            new Date().getTime() <
                            7 * 24 * 60 * 60 * 1000 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                              Expires soon
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 mb-2.5">
                          {voucher.description || getDiscountCaption(voucher)}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5 text-xs">
                          <span
                            className={`px-2.5 py-1 rounded-md font-medium ${
                              voucher.type === "SHIPPING"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            Code:{" "}
                            <span className="font-bold">{voucher.code}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyVoucherCode(voucher.code);
                              }}
                              className="ml-1.5 text-custom-wine inline-flex items-center hover:text-custom-wine/80"
                            >
                              <FaCopy size={12} />
                            </button>
                          </span>
                          {voucher.minOrderAmount && (
                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                              Min: {formatCurrency(voucher.minOrderAmount)}
                            </span>
                          )}
                          {voucher.maxDiscountAmount && (
                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                              Max: {formatCurrency(voucher.maxDiscountAmount)}
                            </span>
                          )}
                          {voucher.type && (
                            <span
                              className={`px-2.5 py-1 rounded-md font-medium ${
                                voucher.type === "SHIPPING"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {voucher.type === "SHIPPING"
                                ? "Free Shipping"
                                : "Discount"}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 text-xs text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          <span>
                            Valid until {formatDate(new Date(voucher.endDate))}
                          </span>
                        </div>

                        {activeTab === "used" && (
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <FaCheckCircle className="mr-1 text-green-500" />
                            <span>
                              {"Used on "}
                              {formatDate(new Date(userVoucher.usedAt!))}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expired or Used Overlay */}
                {(activeTab === "expired" || activeTab === "used") && (
                  <div className="absolute top-0 right-0 bg-gray-300 bg-opacity-10 w-full h-full flex items-center justify-center">
                    <div
                      className={`transform rotate-12 border-2 ${
                        activeTab === "expired"
                          ? "border-red-500 text-red-600"
                          : "border-gray-500 text-gray-700"
                      } rounded-lg px-4 py-2 text-lg font-bold bg-white bg-opacity-90 shadow-sm`}
                    >
                      {activeTab === "expired" ? "EXPIRED" : "USED"}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default VoucherPage;
