import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { OtpService } from 'src/otp/otp.service';
import { EmailOtpService } from 'src/email-otp/email-otp.service';
import { PhoneOtpService } from 'src/phone-otp/phone-otp.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    PrismaService,
    UsersService,
    OtpService,
    EmailOtpService,
    PhoneOtpService,
    LogService,
  ],
})
export class AuthModule {}
