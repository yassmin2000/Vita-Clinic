import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DoctorsController } from './doctors.controller';
import { UsersService } from '../users.service';
import { PrismaService } from 'src/prisma.service';
import { OtpService } from 'src/otp/otp.service';
import { EmailOtpService } from 'src/email-otp/email-otp.service';
import { PhoneOtpService } from 'src/phone-otp/phone-otp.service';

@Module({
  controllers: [DoctorsController],
  providers: [UsersService, JwtService, PrismaService, OtpService, EmailOtpService, PhoneOtpService],
})
export class DoctorsModule {}
