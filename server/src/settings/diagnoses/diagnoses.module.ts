import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DiagnosesController } from './diagnoses.controller';

import { DiagnosesService } from './diagnoses.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DiagnosesController],
  providers: [DiagnosesService, JwtService, PrismaService],
})
export class DiagnosesModule {}
