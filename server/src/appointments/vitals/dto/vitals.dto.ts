import {
  IsOptional,
  IsNumber,
  IsString,
  IsDate,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateVitalsDto {
  @ApiPropertyOptional({
    description: 'Temperature of the patient',
    type: Number,
    example: 36.5,
  })
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional({
    description: 'Systolic blood pressure of the patient',
    type: Number,
    example: 120,
  })
  @IsOptional()
  @IsNumber()
  systolicBloodPressure?: number;

  @ApiPropertyOptional({
    description: 'Diastolic blood pressure of the patient',
    type: Number,
    example: 80,
  })
  @IsOptional()
  @IsNumber()
  diastolicBloodPressure?: number;

  @ApiPropertyOptional({
    description: 'Heart rate of the patient',
    type: Number,
    example: 80,
  })
  @IsOptional()
  @IsNumber()
  heartRate?: number;

  @ApiPropertyOptional({
    description: 'Respiratory rate of the patient',
    type: Number,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  respiratoryRate?: number;

  @ApiPropertyOptional({
    description: 'Oxygen saturation of the patient',
    type: Number,
    example: 98,
  })
  @IsOptional()
  @IsString()
  oxygenSaturation?: number;

  @ApiPropertyOptional({
    description: 'Appointment ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  appointmentId: string;
}
export class UpdateVitalsDto extends PartialType(CreateVitalsDto) {}

export class BasicVitalsDto extends OmitType(CreateVitalsDto, [
  'appointmentId',
]) {}

export class VitalsDto extends BasicVitalsDto {
  @ApiPropertyOptional({
    description: 'Vitals ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiPropertyOptional({
    description: 'The date and time the vitals were created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'The date and time the vitals were last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

class VitalDataDto {
  @ApiProperty({
    description: 'Day',
    type: String,
    example: new Date().toISOString().split('T')[0],
  })
  @IsString()
  x: string;

  @ApiProperty({
    description: 'Vital value',
    type: Number,
    example: 36.5,
  })
  @IsNumber()
  y: number;
}

enum VitalType {
  Temperature,
  'Heart Rate',
  'Oxygen Saturation',
  'Respiratory Rate',
  'Systolic Blood Pressure',
  'Diastolic Blood Pressure',
}

export class AllVitalsDataDto {
  @ApiProperty({
    description: 'Vital type',
    enum: VitalType,
    example: VitalType.Temperature,
  })
  @IsEnum(VitalType)
  id: string;

  @ApiProperty({
    description: 'Vital data',
    isArray: true,
    type: VitalDataDto,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VitalDataDto)
  data: VitalDataDto[];
}
