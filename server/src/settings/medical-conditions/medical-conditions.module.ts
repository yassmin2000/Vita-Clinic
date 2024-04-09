import { Module } from '@nestjs/common';
import { MedicalConditionsController } from './medical-conditions.controller';
import { MedicalConditionsService } from './medical-conditions.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MedicalConditionsController],
  providers: [MedicalConditionsService, PrismaService, JwtService],
})
export class MedicalConditionsModule {}
