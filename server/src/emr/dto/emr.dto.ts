import {
  IsArray,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import type {
  AlcoholStatus,
  BloodType,
  DrugsUsage,
  SmokingStatus,
} from '@prisma/client';

class AllergyDto {
  @IsString()
  allergyId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  reaction?: string;
}

export class PatientAllergiesDto {
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllergyDto)
  new: AllergyDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllergyDto)
  updated: AllergyDto[];
}

class DiagnosisDto {
  @IsString()
  diagnosisId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  date: Date;
}

export class PatientDiagnosesDto {
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiagnosisDto)
  new: DiagnosisDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiagnosisDto)
  updated: DiagnosisDto[];
}

class MedicalConditionDto {
  @IsString()
  medicalConditionId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  date: Date;
}

export class PatientMedicalConditionsDto {
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalConditionDto)
  new: MedicalConditionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalConditionDto)
  updated: MedicalConditionDto[];
}

class SurgeryDto {
  @IsString()
  surgeryId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  date: Date;
}

export class PatientSurgeriesDto {
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurgeryDto)
  new: SurgeryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SurgeryDto)
  updated: SurgeryDto[];
}

export class EmrDto {
  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsIn([
    'a_positive',
    'a_negative',
    'b_positive',
    'b_negative',
    'ab_positive',
    'ab_negative',
    'o_positive',
    'o_negative',
  ])
  bloodType?: BloodType;

  @IsOptional()
  @IsIn(['never', 'former', 'current'])
  smokingStatus?: SmokingStatus;

  @IsOptional()
  @IsIn(['never', 'former', 'current'])
  alcoholStatus?: AlcoholStatus;

  @IsOptional()
  @IsIn(['never', 'former', 'current'])
  drugsUsage?: DrugsUsage;

  @IsOptional()
  @ValidateNested()
  @Type(() => PatientAllergiesDto)
  allergies?: PatientAllergiesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PatientDiagnosesDto)
  diagnoses?: PatientDiagnosesDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PatientMedicalConditionsDto)
  medicalConditions?: PatientMedicalConditionsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PatientSurgeriesDto)
  surgeries?: PatientSurgeriesDto;
}
