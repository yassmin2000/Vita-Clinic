import { Module } from '@nestjs/common';
import { BiomarkersController } from './biomarkers.controller';
import { BiomarkersService } from './biomarkers.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [BiomarkersController],
  providers: [BiomarkersService, PrismaService, JwtService],
})
export class BiomarkersModule {}
