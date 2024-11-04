import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateSurgeryDto {
  @ApiProperty({
    description: 'The name of the surgery',
    type: String,
    example: 'Laparoscopic Cholecystectomy',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'The description of the surgery',
    type: String,
    example:
      'Laparoscopic cholecystectomy is a surgical procedure to remove your gallbladder. Your gallbladder is a small organ located just below your liver in your upper right abdomen.',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSurgeryDto extends PartialType(CreateSurgeryDto) {}

export class SurgeryDto extends CreateSurgeryDto {
  @ApiProperty({
    description: 'Surgery ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The date and time the surgery was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the surgery was last updated',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  updatedAt: Date;
}
