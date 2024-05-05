import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SurgeriesController } from './surgeries.controller';

import { SurgeriesService } from './surgeries.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';
@Module({
  controllers: [SurgeriesController],
  providers: [SurgeriesService, PrismaService, JwtService,LogService],
})
export class SurgeriesModule {}
