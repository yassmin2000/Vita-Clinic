import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  IsArray,
  ValidateNested,
  IsNumber,
  IsUUID,
  IsDate,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';

import { LaboratoryTestDto } from 'src/settings/laboratory-tests/dto/laboratory-test.dto';
import { BiomarkerDto } from 'src/settings/biomarkers/dto/biomarkers.dto';
import { BasicAppointmentDto } from 'src/appointments/dto/appointments.dto';

class CreateBiomarkerValueDto {
  @ApiProperty({
    description: 'Biomarker ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  biomarkerId: string;

  @ApiProperty({
    description: 'Biomarker value',
    type: Number,
    example: 10,
  })
  @IsNumber()
  value: number;
}

export class CreateLaboratoryTestResultDto {
  @ApiProperty({
    description: 'Appointment ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  appointmentId: string;

  @ApiProperty({
    description: 'Laboratory test ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  laboratoryTestId: string;

  @ApiProperty({
    description: 'Title of the test result',
    type: String,
    example: 'CBC Test#1',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Notes for the test result',
    type: String,
    example: 'Patient has a history of anemia',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Test results values',
    isArray: true,
    type: CreateBiomarkerValueDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBiomarkerValueDto)
  values: CreateBiomarkerValueDto[];
}

export class UpdateLaboratoryTestResultDto extends PartialType(
  CreateLaboratoryTestResultDto,
) {}

export class BiomarkerValueDto extends CreateBiomarkerValueDto {
  @ApiProperty({
    description: 'Biomarker value ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Biomarker data',
    type: BiomarkerDto,
  })
  @Type(() => BiomarkerDto)
  biomarker: BiomarkerDto;

  @ApiProperty({
    description: 'Date and time the biomarker value was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Date and time the biomarker value was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class BasicLaboratoryTestResultDto extends OmitType(
  CreateLaboratoryTestResultDto,
  ['values'],
) {
  @ApiProperty({
    description: 'Test result ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Date and time the test result was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Date and time the test result was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class LaboratoryTestResultDto extends BasicLaboratoryTestResultDto {
  @ApiProperty({
    description: 'Laboratory test data',
    type: LaboratoryTestDto,
  })
  @Type(() => LaboratoryTestDto)
  laboratoryTest: LaboratoryTestDto;

  @ApiProperty({
    description: 'Test result values',
    isArray: true,
    type: BiomarkerValueDto,
  })
  @IsArray()
  @Type(() => BiomarkerValueDto)
  values: BiomarkerValueDto[];
}

export class FullLaboratoryTestResultDto extends LaboratoryTestResultDto {
  @ApiProperty({
    description: 'Appointment data',
    type: BasicAppointmentDto,
  })
  @Type(() => BasicAppointmentDto)
  appointment: BasicAppointmentDto;
}

export class GetPatientTestResultsQuery {
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
    description: 'Number of test results per page',
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @ApiPropertyOptional({
    name: 'value',
    type: String,
    description: 'Search value',
    example: 'Biomarker Test',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    name: 'sort',
    description: 'Sort test results by field',
    enum: ['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'],
    example: 'name-asc',
  })
  @IsOptional()
  @IsIn(['name-desc', 'name-asc', 'createdAt-desc', 'createdAt-asc'])
  sort?: 'name-desc' | 'name-asc' | 'createdAt-desc' | 'createdAt-asc';
}
