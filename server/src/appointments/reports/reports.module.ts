import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ReportsController } from './reports.controller';

import { ReportsService } from './reports.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, JwtService, PrismaService],
})
export class ReportsModule {}
