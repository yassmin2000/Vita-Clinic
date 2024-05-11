import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Module({
  controllers: [PrescriptionsController],
  providers: [
    PrescriptionsService,
    PrismaService,
    JwtService,
  ],
})
export class PrescriptionsModule {}
