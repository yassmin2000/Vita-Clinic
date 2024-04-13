import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PatientsController } from './patients.controller';

import { PatientsService } from './patients.service';
import { UsersService } from '../users.service';
import { PrismaService } from 'src/prisma.service';
import { OtpService } from 'src/otp/otp.service';

@Module({
  controllers: [PatientsController],
  providers: [
    PatientsService,
    JwtService,
    UsersService,
    PrismaService,
    OtpService,
  ],
})
export class PatientsModule {}
