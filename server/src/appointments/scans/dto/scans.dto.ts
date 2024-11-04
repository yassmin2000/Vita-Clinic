import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

import { ModalityDto } from 'src/settings/modalities/dto/modalities.dto';
import { BasicAppointmentDto } from 'src/appointments/dto/appointments.dto';

export class CreateScanDto {
  @ApiProperty({
    description: 'Title of the scan',
    type: String,
    example: 'Knee X-Ray',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Notes for the scan',
    type: String,
    example: 'Patient has a history of knee pain',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'URLs for the scan',
    isArray: true,
    type: String,
    example: ['https://example.com/knee-xray-1.jpg'],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  scanURLs: string[];

  @ApiProperty({
    description: 'Modality ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  modalityId: string;

  @ApiProperty({
    description: 'Appointment ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  appointmentId: string;
}
export class UpdateScanDto extends PartialType(CreateScanDto) {}

export class BasicScanDto extends CreateScanDto {
  @ApiProperty({
    description: 'Scan ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

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

export class FullScanDto extends BasicScanDto {
  @ApiProperty({
    description: 'Modality details',
    type: ModalityDto,
  })
  @Type(() => ModalityDto)
  modality: ModalityDto;

  @ApiProperty({
    description: 'Appointment data',
    type: BasicAppointmentDto,
  })
  @Type(() => BasicAppointmentDto)
  appointment: BasicAppointmentDto;
}

export class ScanDto extends OmitType(FullScanDto, ['scanURLs']) {}

export class GetPatientScansQuery {
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
    description: 'Number of scans per page',
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
    example: 'Knee X-Ray',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    name: 'sort',
    description: 'Sort scans by field',
    enum: ['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'],
    example: 'name-asc',
  })
  @IsOptional()
  @IsIn(['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'])
  sort?: 'name-desc' | 'name-asc' | 'createdAt-desc' | 'createdAt-asc';
}
