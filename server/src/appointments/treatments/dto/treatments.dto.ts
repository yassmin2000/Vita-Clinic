import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateTreatmentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  therapyId: string;

  @IsNotEmpty()
  @IsString()
  appointmentId: string;

  @IsNotEmpty()
  @IsNumber()
  dosage: number;

  @IsNotEmpty()
  @IsInt()
  duration: number;

  @IsOptional()
  @IsString()
  response?: string;

  @IsOptional()
  @IsString()
  sideEffect?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateTreatmentDto extends PartialType(CreateTreatmentDto) {}

export class GetPatientTreatmentsQuery {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsIn(['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'])
  sort?: 'name-desc' | 'name-asc' | 'createdAt-desc' | 'createdAt-asc';
}
