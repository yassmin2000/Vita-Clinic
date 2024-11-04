import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  ArrayUnique,
  IsUUID,
  IsArray,
  ValidateNested,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

import { BiomarkerDto } from 'src/settings/biomarkers/dto/biomarkers.dto';

export class CreateLaboratoryTestDto {
  @ApiProperty({
    description: 'Laboratory test name',
    type: String,
    example: 'Complete Blood Count (CBC)',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Laboratory test description',
    type: String,
    example:
      'A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Laboratory test price',
    type: Number,
    example: 200,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Laboratory test biomarkers IDs',
    isArray: true,
    type: String,
    example: [crypto.randomUUID()],
  })
  @ArrayUnique()
  @IsString({ each: true })
  biomarkers: string[];
}

export class UpdateLaboratoryTestDto extends PartialType(
  CreateLaboratoryTestDto,
) {}

export class LaboratoryTestDto extends OmitType(CreateLaboratoryTestDto, [
  'biomarkers',
]) {
  @ApiProperty({
    description: 'Laboratory test ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Laboratory test biomarkers',
    isArray: true,
    type: BiomarkerDto,
  })
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => BiomarkerDto)
  biomarkers: BiomarkerDto[];

  @ApiProperty({
    description: 'The date and time the laboratory test was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the laboratory test was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
