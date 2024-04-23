import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LaboratoryTestsController } from './laboratory-tests.controller';

import { LaboratoryTestsService } from './laboratory-tests.service';
import { PrismaService } from 'src/prisma.service';
@Module({
    controllers: [ LaboratoryTestsController ],
    providers: [ LaboratoryTestsService, PrismaService, JwtService]
})
export class LaboratoryTestsModule {}
