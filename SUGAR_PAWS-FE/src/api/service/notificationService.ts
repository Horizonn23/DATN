import { useRequest } from "../Request";
import type { Notification } from "@/types/notification";

export const useNotificationService = () => {
  const request = useRequest();

  const getNotifications = async (limit = 20) => {
    const response = await request<{ data: Notification[] }>({
      url: `/notifications?limit=${limit}`,
      method: "GET",
    });
    return response.data || [];
  };

  const getUnreadCount = async () => {
    const response = await request<{ data: { count: number } }>({
      url: "/notifications/unread-count",
      method: "GET",
    });
    return response.data?.count || 0;
  };

  const markAsRead = async (notificationId: number) => {
    return request({
      url: `/notifications/${notificationId}/read`,
      method: "PATCH",
    });
  };

  const markAllAsRead = async () => {
    return request({
      url: "/notifications/read-all",
      method: "PATCH",
    });
  };

  const deleteNotification = async (notificationId: number) => {
    return request({
      url: `/notifications/${notificationId}`,
      method: "DELETE",
    });
  };

  const deleteAllNotifications = async () => {
    return request({
      url: "/notifications",
      method: "DELETE",
    });
  };

  return {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
};
