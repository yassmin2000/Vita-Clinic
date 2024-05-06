import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DiagnosesController } from './diagnoses.controller';

import { DiagnosesService } from './diagnoses.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [DiagnosesController],
  providers: [DiagnosesService, JwtService, PrismaService, LogService],
})
export class DiagnosesModule {}
