import { PartialType } from '@nestjs/mapped-types';
import { ArrayUnique, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScanDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsString({ each: true })
  scanURLs: string[];
  
  @IsNotEmpty()
  @IsString()
  modalityId: string;

  @IsNotEmpty()
  @IsString()
  appointmentId: string;
}
export class UpdateScanDto extends PartialType(CreateScanDto) {}
