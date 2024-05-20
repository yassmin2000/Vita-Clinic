import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { DevicesController } from './devices.controller';

import { DevicesService } from './devices.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService, JwtService, PrismaService, LogService],
})
export class DevicesModule {}
