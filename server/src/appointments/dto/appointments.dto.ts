import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
  IsInt,
  ArrayUnique,
  IsBoolean,
  IsUUID,
  IsDate,
  IsEnum,
  IsArray,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';

import { AppointmentStatus, BillingStatus } from '@prisma/client';
import { InsuranceDto } from 'src/users/patients/dto/patients.dto';
import { BasicUserDto } from 'src/users/dto/users-response.dto';
import { VitalsDto } from '../vitals/dto/vitals.dto';
import { ServiceDto } from 'src/settings/services/dto/services.dto';
import { TherapyDto } from 'src/settings/therapies/dto/therapies.dto';
import { ModalityDto } from 'src/settings/modalities/dto/modalities.dto';
import { LaboratoryTestDto } from 'src/settings/laboratory-tests/dto/laboratory-test.dto';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'Appointment date',
    type: String,
    example: new Date().toISOString(),
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    description: 'Appointment extra notes',
    type: String,
    example: 'Patient is allergic to penicillin',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Needed service ID (If any)',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsOptional()
  @IsUUID()
  service?: string;

  @ApiPropertyOptional({
    description: 'Needed therapy ID (If any)',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsOptional()
  @IsUUID()
  therapy?: string;

  @ApiPropertyOptional({
    description: 'Needed scans (If any)',
    isArray: true,
    type: String,
    example: [crypto.randomUUID()],
  })
  @ArrayUnique()
  @IsString({ each: true })
  scans: string[];

  @ApiPropertyOptional({
    description: 'Needed lab works (If any)',
    isArray: true,
    type: String,
    example: [crypto.randomUUID()],
  })
  @ArrayUnique()
  @IsString({ each: true })
  labWorks: string[];
}

export class BasicAppointmentDto {
  @ApiProperty({
    description: 'Appointment ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Appointment number',
    type: Number,
    example: 1,
  })
  number: number;

  @ApiProperty({
    description: 'Appointment date',
    type: String,
    example: new Date(),
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Appointment status',
    enum: AppointmentStatus,
    example: AppointmentStatus.approved,
  })
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;

  @ApiProperty({
    description: 'Patient ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'Patient EMR ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  emrId: string;

  @ApiPropertyOptional({
    description: 'Doctor ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  doctorId?: string;

  @ApiProperty({
    description: 'Appointment billing ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  billingId: string;

  @ApiProperty({
    description: 'Appointment services ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  appointmentServicesId: string;

  @ApiProperty({
    description: 'Appointment vitals ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  vitalsId: string;

  @ApiProperty({
    description: 'The date and time the appointment was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the appointment was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

class AppointEmrDto {
  @ApiPropertyOptional({
    description: 'Insurance data',
    type: InsuranceDto,
  })
  @Type(() => InsuranceDto)
  insurance?: InsuranceDto;
}

export class AppointmentListItemDto extends BasicAppointmentDto {
  @ApiProperty({
    description: 'Patient data',
    type: BasicUserDto,
  })
  @Type(() => BasicUserDto)
  patient: BasicUserDto;

  @ApiPropertyOptional({
    description: 'Doctor data',
    type: BasicUserDto,
  })
  @Type(() => BasicUserDto)
  doctor?: BasicUserDto;

  @ApiProperty({
    description: 'EMR data',
    type: AppointEmrDto,
  })
  @Type(() => AppointEmrDto)
  emr: AppointEmrDto;
}

class AppointmentServicesDto {
  @ApiProperty({
    description: 'Appointment services ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Service data',
    type: ServiceDto,
  })
  @Type(() => ServiceDto)
  service: ServiceDto;

  @ApiProperty({
    description: 'Therapy data',
    type: TherapyDto,
  })
  @Type(() => TherapyDto)
  therapy: TherapyDto;

  @ApiProperty({
    description: 'Scans list',
    isArray: true,
    type: ModalityDto,
  })
  @IsArray()
  @Type(() => ModalityDto)
  scans: ModalityDto[];

  @ApiProperty({
    description: 'Lab works list',
    isArray: true,
    type: OmitType(LaboratoryTestDto, ['biomarkers']),
  })
  @IsArray()
  @Type(() => OmitType(LaboratoryTestDto, ['biomarkers']))
  labWorks: Omit<LaboratoryTestDto, 'biomarkers'>[];

  @ApiPropertyOptional({
    description: 'Extra notes',
    type: String,
    example: 'Patient is allergic to penicillin',
  })
  @IsString()
  notes?: string;
}

class AppointmentBillingDto {
  @ApiProperty({
    description: 'Billing ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Billing number',
    type: Number,
    example: 1,
  })
  @IsNumber()
  number: number;

  @ApiProperty({
    description: 'Billing status',
    enum: BillingStatus,
    example: BillingStatus.paid,
  })
  @IsEnum(BillingStatus)
  status: BillingStatus;

  @ApiProperty({
    description: 'Billing amount',
    type: Number,
    example: 100,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Billing date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'The date and time the billing was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the billing was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class AppointmentDto extends AppointmentListItemDto {
  @ApiProperty({
    description: 'Appointment vital data',
    type: VitalsDto,
  })
  @Type(() => VitalsDto)
  vitals: VitalsDto;

  @ApiProperty({
    description: 'Appointment services data',
    type: AppointmentServicesDto,
  })
  @Type(() => AppointmentServicesDto)
  services: AppointmentServicesDto;

  @ApiProperty({
    description: 'Appointment billing data',
    type: AppointmentBillingDto,
  })
  @Type(() => AppointmentBillingDto)
  billing: AppointmentBillingDto;
}

export class CreateAppointmentResponseDto extends OmitType(AppointmentDto, [
  'patient',
  'doctor',
  'emr',
  'vitals',
]) {}

export class GetAllAppointmentsQuery {
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
    description: 'Number of appointments per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @ApiPropertyOptional({
    name: 'status',
    description: 'Filter appointments by status',
    enum: ['all', 'pending', 'rejected', 'approved', 'completed', 'cancelled'],
    example: 'all',
  })
  @IsOptional()
  @IsIn(['all', 'pending', 'rejected', 'approved', 'completed', 'cancelled'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  status?: 'all' | AppointmentStatus;

  @ApiPropertyOptional({
    name: 'doctor',
    type: Boolean,
    description: 'Show only assigned appointments to current doctor',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true', { toClassOnly: true })
  doctor?: boolean;

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
    description: 'Sort appointments by field',
    enum: [
      'date-desc',
      'date-asc',
      'patientName-asc',
      'patientName-desc',
      'doctorName-asc',
      'doctorName-desc',
      'bookingDate-desc',
      'bookingDate-asc',
    ],
    example: 'date-asc',
  })
  @IsOptional()
  @IsIn([
    'date-desc',
    'date-asc',
    'patientName-asc',
    'patientName-desc',
    'doctorName-asc',
    'doctorName-desc',
    'bookingDate-desc',
    'bookingDate-asc',
  ])
  sort?:
    | 'date-desc'
    | 'date-asc'
    | 'patientName-asc'
    | 'patientName-desc'
    | 'doctorName-asc'
    | 'doctorName-desc'
    | 'bookingDate-desc'
    | 'bookingDate-asc';
}

export class ApproveAppointmentDto {
  @ApiProperty({
    description: 'Doctor ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  doctorId: string;
}

export class CompleteAppointmentDto {
  @ApiProperty({
    description: 'Billing status',
    enum: ['paid', 'insurance'],
    type: String,
    example: 'paid',
  })
  @IsIn(['paid', 'insurance'])
  billingStatus: BillingStatus;
}
