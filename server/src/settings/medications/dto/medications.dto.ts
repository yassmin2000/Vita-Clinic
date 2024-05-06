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
  @IsIn([
    'tablet',
    'capsule',
    'syrup',
    'injection',
    'ointment',
    'cream',
    'lotion',
    'inhaler',
    'drops',
    'suppository',
    'patch',
    'gel',
    'spray',
    'solution',
    'powder',
    'suspension',
  ])
  dosageForm: DosageForm;

  @IsNotEmpty()
  @IsIn([
    'oral',
    'sublingual',
    'buccal',
    'rectal',
    'vaginal',
    'intravenous',
    'intramuscular',
    'subcutaneous',
    'intradermal',
    'transdermal',
    'intrathecal',
    'intraarticular',
    'intranasal',
    'inhalation',
    'ocular',
    'otic',
    'topically',
    'epidural',
    'intracardiac',
  ])
  routeOfAdministration: RouteOfAdministration;
}

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {}
