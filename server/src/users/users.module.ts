import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { OtpService } from 'src/otp/otp.service';

import { AdminsModule } from './admins/admins.module';
import { DoctorsModule } from './doctors/doctors.module';
import { PatientsModule } from './patients/patients.module';
import { EmrService } from 'src/emr/emr.service';

@Module({
  imports: [AdminsModule, DoctorsModule, PatientsModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService, PrismaService, OtpService, EmrService],
})
export class UsersModule {}
