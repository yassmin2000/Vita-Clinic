import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TestResultsController } from './test-results.controller';

import { TestResultsService } from './test-results.service';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

@Module({
  controllers: [TestResultsController],
  providers: [TestResultsService, PrismaService, JwtService, LogService],
})
export class TestResultsModule {}
