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

  @ArrayUnique()
  @IsString({ each: true })
  biomarkers: string[];
}
export class UpdateLaboratoryTestDto extends PartialType(
  CreateLaboratoryTestDto,
) {}
