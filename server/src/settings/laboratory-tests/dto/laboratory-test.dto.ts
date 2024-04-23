import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateLaboratoryTestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  biomarkerIds: string[]; // Array of biomarker IDs
}
export class UpdateLaboratoryTestDto extends PartialType(
  CreateLaboratoryTestDto,
) {}
