import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
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

export class InstanceDto {
  @ApiProperty({
    description: 'Instance ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'SOP Instance UID',
    type: String,
    example: '1.3.6.1.4.1.14519.5.2.1.6919.4624.212211709210274480760196299870',
  })
  @IsString()
  sopInstanceUID: string;

  @ApiProperty({
    description: 'Instance number',
    type: Number,
    example: 1,
  })
  @IsInt()
  instanceNumber: number;

  @ApiProperty({
    description: 'Instance URL',
    type: String,
    example: 'https://example.com/left-breast-mlo.dcm',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Date and time the instance was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time the instance was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class SeriesDto {
  @ApiProperty({
    description: 'Series ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Series Instance UID',
    type: String,
    example: '1.3.6.1.4.1.14519.5.2.1.6919.4624.277870064395307630151805987637',
  })
  @IsString()
  seriesInstanceUID: string;

  @ApiProperty({
    description: 'Series number',
    type: Number,
    example: 1,
  })
  @IsInt()
  seriesNumber: number;

  @ApiPropertyOptional({
    description: 'Modality',
    type: String,
    example: 'MG',
  })
  @IsString()
  modality?: string;

  @ApiPropertyOptional({
    description: 'Series description',
    type: String,
    example: 'Left Breast MLO',
  })
  description?: string;

  @ApiProperty({
    description: 'Instances in the series',
    isArray: true,
    type: InstanceDto,
  })
  @IsArray()
  @Type(() => InstanceDto)
  instances: InstanceDto[];

  @ApiProperty({
    description: 'Date and time the series was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time the series was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class StudyDto {
  @ApiProperty({
    description: 'Study ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Study Instance UID',
    type: String,
    example: '1.3.6.1.4.1.9590.100.1.2.110936445211379937514180548003449524345',
  })
  @IsString()
  studyInstanceUID: string;

  @ApiProperty({
    description: 'Study modalities',
    isArray: true,
    type: String,
    example: ['MG'],
  })
  @IsArray()
  @IsString({ each: true })
  modalities: string[];

  @ApiPropertyOptional({
    description: 'Study description',
    type: String,
    example: 'Routie Mamography',
  })
  description?: string;

  @ApiProperty({
    description: 'Date and time the study was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time the study was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class FullStudyDto extends StudyDto {
  @ApiProperty({
    description: 'Series in the study',
    isArray: true,
    type: SeriesDto,
  })
  @IsArray()
  @Type(() => SeriesDto)
  series: SeriesDto[];
}

export class BasicScanDto extends OmitType(CreateScanDto, ['scanURLs']) {
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

  @ApiProperty({
    description: 'Study data',
    type: FullStudyDto,
  })
  @Type(() => FullStudyDto)
  study: FullStudyDto;
}

export class ScanDto extends OmitType(FullScanDto, ['study']) {}

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
