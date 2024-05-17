import { PartialType } from '@nestjs/mapped-types';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import type {
  AlcoholStatus,
  BloodType,
  DrugsUsage,
  Role,
  Sex,
  SmokingStatus,
} from '@prisma/client';

export class InsuranceDto {
  @IsNotEmpty()
  @IsString()
  provider: string;

  @IsNotEmpty()
  @IsString()
  policyNumber: string;

  @IsDateString()
  policyStartDate: Date;

  @IsDateString()
  policyEndDate: Date;
}

export class UpdateInsuranceDto extends PartialType(InsuranceDto) {}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  avatarURL: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  specialityId?: string;

  @IsIn(['male', 'female'])
  sex: 'male' | 'female';

  @IsOptional()
  @IsIn(['patient', 'doctor', 'admin'])
  role?: Role;

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

  @IsOptional()
  @IsIn(['never', 'former', 'current'])
  smokingStatus?: SmokingStatus;

  @IsOptional()
  @IsIn(['never', 'former', 'current'])
  alcoholStatus?: AlcoholStatus;

  @IsOptional()
  @IsIn(['never', 'former', 'current'])
  drugsUsage?: DrugsUsage;

  @IsOptional()
  @ValidateNested()
  @Type(() => InsuranceDto)
  insurance?: InsuranceDto;
}

export class VerifyUserEmailDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResendEmailVerificationDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class VerifyUserPhoneDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResendPhoneVerificationDto {
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class GetAllUsersQuery {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @IsOptional()
  @IsIn(['all', 'male', 'female'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  sex?: 'all' | Sex;

  @IsOptional()
  @IsIn(['all', 'active', 'inactive'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  status?: 'all' | 'active' | 'inactive';

  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsIn([
    'name-desc',
    'name-asc',
    'birthDate-desc',
    'birthDate-asc',
    'createdAt-desc',
    'createdAt-asc',
    'isActive-desc',
    'isActive-asc',
  ])
  sort?:
    | 'name-desc'
    | 'name-asc'
    | 'birthDate-desc'
    | 'birthDate-asc'
    | 'createdAt-desc'
    | 'createdAt-asc'
    | 'isActive-desc'
    | 'isActive-asc';
}

export class UpdateAvatarDto {
  @IsOptional()
  @IsString()
  avatarURL?: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
