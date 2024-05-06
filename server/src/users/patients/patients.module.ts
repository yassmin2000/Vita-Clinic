import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PatientsController } from './patients.controller';

import { UsersService } from '../users.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { ReportsService } from 'src/appointments/reports/reports.service';
import { ScansService } from 'src/appointments/scans/scans.service';
import { BiomarkersService } from 'src/settings/biomarkers/biomarkers.service';
import { ModalitiesService } from 'src/settings/modalities/modalities.service';
import { LaboratoryTestsService } from 'src/settings/laboratory-tests/laboratory-tests.service';
import { ServicesService } from 'src/settings/services/services.service';
import { TherapiesService } from 'src/settings/therapies/therapies.service';
import { OtpService } from 'src/otp/otp.service';
import { EmailOtpService } from 'src/email-otp/email-otp.service';
import { PhoneOtpService } from 'src/phone-otp/phone-otp.service';

@Module({
  controllers: [PatientsController],
  providers: [
    UsersService,
    PrismaService,
    JwtService,
    LogService,

    AppointmentsService,
    ReportsService,
    ScansService,
    BiomarkersService,
    LaboratoryTestsService,
    ModalitiesService,
    ServicesService,
    TherapiesService,

    OtpService,
    EmailOtpService,
    PhoneOtpService,
  ],
})
export class PatientsModule {}
