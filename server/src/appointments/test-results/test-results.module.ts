import { Module } from '@nestjs/common';
import { TestResultsService } from './test-results.service';
import { TestResultsController } from './test-results.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Module({
  controllers: [TestResultsController],
  providers: [TestResultsService, PrismaService, JwtService],
})
export class TestResultsModule {}
