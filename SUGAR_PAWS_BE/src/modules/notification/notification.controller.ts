import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getNotifications(@Req() req, @Query('limit') limit?: string) {
    const userId = req.user.id;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.notificationService.getUserNotifications(userId, limitNum);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req) {
    const userId = req.user.id;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    await this.notificationService.markAsRead(id, userId);
    return { success: true };
  }

  @Patch('read-all')
  async markAllAsRead(@Req() req) {
    const userId = req.user.id;
    await this.notificationService.markAllAsRead(userId);
    return { success: true };
  }

  @Delete(':id')
  async deleteNotification(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    await this.notificationService.deleteNotification(id, userId);
    return { success: true };
  }

  @Delete()
  async deleteAll(@Req() req) {
    const userId = req.user.id;
    await this.notificationService.deleteAllNotifications(userId);
    return { success: true };
  }

  // Test endpoint - remove in production
  @Get('test/:userId')
  async testNotification(@Param('userId', ParseIntPipe) userId: number) {
    await this.notificationService.createNotification({
      userId,
      title: 'Test Notification',
      message: 'Testing realtime notification system',
      type: 'SYSTEM',
    });
    return { success: true, message: 'Notification sent to user ' + userId };
  }
}
