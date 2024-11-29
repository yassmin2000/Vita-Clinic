import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  CreateNotificationDto,
  GetAllNotificationsQuery,
  NotificationCountDto,
  NotificationDto,
} from './dto/notifications.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async getAllNotifications(
    userId: string,
    {
      page = 1,
      limit = 10,
      status = 'all',
      sort = 'date-desc',
    }: GetAllNotificationsQuery,
  ): Promise<NotificationDto[]> {
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];
    const offset = (page - 1) * limit;

    return this.prisma.notification.findMany({
      where: {
        userId,
        isRead: status === 'unread' ? false : undefined,
      },
      orderBy: {
        createdAt: sortField === 'date' ? sortOrder : undefined,
      },
      skip: offset,
      take: limit,
    });
  }

  async markAsRead(
    userId: string,
    notificationId: string,
  ): Promise<NotificationDto> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
      },
    });
  }

  async getNewNotificationsCount(
    userId: string,
  ): Promise<NotificationCountDto> {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  }

  async create(
    CreateNotificationDto: CreateNotificationDto,
  ): Promise<NotificationDto> {
    const notification = await this.prisma.notification.create({
      data: CreateNotificationDto,
    });
    this.notificationsGateway.sendNotificationToUser(
      notification.userId,
      notification,
    );

    return notification;
  }
}
