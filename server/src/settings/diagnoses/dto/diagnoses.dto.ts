import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateDiagnosisDto {
  @ApiProperty({
    description: 'Diagnosis name',
    type: String,
    example: 'Diabetes',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Diagnosis description',
    type: String,
    example:
      'Diabetes is a disease that occurs when your blood glucose, also called blood sugar, is too high.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateDiagnosisDto extends PartialType(CreateDiagnosisDto) {}

export class DiagnosisDto extends CreateDiagnosisDto {
  @ApiProperty({
    description: 'Diagnosis ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the diagnosis was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the diagnosis was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
