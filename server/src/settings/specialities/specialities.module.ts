import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SpecialitiesController } from './specialities.controller';

import { SpecialitiesService } from './specialities.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService, PrismaService, JwtService,LogService]
})
export class SpecialitiesModule {}
