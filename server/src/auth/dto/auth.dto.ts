import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    type: String,
    example: 'example@test.com',
  })
  @IsNotEmpty()
  @IsString()
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
}
