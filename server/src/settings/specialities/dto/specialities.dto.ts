import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateSpecialityDto {
  @ApiProperty({
    description: 'Speciality name',
    type: String,
    example: 'Cardiology',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Speciality description',
    type: String,
    example: 'Cardiology deals with the disorders of the heart.',
  })
  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateSpecialityDto extends PartialType(CreateSpecialityDto) {}

export class SpecialityDto extends CreateSpecialityDto {
  @ApiProperty({
    description: 'Speciality ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the speciality was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the speciality was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
