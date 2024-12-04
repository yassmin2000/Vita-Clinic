import type { Request } from 'express';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { NotificationsService } from './notifications.service';
import {
  GetAllNotificationsQuery,
  NotificationCountDto,
  NotificationDto,
} from './dto/notifications.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Notifications',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiDocumentation({
    operation: {
      description: 'Get all notifcations',
      summary: 'Get all notifcations',
    },
    okResponse: {
      description: 'Notifications data',
      type: [NotificationDto],
    },
  })
  @Get()
  async getAllNotifications(
    @Req() request: Request,
    @Query(new ValidationPipe({ transform: true }))
    query: GetAllNotificationsQuery,
  ): Promise<NotificationDto[]> {
    const user = request.user;

    return this.notificationsService.getAllNotifications(user.id, query);
  }

  @Patch(':notificationId/read')
  @ApiDocumentation({
    operation: {
      description: 'Mark notification as read',
      summary: 'Mark notification as read',
    },
    notFoundResponse: {
      description: 'Notification not found',
    },
    okResponse: {
      description: 'Notification data',
      type: NotificationDto,
    },
  })
  async markAsRead(
    @Param('notificationId') notificationId: string,
    @Req() request: Request,
  ) {
    const user = request.user;

    return this.notificationsService.markAsRead(user.id, notificationId);
  }

  @ApiDocumentation({
    operation: {
      description: 'Get new notifications count',
      summary: 'Get new notifications count',
    },
    okResponse: {
      description: 'New notifications count',
      type: NotificationCountDto,
    },
  })
  @Get('count')
  async getNewNotificationsCount(
    @Req() request: Request,
  ): Promise<NotificationCountDto> {
    const user = request.user;

    return this.notificationsService.getNewNotificationsCount(user.id);
  }
}
