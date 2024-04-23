import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmrController } from './emr.controller';

import { EmrService } from './emr.service';
import { PrismaService } from 'src/prisma.service';
import { AllergiesService } from 'src/settings/allergies/allergies.service';
import { DiagnosesService } from 'src/settings/diagnoses/diagnoses.service';

@Module({
  controllers: [EmrController],
  providers: [
    EmrService,
    PrismaService,
    AllergiesService,
    DiagnosesService,
    JwtService,
  ],
})
export class EmrModule {}
