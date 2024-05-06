import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LaboratoryTestsController } from './laboratory-tests.controller';

import { LaboratoryTestsService } from './laboratory-tests.service';
import { PrismaService } from 'src/prisma.service';
import { BiomarkersService } from '../biomarkers/biomarkers.service';
import { LogService } from 'src/log/log.service';
@Module({
  controllers: [LaboratoryTestsController],
  providers: [
    LaboratoryTestsService,
    PrismaService,
    JwtService,
    BiomarkersService,
    LogService,
  ],
})
export class LaboratoryTestsModule {}
