import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ModalitiesController } from './modalities.controller';

import { ModalitiesService } from './modalities.service';
import { PrismaService } from 'src/prisma.service';
@Module({
  controllers: [ModalitiesController],
  providers: [ModalitiesService, JwtService, PrismaService],
})
export class ModalitiesModule {}
