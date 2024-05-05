import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AllergiesController } from './allergies.controller';

import { AllergiesService } from './allergies.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [AllergiesController],
  providers: [AllergiesService, JwtService, PrismaService,LogService],
})
export class AllergiesModule {}
