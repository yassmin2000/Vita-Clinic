import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class GetAllNotificationsQuery {
  @ApiPropertyOptional({
    name: 'page',
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @ApiPropertyOptional({
    name: 'limit',
    type: Number,
    description: 'Number of notifications per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @ApiPropertyOptional({
    name: 'status',
    description: 'Filter notifications by status',
    enum: ['all', 'unread'],
    example: 'all',
  })
  @IsOptional()
  @IsIn(['all', 'unread'])
  status?: 'all' | 'unread';

  @ApiPropertyOptional({
    name: 'sort',
    description: 'Sort notifications by field',
    enum: ['date-desc', 'date-asc'],
    example: 'date-desc',
  })
  @IsOptional()
  @IsIn(['date-desc', 'date-asc'])
  sort?: 'date-desc' | 'date-asc';
}

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Target ID (e.g. appointment, etc.)',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  targetId: string;

  @ApiProperty({
    description: 'Target name (e.g. appointment, etc.)',
    type: String,
    example: 'Appointment #1',
  })
  @IsNotEmpty()
  @IsString()
  targetName: string;

  @ApiProperty({
    description: 'Notification type',
    enum: NotificationType,
    example: NotificationType.appointment_assigned,
  })
  @IsNotEmpty()
  @IsEnum(NotificationType)
  type: NotificationType;
}

export class NotificationDto extends CreateNotificationDto {
  @ApiProperty({
    description: 'Notification ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Whether the notification has been read',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({
    description: 'The date and time the notification was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the notification was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class NotificationCountDto {
  @ApiProperty({
    description: 'New notifications count',
    type: Number,
    example: 5,
  })
  @IsInt()
  count: number;
}
