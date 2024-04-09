import { IsString, IsOptional } from 'class-validator';

export class CreateAllergyDto {
  @IsString()
  name: string;

  @IsString()
  description?: string;
}

export class UpdateAllergyDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
