import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateBiomarkerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  minimumValue: number;

  @IsNotEmpty()
  @IsNumber()
  maximumValue: number;

  @IsNotEmpty()
  @IsString()
  unit: string;
}

export class UpdateBiomarkerDto extends PartialType(CreateBiomarkerDto) {}
