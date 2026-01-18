import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationService } from "@/api/service/notificationService";

export function useGetNotifications(limit = 20) {
  const { getNotifications } = useNotificationService();

  return useQuery({
    queryKey: ["notifications", limit],
    queryFn: () => getNotifications(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useGetUnreadCount() {
  const { getUnreadCount } = useNotificationService();

  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadCount(),
    staleTime: 1000 * 30, // 30 seconds - shorter for unread count
    gcTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const { markAsRead } = useNotificationService();

  return useMutation({
    mutationFn: (notificationId: number) => markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  const { markAllAsRead } = useNotificationService();

  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const { deleteNotification } = useNotificationService();

  return useMutation({
    mutationFn: (notificationId: number) => deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();
  const { deleteAllNotifications } = useNotificationService();

  return useMutation({
    mutationFn: () => deleteAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
