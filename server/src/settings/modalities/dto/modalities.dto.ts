import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateModalityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateModalityDto extends PartialType(CreateModalityDto) {}
