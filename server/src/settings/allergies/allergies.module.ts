import { Module } from '@nestjs/common';
import { AllergiesController } from './allergies.controller';
import { AllergiesService } from './allergies.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AllergiesController],
  providers: [AllergiesService, PrismaService, JwtService],
})
export class AllergiesModule {}
