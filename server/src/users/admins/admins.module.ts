import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AdminsController } from './admins.controller';
import { UsersService } from '../users.service';
import { PrismaService } from 'src/prisma.service';
import { OtpService } from 'src/otp/otp.service';
import { EmailOtpService } from 'src/email-otp/email-otp.service';

@Module({
  controllers: [AdminsController],
  providers: [PrismaService, JwtService, OtpService, UsersService, EmailOtpService],
})
export class AdminsModule {}
