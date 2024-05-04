import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateVitalsDto {
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsString()
  bloodPressure?: string;

  @IsOptional()
  @IsNumber()
  heartRate?: number;

  @IsOptional()
  @IsNumber()
  respiratoryRate?: number;

  @IsOptional()
  @IsString()
  oxygenSaturation?: number;

  @IsString()
  appointmentId: string;
}
export class UpdateVitalsDto extends PartialType(CreateVitalsDto) {}