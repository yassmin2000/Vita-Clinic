import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import type { BloodType, Role, Sex } from '@prisma/client';

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
  phoneNumber?: string;

  @IsString()
  address?: string;

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
  ])
  sort?:
    | 'name-desc'
    | 'name-asc'
    | 'birthDate-desc'
    | 'birthDate-asc'
    | 'createdAt-desc'
    | 'createdAt-asc';
}
