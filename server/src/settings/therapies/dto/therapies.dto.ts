import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateTherapyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  unit: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateTherapyDto extends PartialType(CreateTherapyDto) {}
