import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class BiomarkerValue {
  @IsNotEmpty()
  @IsString()
  biomarkerId: string;

  @IsNumber()
  value: number;
}

export class CreateLaboratoryTestResultDto {
  @IsNotEmpty()
  @IsString()
  appointmentId: string;

  @IsNotEmpty()
  @IsString()
  laboratoryTestId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BiomarkerValue)
  values: BiomarkerValue[];
}

export class UpdateLaboratoryTestResultDto extends PartialType(
  CreateLaboratoryTestResultDto,
) {}

export class GetPatientTestResultsQuery {
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
