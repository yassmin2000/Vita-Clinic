import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { AppointmentStatus, Sex } from '@prisma/client';

export class GetInvoicesDataQuery {
  @ApiPropertyOptional({
    description: 'Start date',
    type: String,
    example: new Date(
      new Date().setDate(new Date().getDate() - 7),
    ).toISOString(),
  })
  @IsOptional()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'End date',
    type: String,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  endDate: string;
}

export class GetAppointmentsDataQuery {
  @ApiPropertyOptional({
    description: 'Year',
    type: Number,
    example: new Date().getFullYear(),
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  year: number;

  @ApiPropertyOptional({
    description: 'Appointment status',
    enum: ['all', 'completed', 'approved', 'pending', 'rejected', 'cancelled'],
    example: 'completed',
  })
  @IsOptional()
  @IsIn(['all', 'completed', 'approved', 'pending', 'rejected', 'cancelled'])
  status: AppointmentStatus | 'all';
}

export class AdminAppointmentsCountDto {
  @ApiProperty({
    description: 'Total number of appointments',
    type: Number,
    example: 100,
  })
  @IsNumber()
  all: number;

  @ApiProperty({
    description: 'Number of completed appointments',
    type: Number,
    example: 50,
  })
  completed: number;

  @ApiProperty({
    description: 'Number of approved appointments',
    type: Number,
    example: 20,
  })
  approved: number;

  @ApiProperty({
    description: 'Number of pending appointments',
    type: Number,
    example: 10,
  })
  pending: number;

  @ApiProperty({
    description: 'Number of rejected appointments',
    type: Number,
    example: 10,
  })
  cancelled: number;

  @ApiProperty({
    description: 'Number of cancelled appointments',
    type: Number,
    example: 10,
  })
  rejected: number;
}

export class AdminDashboardGeneralStatisticsDto {
  @ApiProperty({
    description: 'Number of patients',
    type: Number,
    example: 100,
  })
  @IsNumber()
  patientsCount: number;

  @ApiProperty({
    description: 'Number of doctors',
    type: Number,
    example: 20,
  })
  @IsNumber()
  doctorsCount: number;

  @ApiProperty({
    description: 'Number of appointments',
    type: AdminAppointmentsCountDto,
  })
  @Type(() => AdminAppointmentsCountDto)
  appointmentsCount: AdminAppointmentsCountDto;

  @ApiProperty({
    description: 'Number of devices',
    type: Number,
    example: 5,
  })
  @IsNumber()
  devicesCount: number;
}

export class DoctorDashboardGeneralStatisticsDto extends OmitType(
  AdminDashboardGeneralStatisticsDto,
  ['appointmentsCount', 'doctorsCount'],
) {
  @ApiProperty({
    description: 'Number of doctor appointments',
    type: Number,
    example: 20,
  })
  @IsNumber()
  appointmentsCount: number;
}

enum InvoiceType {
  'Completed',
  'Pending',
  'Cancelled',
}

class InvoiceDataDto {
  @ApiProperty({
    description: 'Day',
    type: String,
    example: new Date().toISOString().split('T')[0],
  })
  @IsString()
  x: string;

  @ApiProperty({
    description: 'Sum of invoices cost',
    type: Number,
    example: 200,
  })
  @IsNumber()
  y: number;
}

export class DashboardInvoicseDataDto {
  @ApiProperty({
    description: 'Invoice type',
    enum: InvoiceType,
    example: 'Completed',
  })
  @IsEnum(InvoiceType)
  id: string;

  @ApiProperty({
    description: 'Invoice data',
    isArray: true,
    type: InvoiceDataDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceDataDto)
  data: InvoiceDataDto[];
}

export class DashboardAppointmentsDataDto {
  @ApiProperty({
    description: 'Day',
    type: String,
    example: new Date().toISOString().split('T')[0],
  })
  @IsString()
  day: string;

  @ApiProperty({
    description: 'Number of appointments',
    type: Number,
    example: 10,
  })
  value: number;
}

export enum AgeGroup {
  '0-6',
  '7-12',
  '13-18',
  '19-30',
  '31-36',
  '37-42',
  '43-48',
  '49-54',
  '55-60',
  '+61',
}

export class DashboardPatientsAgeSexDataDto {
  @ApiProperty({
    description: 'Age group',
    enum: AgeGroup,
    example: '19-30',
  })
  @IsEnum(AgeGroup)
  ageGroup: AgeGroup;

  @ApiProperty({
    description: 'Number of male patients',
    type: Number,
    example: 10,
  })
  male: number;

  @ApiProperty({
    description: 'Number of female patients',
    type: Number,
    example: 15,
  })
  female: number;
}

export class DashboardDoctorsSexDataDto {
  @ApiProperty({
    description: 'Doctor sex',
    enum: Sex,
    example: 'male',
  })
  @IsEnum(Sex)
  id: Sex;

  @ApiProperty({
    description: 'Number of doctors',
    type: Number,
    example: 10,
  })
  @IsNumber()
  value: number;
}

export class DashboardDoctorsAppointmentsDataDto {
  @ApiProperty({
    description: 'Doctor ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Doctor name',
    type: String,
    example: 'Dr. John Doe',
  })
  @IsString()
  label: string;

  @ApiProperty({
    description: 'Number of appointments',
    type: Number,
    example: 10,
  })
  @IsNumber()
  value: number;
}

class ItemCountDto {
  @ApiProperty({
    description: 'Item Name',
    type: String,
    example: 'item',
  })
  name: string;

  @ApiProperty({
    description: 'Item Count',
    type: Number,
    example: 10,
  })
  count: number;
}

export class DashboardMedicalInsightsDto {
  @ApiProperty({
    description: 'Diagnoses data count',
    isArray: true,
    type: ItemCountDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCountDto)
  diagnoses: ItemCountDto[];

  @ApiProperty({
    description: 'Allergies data count',
    isArray: true,
    type: ItemCountDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCountDto)
  allergies: ItemCountDto[];

  @ApiProperty({
    description: 'Medications data count',
    isArray: true,
    type: ItemCountDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCountDto)
  medications: ItemCountDto[];

  @ApiProperty({
    description: 'Surgeries data count',
    isArray: true,
    type: ItemCountDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCountDto)
  surgeries: ItemCountDto[];
}

export class DashboardMedicalServicesInsightsDto {
  @ApiProperty({
    description: 'Services data count',
    isArray: true,
    type: ItemCountDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCountDto)
  services: ItemCountDto[];

  @ApiProperty({
    description: 'Therapies data count',
    isArray: true,
    type: ItemCountDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCountDto)
  therapies: ItemCountDto[];

  @ApiProperty({
    description: 'Scans data count',
    isArray: true,
    type: ItemCountDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCountDto)
  scans: ItemCountDto[];

  @ApiProperty({
    description: 'Laboratory tests data count',
    isArray: true,
    type: ItemCountDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemCountDto)
  laboratoryTests: ItemCountDto[];
}
