import { Module } from '@nestjs/common';
import { MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LogService } from 'src/log/log.service';

@Module({
    controllers: [MedicationsController],
    providers: [MedicationsService, PrismaService, JwtService,LogService],
})
export class MedicationsModule {}
