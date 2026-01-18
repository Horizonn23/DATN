"use client";

import React from "react";
import Link from "next/link";
import { useGetOrders } from "@/hooks/queries/useOrder";
import OrderCard from "@/components/user/OrderCard";
import type { Order, OrderStatus, OrderItem } from "@/types/order";
import CtaButton from "@/components/ui/CtaButton";

const OrdersPage = () => {
  const { getOrders } = useGetOrders();
  const orders = getOrders.data || [];
  const isLoading = getOrders.isLoading;

  const [activeTab, setActiveTab] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const orderTabs: { key: "all" | OrderStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "DELIVERED", label: "Delivered" },
    { key: "COMPLETED", label: "Completed" },
    { key: "REQUESTCANCEL", label: "Request Cancel" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "REFUNDED", label: "Refunded" },
  ];

  // Filter orders by status and search
  const filteredOrders = orders.filter((order: Order) => {
    const matchStatus = activeTab === "all" ? true : order.status === activeTab;
    const matchSearch =
      search.trim() === "" ||
      order.id.toString().includes(search) ||
      order.orderItems?.some((item: OrderItem) =>
        item.productDetail?.name?.toLowerCase().includes(search.toLowerCase()),
      );
    return matchStatus && matchSearch;
  });

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="flex justify-between border-b mb-4 overflow-x-auto">
        {orderTabs.map((tab) => (
          <button
            key={tab.key}
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === tab.key
                ? "border-custom-wine text-custom-wine"
                : "border-transparent text-gray-700 hover:text-custom-wine"
            }`}
            onClick={() =>
              setActiveTab(activeTab === tab.key ? "all" : tab.key)
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Search bar */}
      <div className="mb-4 flex items-center bg-white rounded-full px-4 py-2 border border-gray-200 shadow-sm">
        <input
          type="text"
          className="bg-transparent outline-none flex-1 text-base placeholder:text-gray-400 rounded-full px-2 py-1 text-custom-wine focus:none border-none"
          placeholder="You can search by Shop name, Order ID or Product name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          className="ml-2 bg-custom-wine hover:bg-custom-wine/90 rounded-full p-2 transition-colors"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
      {isLoading ? (
        <div className="text-center py-12 text-lg">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <svg width="80" height="80" fill="none" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="40" fill="#F3F4F6" />
            <rect
              x="25"
              y="30"
              width="30"
              height="30"
              rx="4"
              fill="#fff"
              stroke="#E5E7EB"
              strokeWidth="2"
            />
            <rect x="32" y="38" width="16" height="2" rx="1" fill="#E5E7EB" />
            <rect x="32" y="44" width="16" height="2" rx="1" fill="#E5E7EB" />
            <rect x="32" y="50" width="10" height="2" rx="1" fill="#E5E7EB" />
          </svg>
          <h2 className="text-2xl font-semibold mt-6 mb-2">No orders found</h2>
          <p className="mb-8 text-gray-600">
            Try adjusting your filters or start shopping!
          </p>
          <Link href="/collections">
            <CtaButton text="shop now" onClick={() => {}} />
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredOrders.map((order: Order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
