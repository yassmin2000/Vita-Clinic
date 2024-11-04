import { Type } from 'class-transformer';
import { OmitType, PickType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  AlcoholStatus,
  BloodType,
  DrugsUsage,
  Frequency,
  Sex,
  SmokingStatus,
} from '@prisma/client';

import { AllergyDto } from 'src/settings/allergies/dto/allergies.dto';
import { DiagnosisDto } from 'src/settings/diagnoses/dto/diagnoses.dto';
import { MedicalConditionDto } from 'src/settings/medical-conditions/dto/medical-conditions.dto';
import { SurgeryDto } from 'src/settings/surgeries/dto/surgeries.dto';
import { MedicationDto } from 'src/settings/medications/dto/medications.dto';
import { InsuranceDto } from 'src/users/patients/dto/patients.dto';

class PatientAllergyDto {
  @ApiProperty({
    description: 'Allergy ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsString()
  allergyId: string;

  @ApiPropertyOptional({
    description: 'Notes',
    type: String,
    example: 'Allergy notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Patient reaction',
    example: 'Allergy reaction',
  })
  @IsOptional()
  @IsString()
  reaction?: string;
}

export class PatientAllergiesDto {
  @ApiProperty({
    description: 'Deleted allergies',
    isArray: true,
    type: String,
    example: [crypto.randomUUID()],
  })
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @ApiProperty({
    description: 'New allergies',
    isArray: true,
    type: PatientAllergyDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientAllergyDto)
  new: PatientAllergyDto[];

  @ApiProperty({
    description: 'Updated allergies',
    isArray: true,
    type: PatientAllergyDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientAllergyDto)
  updated: PatientAllergyDto[];
}

class PatientDiagnosisDto {
  @ApiProperty({
    description: 'Diagnosis ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsString()
  diagnosisId: string;

  @ApiPropertyOptional({
    description: 'Notes',
    type: String,
    example: 'Diagnosis notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Diagnosis date',
    type: String,
    example: new Date().toISOString(),
  })
  @IsDateString()
  date: Date;
}

export class PatientDiagnosesDto {
  @ApiProperty({
    description: 'Deleted diagnoses',
    isArray: true,
    type: String,
    example: [crypto.randomUUID()],
  })
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @ApiProperty({
    description: 'New diagnoses',
    isArray: true,
    type: PatientDiagnosisDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientDiagnosisDto)
  new: PatientDiagnosisDto[];

  @ApiProperty({
    description: 'Updated diagnoses',
    isArray: true,
    type: PatientDiagnosisDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientDiagnosisDto)
  updated: PatientDiagnosisDto[];
}

class PatientMedicalConditionDto {
  @ApiProperty({
    description: 'Medical condition ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsString()
  medicalConditionId: string;

  @ApiPropertyOptional({
    description: 'Notes',
    type: String,
    example: 'Medical condition notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Medical condition date',
    type: String,
    example: new Date().toISOString(),
  })
  @IsDateString()
  date: Date;
}

export class PatientMedicalConditionsDto {
  @ApiProperty({
    description: 'Deleted medical conditions',
    isArray: true,
    type: String,
    example: [crypto.randomUUID()],
  })
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @ApiProperty({
    description: 'New medical conditions',
    isArray: true,
    type: PatientMedicalConditionDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientMedicalConditionDto)
  new: PatientMedicalConditionDto[];

  @ApiProperty({
    description: 'Updated medical conditions',
    isArray: true,
    type: PatientMedicalConditionDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientMedicalConditionDto)
  updated: PatientMedicalConditionDto[];
}

class PatientSurgeryDto {
  @ApiProperty({
    description: 'Surgery ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsString()
  surgeryId: string;

  @ApiPropertyOptional({
    description: 'Notes',
    type: String,
    example: 'Surgery notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Surgery date',
    type: String,
    example: new Date().toISOString(),
  })
  @IsDateString()
  date: Date;
}

export class PatientSurgeriesDto {
  @ApiProperty({
    description: 'Deleted surgeries',
    isArray: true,
    type: String,
    example: [crypto.randomUUID()],
  })
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @ApiProperty({
    description: 'New surgeries',
    isArray: true,
    type: PatientSurgeryDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientSurgeryDto)
  new: PatientSurgeryDto[];

  @ApiProperty({
    description: 'Updated surgeries',
    isArray: true,
    type: PatientSurgeryDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientSurgeryDto)
  updated: PatientSurgeryDto[];
}

class PatientMedicationDto {
  @ApiProperty({
    description: 'Medication ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsString()
  medicationId: string;

  @ApiPropertyOptional({
    description: 'Medication notes',
    type: String,
    example: 'Medication notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Medication start date',
    type: String,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Medication end date',
    type: String,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Medication dosage',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  dosage?: number;

  @ApiPropertyOptional({
    description: 'Medication frequency',
    enum: Frequency,
    example: 'daily',
  })
  @IsOptional()
  @IsEnum(Frequency)
  frequency?: Frequency;

  @ApiProperty({
    description: 'Medication required',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  required: boolean;
}

export class PatientMedicationsDto {
  @ApiProperty({
    description: 'Deleted medications',
    isArray: true,
    type: String,
    example: [crypto.randomUUID()],
  })
  @IsArray()
  @IsString({ each: true })
  deleted: string[];

  @ApiProperty({
    description: 'New medications',
    isArray: true,
    type: PatientMedicationDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientMedicationDto)
  new: PatientMedicationDto[];

  @ApiProperty({
    description: 'Updated medications',
    isArray: true,
    type: PatientMedicationDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PatientMedicationDto)
  updated: PatientMedicationDto[];
}

export class UpdateEmrDto {
  @ApiPropertyOptional({
    description: 'Patient heigh',
    type: Number,
    example: 170,
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({
    description: 'Patient weight',
    type: Number,
    example: 70,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({
    description: 'Patient blood type',
    enum: BloodType,
    example: 'A+',
  })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @ApiPropertyOptional({
    description: 'Patient smoking status',
    enum: SmokingStatus,
    example: 'never',
  })
  @IsOptional()
  @IsEnum(SmokingStatus)
  smokingStatus?: SmokingStatus;

  @ApiPropertyOptional({
    description: 'Patient alcohol status',
    enum: AlcoholStatus,
    example: 'never',
  })
  @IsOptional()
  @IsEnum(AlcoholStatus)
  alcoholStatus?: AlcoholStatus;

  @ApiPropertyOptional({
    description: 'Patient drugs usage',
    enum: DrugsUsage,
    example: 'never',
  })
  @IsOptional()
  @IsEnum(DrugsUsage)
  drugsUsage?: DrugsUsage;

  @ApiPropertyOptional({
    description: 'Patient allergies',
    type: PatientAllergiesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientAllergiesDto)
  allergies?: PatientAllergiesDto;

  @ApiPropertyOptional({
    description: 'Patient diagnoses',
    type: PatientDiagnosesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientDiagnosesDto)
  diagnoses?: PatientDiagnosesDto;

  @ApiPropertyOptional({
    description: 'Patient medical conditions',
    type: PatientMedicalConditionsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientMedicalConditionsDto)
  medicalConditions?: PatientMedicalConditionsDto;

  @ApiPropertyOptional({
    description: 'Patient surgeries',
    type: PatientSurgeriesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientSurgeriesDto)
  surgeries?: PatientSurgeriesDto;

  @ApiPropertyOptional({
    description: 'Patient medications',
    type: PatientMedicationsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PatientMedicationsDto)
  medications?: PatientMedicationsDto;
}

class EmrPatientDto {
  @ApiProperty({
    description: 'Patient first name',
    type: String,
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Patient last name',
    type: String,
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Patient date of birth',
    type: Date,
    example: new Date('2000-01-01'),
  })
  @IsDate()
  birthDate: Date;

  @ApiProperty({
    description: 'User sex',
    enum: Sex,
    example: 'male',
  })
  @IsEnum(Sex)
  sex: Sex;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    type: String,
    example: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
  })
  @IsString()
  avatarURL?: string;
}

class EmrPatientAllergyDto extends OmitType(PatientAllergyDto, ['reaction']) {
  @ApiProperty({
    description: 'Patient Allergy ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Allergy data',
    type: AllergyDto,
  })
  @Type(() => AllergyDto)
  allergy: AllergyDto;

  @ApiPropertyOptional({
    description: 'Patient reaction',
    type: String,
    example: 'Allergy reaction',
  })
  @IsString()
  reaction?: string;

  @ApiProperty({
    description: 'The date and time the allergy was created in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the allergy was last updated in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

class EmrPatientDiagnosisDto extends OmitType(PatientDiagnosisDto, ['date']) {
  @ApiProperty({
    description: 'Patient Diagnosis ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Diagnosis data',
    type: DiagnosisDto,
  })
  @Type(() => DiagnosisDto)
  diagnosis: DiagnosisDto;

  @ApiProperty({
    description: 'Diagnosis date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'The date and time the diagnosis was created in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the diagnosis was last updated in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

class EmrPatientMedicalConditionDto extends OmitType(
  PatientMedicalConditionDto,
  ['date'],
) {
  @ApiProperty({
    description: 'Patient Medical Condition ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Medical condition data',
    type: MedicalConditionDto,
  })
  @Type(() => MedicalConditionDto)
  medicalCondition: MedicalConditionDto;

  @ApiProperty({
    description: 'Medical condition date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'The date and time the medical condition was created in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description:
      'The date and time the medical condition was last updated in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

class EmrPatientSurgeryDto extends OmitType(PatientSurgeryDto, ['date']) {
  @ApiProperty({
    description: 'Patient Surgery ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Surgery data',
    type: SurgeryDto,
  })
  @Type(() => SurgeryDto)
  surgery: SurgeryDto;

  @ApiProperty({
    description: 'Surgery date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'The date and time the surgery was created in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the surgery was last updated in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

class EmrPatientMedicationDto extends OmitType(PatientMedicationDto, [
  'startDate',
  'endDate',
]) {
  @ApiProperty({
    description: 'Patient Medication ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Medication data',
    type: MedicationDto,
  })
  @Type(() => MedicationDto)
  medication: MedicationDto;

  @ApiPropertyOptional({
    description: 'Medication start date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Medication end date',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    description: 'The date and time the medication was prescribed in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the medication was last updated in EMR',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class BasicEmrDto extends PickType(UpdateEmrDto, [
  'height',
  'weight',
  'bloodType',
  'smokingStatus',
  'alcoholStatus',
  'drugsUsage',
]) {
  @ApiProperty({
    description: 'EMR ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Patient ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  patientId: string;

  @ApiProperty({
    description: 'Insurance data (If patient has insurance)',
    type: InsuranceDto,
  })
  @Type(() => InsuranceDto)
  insurance: InsuranceDto;

  @ApiProperty({
    description: 'The date and time the EMR was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the EMR was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class EmrDto extends BasicEmrDto {
  @ApiProperty({
    description: 'Patient data',
    type: EmrPatientDto,
  })
  @Type(() => EmrPatientDto)
  patient: EmrPatientDto;

  @ApiProperty({
    description: 'Patient allergies',
    isArray: true,
    type: EmrPatientAllergyDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmrPatientAllergyDto)
  allergies: EmrPatientAllergyDto[];

  @ApiProperty({
    description: 'Patient diagnoses',
    isArray: true,
    type: EmrPatientDiagnosisDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmrPatientDiagnosisDto)
  diagnoses: EmrPatientDiagnosisDto[];

  @ApiProperty({
    description: 'Patient medical conditions',
    isArray: true,
    type: EmrPatientMedicalConditionDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmrPatientMedicalConditionDto)
  medicalConditions: EmrPatientMedicalConditionDto[];

  @ApiProperty({
    description: 'Patient surgeries',
    isArray: true,
    type: EmrPatientSurgeryDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmrPatientSurgeryDto)
  surgeries: EmrPatientSurgeryDto[];

  @ApiProperty({
    description: 'Patient medications',
    isArray: true,
    type: EmrPatientMedicationDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmrPatientMedicationDto)
  medications: EmrPatientMedicationDto[];
}
