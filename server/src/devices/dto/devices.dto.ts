import { IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @IsNotEmpty()
  @IsString()
  manufacturerId: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsString()
  description?: string;

  @IsDateString()
  purchaseDate?: string;
}

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
