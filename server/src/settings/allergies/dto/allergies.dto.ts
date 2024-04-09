import { PartialType } from '@nestjs/mapped-types';

import { IsString } from 'class-validator';

export class CreateAllergyDto {
  @IsString()
  name: string;

  @IsString()
  description?: string;
}

export class UpdateAllergyDto extends PartialType(CreateAllergyDto) {}