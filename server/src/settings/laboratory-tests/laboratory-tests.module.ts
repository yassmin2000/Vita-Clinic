import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LaboratoryTestsController } from './laboratory-tests.controller';

import { LaboratoryTestsService } from './laboratory-tests.service';
import { PrismaService } from 'src/prisma.service';
import { BiomarkersService } from '../biomarkers/biomarkers.service';
@Module({
  controllers: [LaboratoryTestsController],
  providers: [
    LaboratoryTestsService,
    PrismaService,
    JwtService,
    BiomarkersService,
  ],
})
export class LaboratoryTestsModule {}
