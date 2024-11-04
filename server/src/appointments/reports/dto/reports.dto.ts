import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ReportStatus } from '@prisma/client';

import { BasicAppointmentDto } from 'src/appointments/dto/appointments.dto';

export class CreateReportDto {
  @ApiProperty({
    description: 'Title of the report',
    type: String,
    example: 'Knee X-Ray Report',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Notes for the report',
    type: String,
    example: 'Patient has a history of knee pain',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'URL for the report',
    type: String,
    example: 'https://example.com/knee-xray-report.pdf',
  })
  @IsNotEmpty()
  @IsUrl()
  reportURL: string;

  @ApiProperty({
    description: 'File name of the report',
    type: String,
    example: 'knee-xray-report.pdf',
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'Appointment ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  appointmentId: string;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {}

export class BasicReportDto extends CreateReportDto {
  @ApiProperty({
    description: 'Report ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Status of the report',
    enum: ReportStatus,
    example: ReportStatus.processed,
  })
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @ApiProperty({
    description: 'Date and time the scan was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time the scan was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class ReportDto extends BasicReportDto {
  @ApiProperty({
    description: 'Appointment data',
    type: BasicAppointmentDto,
  })
  @Type(() => BasicAppointmentDto)
  appointment: BasicAppointmentDto;
}

export class CreateMessageDto {
  @ApiProperty({
    description: 'Message content',
    type: String,
    example: 'Hello, how are you?',
  })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Is message sent by user (Flase if by AI assistant)',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  isUserMessage: boolean;
}

export class MessageDto extends CreateMessageDto {
  @ApiProperty({
    description: 'Message ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Report ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  reportId: string;

  @ApiProperty({
    description: 'Date and time the message was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time the message was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class GetPatientReportsQuery {
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
    description: 'Number of reports per page',
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
    example: 'Knee X-Ray Report',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    name: 'sort',
    description: 'Sort reports by field',
    enum: ['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'],
    example: 'name-asc',
  })
  @IsOptional()
  @IsIn(['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'])
  sort?: 'name-desc' | 'name-asc' | 'createdAt-desc' | 'createdAt-asc';
}
