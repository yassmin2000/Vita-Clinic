import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import type { Socket } from 'socket.io';

import type { Payload } from 'src/types/payload.type';
import { NotificationDto } from './dto/notifications.dto';

@WebSocketGateway({
  namespace: '/notifications',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private connectedClients = new Map<string, Socket>();

  constructor(private jwtService: JwtService) {}

  afterInit() {
    console.log('Notification Gateway Initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.token as string;
      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      const userId = payload.id;

      this.connectedClients.set(userId, client);
      client.join(`user_${userId}`);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.forEach((socket, userId) => {
      if (socket.id === client.id) {
        this.connectedClients.delete(userId);
      }
    });
  }

  sendNotificationToUser(userId: string, notification: NotificationDto) {
    const targetSocket = this.connectedClients.get(userId);
    if (targetSocket) {
      targetSocket.emit('notification', notification);
    }
  }
}
