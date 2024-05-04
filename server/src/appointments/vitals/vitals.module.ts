import { Module } from '@nestjs/common';
import { VitalsController } from './vitals.controller';
import { VitalsService } from './vitals.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [VitalsController],
  providers: [VitalsService, PrismaService, JwtService]
})
export class VitalsModule {}
