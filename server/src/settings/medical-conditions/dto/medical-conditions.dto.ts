import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateMedicalConditionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateMedicalConditionDto extends PartialType(CreateMedicalConditionDto) {}
