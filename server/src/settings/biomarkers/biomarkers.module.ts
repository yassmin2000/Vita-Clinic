import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BiomarkersController } from './biomarkers.controller';

import { BiomarkersService } from './biomarkers.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [BiomarkersController],
  providers: [BiomarkersService, JwtService, PrismaService,LogService],
})
export class BiomarkersModule {}
