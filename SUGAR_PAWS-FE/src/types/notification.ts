export interface Notification {
  id: number;
  userId: number;
  orderId?: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: number;
    status: string;
    createdAt: string;
  };
}

export interface NotificationResponse {
  statusCode: number;
  message: string;
  data: Notification[];
}

export interface UnreadCountResponse {
  statusCode: number;
  message: string;
  data: {
    count: number;
  };
}
