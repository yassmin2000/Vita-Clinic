import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ManufacturersController } from './manufacturers.controller';

import { ManufacturersService } from './manufacturers.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ManufacturersController],
  providers: [ManufacturersService, JwtService, PrismaService],
})
export class ManufacturersModule {}
