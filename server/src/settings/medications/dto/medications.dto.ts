import { PartialType } from '@nestjs/mapped-types';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import type { DosageForm, RouteOfAdministration } from '@prisma/client';

export class CreateMedicationDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  strength: number;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsIn(['tablet', 'capsule', 'topical', 'syrup', 'injection', 'inhaler'])
  dosageForm: DosageForm;

  @IsNotEmpty()
  @IsIn([
    'oral',
    'injection',
    'inhalation',
    'nasal',
    'otic',
    'ophthalmic',
    'rectal',
    'vaginal',
    'intravenous',
    'intramuscular',
    'subcutaneous',
  ])
  routeOfAdministration: RouteOfAdministration;
}

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {}
