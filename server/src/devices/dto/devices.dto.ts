import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsIn,
  IsInt,
  IsUUID,
  IsEnum,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DeviceStatus } from '@prisma/client';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

import { ManufacturerDto } from 'src/settings/manufacturers/dto/manufacturers.dto';

export class CreateDeviceDto {
  @ApiProperty({
    description: 'Device name',
    type: String,
    example: 'Linear Accelerator',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Device serial number',
    type: String,
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsString()
  serialNumber: string;

  @ApiProperty({
    description: 'Device manufacturer ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  manufacturerId: string;

  @ApiProperty({
    description: 'Device price',
    type: Number,
    example: 2000,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Device status',
    enum: DeviceStatus,
    example: 'active',
  })
  @IsEnum(DeviceStatus)
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  status: DeviceStatus;

  @ApiPropertyOptional({
    description: 'Device image URL',
    type: String,
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  imageURL?: string;

  @ApiPropertyOptional({
    description: 'Device description',
    type: String,
    example:
      'A linear accelerator (LINAC) is the device most commonly used for external beam radiation treatments for patients with cancer.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Device purchase date',
    type: String,
    example: new Date().toISOString(),
  })
  @IsNotEmpty()
  @IsDateString()
  purchaseDate: string;
}

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}

export class DeviceDto extends OmitType(CreateDeviceDto, ['purchaseDate']) {
  @ApiProperty({
    description: 'Device ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Device manufacturer',
    type: ManufacturerDto,
  })
  @Type(() => ManufacturerDto)
  manufacturer: ManufacturerDto;

  @ApiProperty({
    description: 'Device purchase date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  purchaseDate: Date;

  @ApiProperty({
    description: 'The date and time the device was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the device was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class GetAllDevicesQuery {
  @ApiPropertyOptional({
    name: 'page',
    type: Number,
    description: 'Page number',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @ApiPropertyOptional({
    name: 'limit',
    type: Number,
    description: 'Number of devices per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @ApiPropertyOptional({
    name: 'status',
    description: 'Filter devices by status',
    enum: ['active', 'inactive', 'all'],
    example: 'active',
  })
  @IsOptional()
  @IsIn(['all', 'active', 'inactive'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  status?: 'all' | DeviceStatus;

  @ApiPropertyOptional({
    name: 'value',
    type: String,
    description: 'Search value',
    example: 'MX-1000',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    name: 'sort',
    description: 'Sort devices by field',
    enum: ['name-asc', 'name-desc', 'purchaseDate-asc', 'purchaseDate-desc'],
    example: 'purchaseDate-desc',
  })
  @IsOptional()
  @IsIn(['name-desc', 'name-asc', 'purchaseDate-desc', 'purchaseDate-asc'])
  sort?: 'name-desc' | 'name-asc' | 'purchaseDate-desc' | 'purchaseDate-asc';
}
