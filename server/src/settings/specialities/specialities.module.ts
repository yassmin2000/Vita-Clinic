import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { SpecialitiesController } from './specialities.controller';

import { SpecialitiesService } from './specialities.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SpecialitiesController],
  providers: [SpecialitiesService, PrismaService, JwtService]
})
export class SpecialitiesModule {}
