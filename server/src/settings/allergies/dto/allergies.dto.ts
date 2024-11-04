import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateAllergyDto {
  @ApiProperty({
    description: 'Allergy name',
    type: String,
    example: 'Peanut allergy',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Allergy description',
    type: String,
    example: 'Allergic to peanuts',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateAllergyDto extends PartialType(CreateAllergyDto) {}

export class AllergyDto extends CreateAllergyDto {
  @ApiProperty({
    description: 'Allergy ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the allergy was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the allergy was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
