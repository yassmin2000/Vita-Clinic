import { IsString, IsOptional, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateBiomarkerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  minimumValue: number;

  @IsNumber()
  maximumValue: number;

  @IsString()
  unit: string;
}

export class UpdateBiomarkerDto extends PartialType(CreateBiomarkerDto) {}
