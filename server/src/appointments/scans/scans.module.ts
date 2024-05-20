import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ScansController } from './scans.controller';
import { LogService } from 'src/log/log.service';

import { ScansService } from './scans.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ScansController],
  providers: [ScansService, JwtService, PrismaService, LogService],
})
export class ScansModule {}
