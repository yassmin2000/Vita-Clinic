import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MedicationsController } from './medications.controller';

import { MedicationsService } from './medications.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [MedicationsController],
  providers: [MedicationsService, PrismaService, JwtService, LogService],
})
export class MedicationsModule {}
