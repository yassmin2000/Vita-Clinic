import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { PacsController } from './pacs.controller';

import { PacsService } from './pacs.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [PacsController],
  providers: [PacsService, PrismaService, JwtService],
})
export class PacsModule {}
