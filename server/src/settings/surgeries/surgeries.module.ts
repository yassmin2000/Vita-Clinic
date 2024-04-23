import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SurgeriesController } from './surgeries.controller';

import { SurgeriesService } from './surgeries.service';
import { PrismaService } from 'src/prisma.service';
@Module({
  controllers: [SurgeriesController],
  providers: [SurgeriesService, PrismaService, JwtService],
})
export class SurgeriesModule {}
