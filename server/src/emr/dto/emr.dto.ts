import { BloodType } from '@prisma/client';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class EmrDto {
  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsIn([
    'a_positive',
    'a_negative',
    'b_positive',
    'b_negative',
    'ab_positive',
    'ab_negative',
    'o_positive',
    'o_negative',
  ])
  bloodType?: BloodType;
}
