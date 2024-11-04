import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateTherapyDto {
  @ApiProperty({
    description: 'Name of the therapy',
    type: String,
    example: 'Chemotherapy',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Description of the therapy',
    type: String,
    example:
      'Chemotherapy is a type of cancer treatment that uses drugs to destroy cancer cells.',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Unit of the therapy',
    type: String,
    example: 'per session',
  })
  @IsString()
  @IsOptional()
  unit: string;

  @ApiProperty({
    description: 'Price of the therapy',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateTherapyDto extends PartialType(CreateTherapyDto) {}

export class TherapyDto extends CreateTherapyDto {
  @ApiProperty({
    description: 'ID of the therapy',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Date and time the therapy was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Date and time the therapy was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
