import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppointmentsController } from './appointments.controller';

import { AppointmentsService } from './appointments.service';
import { PrismaService } from 'src/prisma.service';
import { BiomarkersService } from 'src/settings/biomarkers/biomarkers.service';
import { LaboratoryTestsService } from 'src/settings/laboratory-tests/laboratory-tests.service';
import { ModalitiesService } from 'src/settings/modalities/modalities.service';
import { ServicesService } from 'src/settings/services/services.service';
import { TherapiesService } from 'src/settings/therapies/therapies.service';
import { ReportsModule } from './reports/reports.module';
import { ReportsService } from './reports/reports.service';
import { ScansModule } from './scans/scans.module';
import { ScansService } from './scans/scans.service';
import { VitalsModule } from './vitals/vitals.module';

@Module({
  imports: [ReportsModule, ScansModule, VitalsModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    JwtService,
    PrismaService,
    ReportsService,
    ScansService,
    BiomarkersService,
    LaboratoryTestsService,
    ModalitiesService,
    ServicesService,
    TherapiesService,
  ],
})
export class AppointmentsModule {}
