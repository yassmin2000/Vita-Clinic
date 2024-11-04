import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsUUID } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PickType,
} from '@nestjs/swagger';

import { CreateInsuranceDto, CreateUserDto } from './users.dto';
import { BasicEmrDto } from 'src/emr/dto/emr.dto';
import { SpecialityDto } from 'src/settings/specialities/dto/specialities.dto';

export class UserDto extends OmitType(CreateUserDto, [
  'birthDate',
  'insurance',
  'height',
  'weight',
  'bloodType',
  'alcoholStatus',
  'smokingStatus',
  'drugsUsage',
]) {
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User birth date',
    type: Date,
    example: new Date('1990-01-01'),
  })
  @IsDate()
  birthDate: Date;

  @ApiProperty({
    description: 'Is user active',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Is user email verified',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'Is user phone verified',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  isPhoneVerified: boolean;

  @ApiProperty({
    description: 'Is user super admin',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  isSuperAdmin: boolean;

  @ApiProperty({
    description: 'The date and time the user was created',
    type: Date,
    example: new Date(),
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the user was last updated',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;
}

export class BasicUserDto extends PickType(UserDto, [
  'id',
  'firstName',
  'lastName',
]) {}

export class UserProfileDto extends OmitType(UserDto, [
  'password',
  'isEmailVerified',
  'isPhoneVerified',
  'updatedAt',
]) {
  @ApiPropertyOptional({
    description: 'User speciality (If doctor)',
    type: String,
    example: 'Cardiology',
  })
  speciality?: string;

  @ApiPropertyOptional({
    description: 'User EMR ID (If patient)',
    type: String,
    example: crypto.randomUUID(),
  })
  @IsUUID()
  emrId?: string;

  @ApiPropertyOptional({
    description: 'User insurance (If patient and provided)',
    type: CreateInsuranceDto,
  })
  @Type(() => CreateInsuranceDto)
  insurance?: CreateInsuranceDto;

  @ApiProperty({
    description:
      'User appointments count (Assigned for doctor, created for patient)',
    type: Number,
    example: 5,
  })
  appointments: number;

  @ApiProperty({
    description: 'Patient reports count (0 if not patient)',
    type: Number,
    example: 3,
  })
  reports: number;

  @ApiProperty({
    description: 'Patient scans count (0 if not patient)',
    type: Number,
    example: 2,
  })
  scans: number;

  @ApiProperty({
    description: 'Patient prescriptions count (0 if not patient)',
    type: Number,
    example: 1,
  })
  prescriptions: number;

  @ApiProperty({
    description: 'Patient treatments count (0 if not patient)',
    type: Number,
    example: 4,
  })
  treatments: number;

  @ApiProperty({
    description: 'Patient laboratory test results count (0 if not patient)',
    type: Number,
    example: 2,
  })
  laboratoryTestResults: number;
}

export class UserWithEmrDto extends UserDto {
  @ApiProperty({
    description: 'User EMR (If patient)',
    type: OmitType(BasicEmrDto, ['insurance']),
  })
  @Type(() => OmitType(BasicEmrDto, ['insurance']))
  emr: Omit<BasicEmrDto, 'insurance'>;
}

export class UserReturnDto extends OmitType(UserDto, [
  'password',
  'isEmailVerified',
  'isPhoneVerified',
]) {}

class UserListItemSepcialityDto extends PickType(SpecialityDto, [
  'id',
  'name',
]) {}

class UserListItemEmrDto extends PickType(BasicEmrDto, ['id', 'bloodType']) {}

export class UserListItemDto extends OmitType(UserReturnDto, ['specialityId']) {
  @ApiPropertyOptional({
    description: 'User speciality (If doctor)',
    type: UserListItemSepcialityDto,
  })
  @Type(() => UserListItemSepcialityDto)
  speciality?: UserListItemSepcialityDto;

  @ApiPropertyOptional({
    description: 'User EMR (If patient)',
    type: UserListItemEmrDto,
  })
  @Type(() => UserListItemEmrDto)
  emr?: UserListItemEmrDto;
}

export class UpdateUserRoleResponseDto extends PickType(UserDto, [
  'id',
  'role',
]) {}
export class UpdateUserAvatarResponseDto extends PickType(UserDto, [
  'id',
  'avatarURL',
]) {}
export class UpdateUserPasswordResponseDto extends PickType(UserDto, ['id']) {}
