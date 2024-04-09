import { IsString, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateDiagnosisDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDiagnosisDto extends PartialType(CreateDiagnosisDto) {}
