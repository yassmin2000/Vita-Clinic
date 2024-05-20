import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService, PrismaService, JwtService, LogService],
})
export class PrescriptionsModule {}
