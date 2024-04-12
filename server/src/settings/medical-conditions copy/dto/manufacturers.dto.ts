import { IsString,IsOptional,  } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateManufacturerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateManufacturerDto extends PartialType(CreateManufacturerDto) {}








