import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsIn,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { TherapyDto } from 'src/settings/therapies/dto/therapies.dto';
import { BasicAppointmentDto } from 'src/appointments/dto/appointments.dto';

export class CreateTreatmentDto {
  @ApiProperty({
    description: 'Name of the treatment',
    type: String,
    example: 'Chemotherapy #1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Therapy ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  therapyId: string;

  @ApiProperty({
    description: 'Appointment ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  appointmentId: string;

  @ApiProperty({
    description: 'Dosage of the treatment',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  dosage: number;

  @ApiProperty({
    description: 'Duration of the treatment',
    type: Number,
    example: 30,
  })
  @IsNotEmpty()
  @IsInt()
  duration: number;

  @ApiPropertyOptional({
    description: 'Response to the treatment',
    type: String,
    example: 'Good',
  })
  @IsOptional()
  @IsString()
  response?: string;

  @ApiPropertyOptional({
    description: 'Side effect of the treatment',
    type: String,
    example: 'Nausea',
  })
  @IsOptional()
  @IsString()
  sideEffect?: string;

  @ApiPropertyOptional({
    description: 'Notes for the treatment',
    type: String,
    example: 'Take with food',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTreatmentDto extends PartialType(CreateTreatmentDto) {}

export class BasicTreatmentDto extends CreateTreatmentDto {
  @ApiPropertyOptional({
    description: 'Treatment ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({
    description: 'The date and time the treatment were created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'The date and time the treatment were last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class TreatmentDto extends BasicTreatmentDto {
  @ApiProperty({
    description: 'Therapy information',
    type: TherapyDto,
  })
  @Type(() => TherapyDto)
  therapy: TherapyDto;
}

export class FullTreatmentDto extends TreatmentDto {
  @ApiProperty({
    description: 'Appointment data',
    type: BasicAppointmentDto,
  })
  @Type(() => BasicAppointmentDto)
  appointment: BasicAppointmentDto;
}

export class GetPatientTreatmentsQuery {
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
    description: 'Number of treatments per page',
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
    example: 'chemo',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    name: 'sort',
    type: String,
    description: 'Sort treatments by field',
    enum: ['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'],
    example: 'name-asc',
  })
  @IsOptional()
  @IsIn(['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'])
  sort?: 'name-desc' | 'name-asc' | 'createdAt-desc' | 'createdAt-asc';
}
