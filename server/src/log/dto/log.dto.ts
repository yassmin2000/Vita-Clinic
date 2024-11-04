import { Transform } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetAllActionQuery {
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
    description: 'Number of actions per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @ApiPropertyOptional({
    name: 'value',
    type: String,
    description: 'Search value',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    name: 'sort',
    description: 'Sort actions by field',
    enum: ['date-desc', 'date-asc'],
    example: 'date-desc',
  })
  @IsOptional()
  @IsIn(['date-desc', 'date-asc'])
  sort?: 'date-desc' | 'date-asc';
}

export class CreateLogDto {
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Target ID (e.g. patient, appointment, etc.)',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  targetId: string;

  @ApiProperty({
    description: 'Target name (e.g. patient, appointment, etc.)',
    type: String,
    example: 'Appointment #1',
  })
  @IsNotEmpty()
  @IsString()
  targetName: string;

  @ApiProperty({
    description: 'Target type (e.g. patient, appointment, etc.)',
    type: String,
    example: 'appointment',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Action (e.g. create, update, etc.)',
    type: String,
    example: 'approve',
  })
  @IsNotEmpty()
  @IsString()
  action: string;

  @ApiProperty({
    description: 'User ID of the target user',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsOptional()
  @IsUUID()
  targetUserId?: string;

  @ApiProperty({
    description: 'Notes',
    type: String,
    example: 'Approved by Dr. John Doe',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class LogDto extends CreateLogDto {
  @ApiProperty({
    description: 'Log ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the log was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the log was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
