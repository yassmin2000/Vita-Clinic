import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsDate,
} from 'class-validator';

export class CreateMedicalConditionDto {
  @ApiProperty({
    description: 'Medical condition name',
    type: String,
    example: 'Diabetes',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Medical condition description',
    type: String,
    example:
      'Diabetes is a disease that occurs when your blood glucose, also called blood sugar, is too high.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateMedicalConditionDto extends PartialType(
  CreateMedicalConditionDto,
) {}

export class MedicalConditionDto extends CreateMedicalConditionDto {
  @ApiProperty({
    description: 'Medical condition ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Medical condition created date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Medical condition updated date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
