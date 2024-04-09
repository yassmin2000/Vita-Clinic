import { PartialType } from '@nestjs/mapped-types';

import { IsString } from 'class-validator';

export class CreateMedicationDto {
  @IsString()
  name: string;

  @IsString()
  description?: string;
}

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {}