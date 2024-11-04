import { Module } from '@nestjs/common';

import { TreatmentController } from './treatments.controller';

import { TreatmentService } from './treatments.service';
import { LogService } from 'src/log/log.service';

import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TreatmentController],
  providers: [TreatmentService, JwtService, PrismaService, LogService],
})
export class TreatmentsModule {}
