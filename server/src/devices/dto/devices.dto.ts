import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsIn,
  IsInt,
} from 'class-validator';
import { Transform } from 'class-transformer';
import type { DeviceStatus } from '@prisma/client';

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

  @IsIn(['active', 'inactive'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  status: 'active' | 'inactive';

  @IsOptional()
  @IsString()
  imageURL?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  purchaseDate: string;
}

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}

export class GetAllDevicesQuery {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @IsOptional()
  @IsIn(['all', 'active', 'inactive'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  status?: 'all' | DeviceStatus;

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsIn(['name-desc', 'name-asc', 'purchaseDate-desc', 'purchaseDate-asc'])
  sort?: 'name-desc' | 'name-asc' | 'purchaseDate-desc' | 'purchaseDate-asc';
}
