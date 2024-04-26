import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ServicesController } from './services.controller';

import { ServicesService } from './services.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, JwtService, PrismaService],
})
export class ServicesModule {}
