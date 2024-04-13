import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AllergiesController } from './allergies.controller';

import { AllergiesService } from './allergies.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [AllergiesController],
  providers: [AllergiesService, JwtService, PrismaService],
})
export class AllergiesModule {}
