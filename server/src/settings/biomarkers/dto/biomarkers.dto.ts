import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBiomarkerDto {
  @ApiProperty({
    description: 'Biomarker name',
    type: String,
    example: 'Blood pressure',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Biomarker description',
    type: String,
    example: 'Blood pressure of the patient',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Minimum value of the biomarker',
    type: Number,
    example: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  minimumValue: number;

  @ApiProperty({
    description: 'Maximum value of the biomarker',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  maximumValue: number;

  @ApiProperty({
    description: 'Unit of the biomarker',
    type: String,
    example: 'mmHg',
  })
  @IsNotEmpty()
  @IsString()
  unit: string;
}

export class UpdateBiomarkerDto extends PartialType(CreateBiomarkerDto) {}

export class BiomarkerDto extends CreateBiomarkerDto {
  @ApiProperty({
    description: 'Biomarker ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the biomarker was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the biomarker was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
