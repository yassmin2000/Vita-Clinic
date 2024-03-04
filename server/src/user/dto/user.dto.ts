import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class VerifyUserDto {
  @IsString()
  email: string;

  @IsString()
  otp: string;
}
