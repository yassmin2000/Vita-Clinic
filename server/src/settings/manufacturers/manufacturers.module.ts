import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ManufacturersController } from './manufacturers.controller';

import { ManufacturersService } from './manufacturers.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [ManufacturersController],
  providers: [ManufacturersService, JwtService, PrismaService, LogService],
})
export class ManufacturersModule {}
