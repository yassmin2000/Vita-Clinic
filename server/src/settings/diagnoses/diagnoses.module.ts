import { Module } from '@nestjs/common';
import { DiagnosesController } from './diagnoses.controller';
import { DiagnosesService } from './diagnoses.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DiagnosesController],
  providers: [DiagnosesService, PrismaService, JwtService],
})
export class DiagnosesModule {}
