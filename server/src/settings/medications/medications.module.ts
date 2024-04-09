import { Module } from '@nestjs/common';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    controllers: [MedicationsController],
    providers: [MedicationsService, PrismaService, JwtService],
})
export class MedicationsModule {}
