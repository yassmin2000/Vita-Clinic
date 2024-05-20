import { Module } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { TestResultsController } from './test-results.controller';
import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TestResultsController],
  providers: [TestResultsService, PrismaService, JwtService, LogService],
})
export class TestResultsModule {}
