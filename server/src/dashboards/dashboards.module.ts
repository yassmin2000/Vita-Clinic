import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DashboardsController } from './dashboards.controller';

import { DashboardsService } from './dashboards.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [DashboardsController],
  providers: [DashboardsService, PrismaService, JwtService],
})
export class DashboardsModule {}
