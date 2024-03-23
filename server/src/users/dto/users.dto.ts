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

  @IsEnum(['male', 'female'])
  sex: 'male' | 'female';

  @IsEnum(['patient', 'doctor', 'admin'])
  role?: 'patient' | 'doctor' | 'admin';
}

export class VerifyUserDto {
  @IsString()
  email: string;

  @IsString()
  otp: string;
}
