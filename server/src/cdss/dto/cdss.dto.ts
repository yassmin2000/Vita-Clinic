import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { PredictionModel } from '@prisma/client';
import { InstanceDto } from 'src/appointments/scans/dto/scans.dto';
import { Type } from 'class-transformer';

export class CreatePredictionDto {
  @ApiProperty({
    description: 'Instance ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsNotEmpty()
  @IsUUID()
  instanceId: string;

  @ApiProperty({
    description: 'Prediction model',
    enum: PredictionModel,
    example: PredictionModel.mammography,
  })
  @IsNotEmpty()
  @IsEnum(PredictionModel)
  model: PredictionModel;
}

export class UpdatePredictionResultDto {
  @IsNotEmpty()
  @IsString()
  result: string;

  @IsNotEmpty()
  @IsNumber()
  probability: number;
}

export class PredictionDto extends IntersectionType(
  CreatePredictionDto,
  UpdatePredictionResultDto,
) {
  @ApiProperty({
    description: 'Prediction ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the prediction was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the prediction was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}

export class FullPredictionDto extends PredictionDto {
  @ApiProperty({
    description: 'Instance details',
    type: InstanceDto,
  })
  @Type(() => InstanceDto)
  instance: InstanceDto;
}
