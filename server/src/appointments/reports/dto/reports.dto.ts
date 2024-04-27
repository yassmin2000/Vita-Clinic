import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsUrl()
  reportURL: string;

  @IsNotEmpty()
  @IsString()
  fileName: string;

  @IsNotEmpty()
  @IsString()
  appointmentId: string;
}

export class UpdateReportDto extends PartialType(CreateReportDto) {}

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsBoolean()
  isUserMessage: boolean;
}
