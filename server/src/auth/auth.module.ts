import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';

@Module({
  providers: [AuthService, OtpService, UsersService, PrismaService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
