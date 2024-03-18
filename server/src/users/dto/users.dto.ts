import { IsDate, IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsDate()
  birthDate: Date;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsEnum(['MALE', 'FEMALE'])
  sex: 'MALE' | 'FEMALE';

  @IsEnum(['PATIENT', 'DOCTOR', 'ADMIN'])
  role: 'PATIENT' | 'DOCTOR' | 'ADMIN';
}

export class VerifyUserDto {
  @IsString()
  email: string;

  @IsString()
  otp: string;
}
