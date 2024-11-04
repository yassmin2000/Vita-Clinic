import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Service name',
    type: String,
    example: 'Consultation',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Service description',
    type: String,
    example: 'Consultation with a doctor',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Service price',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class ServiceDto extends CreateServiceDto {
  @ApiProperty({
    description: 'Service ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the service was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the service was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
