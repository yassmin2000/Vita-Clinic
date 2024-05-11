import { PartialType } from '@nestjs/mapped-types';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    IsIn,
    IsBoolean,
    IsDateString,
    IsInt,

} from 'class-validator';

import type {Frequency} from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreatePrescriptionDto {
    @IsNotEmpty()
    @IsString()
    medicationId: string;

    @IsString()
    @IsNotEmpty()
    appointmentId: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @IsOptional()
    @IsDateString()
    endDate?: Date;

    @IsOptional()
    @IsNumber()
    dosage?: number;

    @IsOptional()
    @IsIn(['daily', 'weekly', 'monthly', 'yearly'])
    frequency?: Frequency;

    @IsBoolean()
    required: boolean;
}

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) { }

export class GetPatientPrescriptionsQuery {
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
  