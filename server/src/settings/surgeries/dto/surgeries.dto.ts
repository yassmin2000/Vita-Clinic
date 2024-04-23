import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsOptional} from 'class-validator';

export class CreateSurgeryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateSurgeryDto extends PartialType(CreateSurgeryDto) {}