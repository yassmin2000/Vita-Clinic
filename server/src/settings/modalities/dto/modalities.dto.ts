import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateModalityDto {
  @ApiProperty({
    description: 'Modality name',
    type: String,
    example: 'X-ray',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Modality description',
    type: String,
    example: 'X-ray imaging',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Modality price',
    type: Number,
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}

export class UpdateModalityDto extends PartialType(CreateModalityDto) {}

export class ModalityDto extends CreateModalityDto {
  @ApiProperty({
    description: 'Modality id',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the modality was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the modality was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
