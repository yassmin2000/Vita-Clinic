import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ServicesController } from './services.controller';

import { ServicesService } from './services.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, JwtService, PrismaService,LogService],
})
export class ServicesModule {}
