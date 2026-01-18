import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { Voucher } from "@/types/order";

interface VoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  vouchers: Voucher[] | undefined;
  isLoading: boolean;
  onSelectVoucher: (voucher: Voucher) => void;
  isApplyingVoucher?: boolean;
}

const VoucherModal: React.FC<VoucherModalProps> = ({
  isOpen,
  onClose,
  vouchers,
  isLoading,
  onSelectVoucher,
  isApplyingVoucher = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "shipping" | "discount">(
    "all",
  );

  const filteredVouchers = vouchers?.filter((voucher) => {
    const matchesSearch =
      voucher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voucher.description &&
        voucher.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "shipping" && voucher.type === "SHIPPING") ||
      (activeTab === "discount" && voucher.type === "DISCOUNT");

    return matchesSearch && matchesTab;
  });

  return (
    <Modal open={isOpen} onClose={onClose} size="medium" width="560px">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-custom-dark flex items-center gap-2">
            <span className="text-custom-rose">🎫</span>
            <span>Available Vouchers</span>
          </h3>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b mb-5">
          <button
            className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${
              activeTab === "all"
                ? "text-custom-wine"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Vouchers
            {activeTab === "all" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-custom-wine"></span>
            )}
          </button>
          <button
            className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${
              activeTab === "discount"
                ? "text-custom-wine"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("discount")}
          >
            Discount
            {activeTab === "discount" && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-custom-wine"></span>
            )}
          </button>
          <button
            className={`px-4 py-2.5 font-medium text-sm transition-colors relative ${
              activeTab === "shipping"
                ? "text-custom-wine"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("shipping")}
          >
            Shipping
            {activeTab === "shipping" && (
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

        <div className="max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-custom-rose scrollbar-track-gray-100">
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-custom-rose mx-auto"></div>
                <p className="text-sm font-medium text-gray-600 mt-4">
                  Loading vouchers...
                </p>
              </div>
            ) : filteredVouchers && filteredVouchers.length > 0 ? (
              filteredVouchers.map((voucher) => (
                <div
                  key={voucher.id}
                  className={`bg-gradient-to-r ${
                    voucher.type === "SHIPPING"
                      ? "from-blue-50 to-purple-50 border-blue-200"
                      : "from-yellow-50 to-orange-50 border-yellow-200"
                  } border rounded-xl p-4 transition-all hover:shadow-md ${
                    isApplyingVoucher
                      ? "cursor-not-allowed opacity-60"
                      : "hover:border-custom-rose/40 cursor-pointer"
                  }`}
                  onClick={() => !isApplyingVoucher && onSelectVoucher(voucher)}
                >
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
                          {voucher.endDate &&
                            new Date(voucher.endDate).getTime() -
                              new Date().getTime() <
                              7 * 24 * 60 * 60 * 1000 && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                                Expires soon
                              </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 mb-2.5">
                          {voucher.description || `Use code: ${voucher.code}`}
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
                          </span>
                          {voucher.minOrderAmount && (
                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                              Min: {voucher.minOrderAmount.toLocaleString()} VND
                            </span>
                          )}
                          {voucher.maxDiscountAmount && (
                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md font-medium">
                              Max: {voucher.maxDiscountAmount.toLocaleString()}{" "}
                              VND
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
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isApplyingVoucher) {
                          onSelectVoucher(voucher);
                        }
                      }}
                      disabled={isApplyingVoucher}
                      className={`text-sm font-medium ml-2 px-4 py-2 rounded-lg transition-all ${
                        isApplyingVoucher
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : voucher.type === "SHIPPING"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md"
                            : "bg-gradient-to-r from-custom-rose to-custom-wine hover:from-custom-wine hover:to-custom-rose text-white shadow-sm hover:shadow-md"
                      }`}
                    >
                      {isApplyingVoucher ? "Applying..." : "Apply"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-400 text-4xl mb-4">🔍</div>
                <p className="text-base font-medium text-gray-600">
                  No vouchers found
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {searchTerm
                    ? "Try different search keywords"
                    : activeTab !== "all"
                      ? `No ${activeTab} vouchers available`
                      : "Check back later for new offers"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VoucherModal;
