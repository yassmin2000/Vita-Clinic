import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DoctorsController } from './doctors.controller';
import { UsersService } from '../users.service';
import { PrismaService } from 'src/prisma.service';
import { OtpService } from 'src/otp/otp.service';

@Module({
  controllers: [DoctorsController],
  providers: [UsersService, JwtService, PrismaService, OtpService],
})
export class DoctorsModule {}
