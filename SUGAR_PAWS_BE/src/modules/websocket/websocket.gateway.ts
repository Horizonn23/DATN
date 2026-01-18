import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebSocketGatewayService
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('WebSocketGateway');
  private userSockets = new Map<number, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove from userSockets map
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number },
  ) {
    this.logger.log(`📝 Register event received from ${client.id}`);
    this.logger.log(`📦 Data: ${JSON.stringify(data)}`);
    this.logger.log(`User ${data.userId} registered with socket ${client.id}`);
    this.userSockets.set(data.userId, client.id);
    this.logger.log(
      `📊 Total registered users: ${this.userSockets.size} - ${JSON.stringify(Array.from(this.userSockets.entries()))}`,
    );
    return { success: true };
  }

  // Emit notification to specific user
  emitToUser(userId: number, event: string, data: any) {
    this.logger.log(
      `🔍 Looking for user ${userId}, registered users: ${JSON.stringify(Array.from(this.userSockets.entries()))}`,
    );
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
      this.logger.log(
        `✅ Emitted ${event} to user ${userId} (socket ${socketId})`,
      );
    } else {
      this.logger.warn(
        `❌ User ${userId} not connected. Registered users: ${Array.from(this.userSockets.keys()).join(', ')}`,
      );
    }
  }

  // Emit to all users
  emitToAll(event: string, data: any) {
    this.server.emit(event, data);
    this.logger.log(`Emitted ${event} to all users`);
  }
}
