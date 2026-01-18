import { OrderStatus } from "@/types/order";

export const formatOrderStatus = (status: OrderStatus | string): string => {
  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    DELIVERED: "Delivered",
    COMPLETED: "Completed",
    REQUESTCANCEL: "Request Cancel",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };
  return statusMap[status] || status;
};

export const getOrderStatusColor = (status: OrderStatus | string): string => {
  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    DELIVERED: "bg-green-100 text-green-800",
    COMPLETED: "bg-purple-100 text-purple-800",
    REQUESTCANCEL: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-200 text-gray-700",
  };
  return statusColors[status] || "bg-gray-100 text-gray-700";
};

export const getMantineOrderStatusColor = (
  status: OrderStatus | string,
): string => {
  const statusColors: Record<string, string> = {
    PENDING: "yellow",
    CONFIRMED: "blue",
    DELIVERED: "green",
    COMPLETED: "teal",
    REQUESTCANCEL: "orange",
    CANCELLED: "red",
    REFUNDED: "gray",
  };
  return statusColors[status] || "gray";
};

export const canCancelOrder = (status: OrderStatus | string): boolean => {
  return status === "PENDING" || status === "CONFIRMED";
};

export const getNextPossibleStatuses = (
  currentStatus: OrderStatus | string,
): OrderStatus[] => {
  const transitions: Record<string, OrderStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["DELIVERED", "REQUESTCANCEL", "CANCELLED"],
    DELIVERED: ["COMPLETED", "REQUESTCANCEL"],
    COMPLETED: ["REFUNDED"],
    REQUESTCANCEL: ["CANCELLED", "REFUNDED"],
    CANCELLED: [],
    REFUNDED: [],
  };
  return transitions[currentStatus] || [];
};

export const getOrderStatusSelectOptions = () => {
  return [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "COMPLETED", label: "Completed" },
    { value: "REQUESTCANCEL", label: "Request Cancel" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "REFUNDED", label: "Refunded" },
  ];
};
