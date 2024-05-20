import { Module } from '@nestjs/common';
import { TreatmentService } from './treatments.service';
import { TreatmentController } from './treatments.controller';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [TreatmentController],
  providers: [TreatmentService, JwtService, PrismaService, LogService],
})
export class TreatmentsModule {}
