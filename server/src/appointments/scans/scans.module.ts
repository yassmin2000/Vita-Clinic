import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ScansController } from './scans.controller';

import { ScansService } from './scans.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ScansController],
  providers: [ScansService, JwtService, PrismaService]
})
export class ScansModule {}
