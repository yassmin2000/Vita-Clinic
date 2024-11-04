import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateManufacturerDto {
  @ApiProperty({
    description: 'Manufacturer name',
    type: String,
    example: 'Roche',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Manufacturer description',
    type: String,
    example:
      'Roche is a Swiss multinational healthcare company that operates worldwide under two divisions: Pharmaceuticals and Diagnostics.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateManufacturerDto extends PartialType(CreateManufacturerDto) {}

export class ManufacturerDto extends CreateManufacturerDto {
  @ApiProperty({
    description: 'Manufacturer ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the manufacturer was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the manufacturer was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
