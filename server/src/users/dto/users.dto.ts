import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import {
  AlcoholStatus,
  BloodType,
  DrugsUsage,
  Role,
  Sex,
  SmokingStatus,
} from '@prisma/client';

export class CreateInsuranceDto {
  @ApiProperty({
    description: 'Insurance provider',
    type: String,
    example: 'Aetna',
  })
  @IsNotEmpty()
  @IsString()
  provider: string;

  @ApiProperty({
    description: 'Insurance policy number',
    type: String,
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  policyNumber: string;

  @ApiProperty({
    description: 'Insurance policy start date',
    type: String,
    example: new Date('2021-01-01').toISOString(),
  })
  @IsDateString()
  policyStartDate: Date;

  @ApiProperty({
    description: 'Insurance policy end date',
    type: String,
    example: new Date('2022-01-01').toISOString(),
  })
  @IsDateString()
  policyEndDate: Date;
}

export class UpdateInsuranceDto extends PartialType(CreateInsuranceDto) {}

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    type: String,
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    type: String,
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    type: String,
    example: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
  })
  @IsOptional()
  @IsString()
  avatarURL: string;

  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@test.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    type: String,
    example: 'test123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'User birth date',
    type: String,
    example: new Date('1990-01-01').toISOString(),
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: Date;

  @ApiProperty({
    description: 'User phone number',
    type: String,
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'User SSN',
    type: String,
    example: '123-45-6789',
  })
  @IsNotEmpty()
  @IsString()
  ssn: string;

  @ApiProperty({
    description: 'User address',
    type: String,
    example: '1234 Main St, City, State, 12345',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiPropertyOptional({
    description: 'User speciality ID (for doctors)',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsOptional()
  @IsUUID()
  specialityId?: string;

  @ApiProperty({
    description: 'User sex',
    enum: Sex,
    example: 'male',
  })
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: 'patient',
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: 'User height',
    type: Number,
    example: 180,
  })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({
    description: 'User weight',
    type: Number,
    example: 80,
  })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({
    description: 'User blood type',
    enum: BloodType,
    example: 'A+',
  })
  @IsOptional()
  @IsEnum(BloodType)
  bloodType?: BloodType;

  @ApiPropertyOptional({
    description: 'User smoking status',
    enum: SmokingStatus,
    example: 'never',
  })
  @IsOptional()
  @IsEnum(SmokingStatus)
  smokingStatus?: SmokingStatus;

  @ApiPropertyOptional({
    description: 'User alcohol status',
    enum: AlcoholStatus,
    example: 'never',
  })
  @IsOptional()
  @IsEnum(AlcoholStatus)
  alcoholStatus?: AlcoholStatus;

  @ApiPropertyOptional({
    description: 'User drugs usage',
    enum: DrugsUsage,
    example: 'never',
  })
  @IsOptional()
  @IsEnum(DrugsUsage)
  drugsUsage?: DrugsUsage;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateInsuranceDto)
  insurance?: CreateInsuranceDto;
}

export class VerifyUserEmailDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@test.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'User OTP',
    type: String,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
export class ResendEmailVerificationDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@test.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class VerifyUserPhoneDto {
  @ApiProperty({
    description: 'User phone number',
    type: String,
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'User OTP',
    type: String,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResendPhoneVerificationDto {
  @ApiProperty({
    description: 'User phone number',
    type: String,
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

export class GetAllUsersQuery {
  @ApiPropertyOptional({
    name: 'page',
    description: 'Page number',
    type: Number,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  page?: number;

  @ApiPropertyOptional({
    name: 'limit',
    description: 'Number of users per page',
    type: Number,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  limit?: number;

  @ApiPropertyOptional({
    name: 'sex',
    description: 'Filter users by sex',
    enum: ['male', 'female', 'all'],
    example: 'male',
  })
  @IsOptional()
  @IsIn(['all', 'male', 'female'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  sex?: 'all' | Sex;

  @ApiPropertyOptional({
    name: 'status',
    description: 'Filter users by status',
    enum: ['active', 'inactive', 'all'],
    example: 'active',
  })
  @IsOptional()
  @IsIn(['all', 'active', 'inactive'])
  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  status?: 'all' | 'active' | 'inactive';

  @ApiPropertyOptional({
    name: 'value',
    description: 'Search value',
    type: String,
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({
    name: 'sort',
    description: 'Sort users by field',
    enum: [
      'name-asc',
      'name-desc',
      'birthDate-asc',
      'birthDate-desc',
      'createdAt-asc',
      'createdAt-desc',
      'isActive-asc',
      'isActive-desc',
    ],
    example: 'name-asc',
  })
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
  @ApiPropertyOptional({
    description: 'User avatar URL',
    type: String,
    example: 'https://xsgames.co/randomusers/assets/avatars/male/1.jpg',
  })
  @IsOptional()
  @IsString()
  avatarURL?: string;
}

export class UpdateSettingsDto {
  @ApiProperty({
    description: 'User enabled DICOM files caching',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  enableDicomCaching: boolean;

  @ApiProperty({
    description: 'User enabled DICOM files compression',
    type: Boolean,
    example: false,
  })
  @IsBoolean()
  enableDicomCompression: boolean;

  @ApiProperty({
    description: 'User enabled DICOM files cleanup',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  enableDicomCleanup: boolean;

  @ApiProperty({
    description: 'User DICOM files cleanup duration (In days)',
    type: Number,
    example: 7,
  })
  @IsNumber()
  cleanupDuration: number;
}

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'User current password',
    type: String,
    example: 'test123',
  })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: 'User new password',
    type: String,
    example: 'test1234',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
