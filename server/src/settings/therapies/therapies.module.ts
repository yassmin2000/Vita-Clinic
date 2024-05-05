import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TherapiesController } from './therapies.controller';

import { TherapiesService } from './therapies.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [TherapiesController],
  providers: [TherapiesService, JwtService, PrismaService,LogService],
})
export class TherapiesModule {}
