import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DosageForm, RouteOfAdministration } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateMedicationDto {
  @ApiProperty({
    description: 'Medication name',
    type: String,
    example: 'Paracetamol',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Medication description',
    type: String,
    example: 'Paracetamol is a pain reliever and a fever reducer.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Medication strength',
    type: Number,
    example: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  strength: number;

  @ApiProperty({
    description: 'Medication unit',
    type: String,
    example: 'mg',
  })
  @IsNotEmpty()
  @IsString()
  unit: string;

  @ApiProperty({
    description: 'Medication dosage form',
    enum: DosageForm,
    example: DosageForm.tablet,
  })
  @IsNotEmpty()
  @IsEnum(DosageForm)
  dosageForm: DosageForm;

  @ApiProperty({
    description: 'Medication route of administration',
    enum: RouteOfAdministration,
    example: RouteOfAdministration.oral,
  })
  @IsNotEmpty()
  @IsEnum(RouteOfAdministration)
  routeOfAdministration: RouteOfAdministration;
}

export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {}

export class MedicationDto extends CreateMedicationDto {
  @ApiProperty({
    description: 'Medication ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the medication was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the medication was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
