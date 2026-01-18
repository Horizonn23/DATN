import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { WebSocketGatewayService } from '../websocket/websocket.gateway';

export interface CreateNotificationDto {
  userId: number;
  orderId?: number;
  title: string;
  message: string;
  type?: string;
}

@Injectable()
export class NotificationService {
  constructor(
    private prisma: PrismaService,
    private webSocketGateway: WebSocketGatewayService,
  ) {}

  async createNotification(data: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: data.userId,
        orderId: data.orderId,
        title: data.title,
        message: data.message,
        type: data.type || 'ORDER_STATUS',
      },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    // Emit realtime notification to user
    this.webSocketGateway.emitToUser(data.userId, 'notification', notification);

    return notification;
  }

  async getUserNotifications(userId: number, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      include: {
        order: {
          select: {
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getUnreadCount(userId: number) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  async markAsRead(notificationId: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns this notification
      },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async deleteNotification(notificationId: number, userId: number) {
    return this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId, // Ensure user owns this notification
      },
    });
  }

  async deleteAllNotifications(userId: number) {
    return this.prisma.notification.deleteMany({
      where: { userId },
    });
  }
}
