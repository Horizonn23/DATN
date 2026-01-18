"use client";

import React, { useState } from "react";
import { FaBell, FaCheck, FaTrash, FaTimes } from "react-icons/fa";
import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from "@/hooks/queries/useNotification";
import { useSocket } from "@/provider/SocketProvider";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function NotificationIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications = [], isLoading } = useGetNotifications(20);
  const { data: unreadCount = 0 } = useGetUnreadCount();
  const { isConnected } = useSocket();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteNotificationMutation = useDeleteNotification();

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsReadMutation.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };

  const handleDelete = async (notificationId: number) => {
    await deleteNotificationMutation.mutateAsync(notificationId);
  };

  const getOrderStatusColor = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return "text-blue-600";
      case "DELIVERED":
        return "text-purple-600";
      case "COMPLETED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-custom-rose transition-colors"
      >
        <FaBell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        {isConnected && (
          <span className="absolute bottom-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Notification Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-custom-yellow to-custom-pink rounded-t-lg">
              <h3 className="font-bold text-lg text-custom-wine">
                Thông báo ({unreadCount})
              </h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-custom-wine hover:text-white bg-white/50 hover:bg-custom-wine px-2 py-1 rounded transition-colors"
                    title="Đánh dấu tất cả đã đọc"
                  >
                    <FaCheck />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-custom-wine hover:text-white hover:bg-custom-wine p-1 rounded transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Đang tải...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FaBell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có thông báo nào</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                          )}
                          <h4
                            className={`font-semibold text-sm truncate ${
                              notification.isRead
                                ? "text-gray-700"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        {notification.order && (
                          <span
                            className={`text-xs font-medium ${getOrderStatusColor(
                              notification.order.status,
                            )}`}
                          >
                            Trạng thái: {notification.order.status}
                          </span>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            {
                              addSuffix: true,
                              locale: vi,
                            },
                          )}
                        </p>
                      </div>

                      <div className="flex gap-1 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-blue-500 hover:bg-blue-100 rounded transition-colors"
                            title="Đánh dấu đã đọc"
                          >
                            <FaCheck className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                          title="Xóa"
                        >
                          <FaTrash className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page if you have one
                  }}
                  className="text-sm text-custom-rose hover:text-custom-wine font-medium w-full text-center"
                >
                  Xem tất cả thông báo
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
