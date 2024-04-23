import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmrController } from './emr.controller';

import { EmrService } from './emr.service';
import { PrismaService } from 'src/prisma.service';
import { AllergiesService } from 'src/settings/allergies/allergies.service';
import { DiagnosesService } from 'src/settings/diagnoses/diagnoses.service';
import { MedicalConditionsService } from 'src/settings/medical-conditions/medical-conditions.service';
import { SurgeriesService } from 'src/settings/surgeries/surgeries.service';

@Module({
  controllers: [EmrController],
  providers: [
    EmrService,
    PrismaService,
    AllergiesService,
    DiagnosesService,
    MedicalConditionsService,
    SurgeriesService,
    JwtService,
  ],
})
export class EmrModule {}
