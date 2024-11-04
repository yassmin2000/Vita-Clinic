import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  IsBoolean,
  IsDateString,
  IsInt,
  IsUUID,
  IsEnum,
  IsDate,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Frequency } from '@prisma/client';

import { MedicationDto } from 'src/settings/medications/dto/medications.dto';
import { BasicAppointmentDto } from 'src/appointments/dto/appointments.dto';

export class CreatePrescriptionDto {
  @ApiProperty({
    description: 'Medication ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  medicationId: string;

  @ApiProperty({
    description: 'Appointment ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  appointmentId: string;

  @ApiPropertyOptional({
    description: 'Notes for the prescription',
    type: String,
    example: 'Take with food',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Start date of the prescription',
    type: Date,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date of the prescription',
    type: Date,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Dosage of the prescription',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  dosage?: number;

  @ApiPropertyOptional({
    description: 'Frequency of the prescription',
    enum: Frequency,
    example: Frequency.daily,
  })
  @IsOptional()
  @IsEnum(Frequency)
  frequency?: Frequency;

  @ApiPropertyOptional({
    description: 'Indicates if the prescription is required',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  required: boolean;
}

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {}

export class BasicPrescriptionDto extends OmitType(CreatePrescriptionDto, [
  'startDate',
  'endDate',
]) {
  @ApiProperty({
    description: 'Prescription ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Medication details',
    type: MedicationDto,
  })
  @Type(() => MedicationDto)
  medication: MedicationDto;

  @ApiPropertyOptional({
    description: 'Start date of the prescription',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'End date of the prescription',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    description: 'Date and time the prescription was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time the prescription was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class PrescriptionDto extends BasicPrescriptionDto {
  @ApiProperty({
    description: 'Appointment data',
    type: BasicAppointmentDto,
  })
  @Type(() => BasicAppointmentDto)
  appointment: BasicAppointmentDto;
}

export class GetPatientPrescriptionsQuery {
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
    description: 'Number of prescriptions per page',
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
    example: 'Paracetamol',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    name: 'sort',
    description: 'Sort prescriptions by field',
    enum: ['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'],
    example: 'name-asc',
  })
  @IsOptional()
  @IsIn(['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'])
  sort?: 'name-desc' | 'name-asc' | 'createdAt-desc' | 'createdAt-asc';
}
