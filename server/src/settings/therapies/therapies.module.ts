import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TherapiesController } from './therapies.controller';

import { TherapiesService } from './therapies.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TherapiesController],
  providers: [TherapiesService, JwtService, PrismaService],
})
export class TherapiesModule {}
