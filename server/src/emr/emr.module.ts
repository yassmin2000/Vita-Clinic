import { Module } from '@nestjs/common';

import { EmrService } from './emr.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [EmrService, PrismaService],
})
export class EmrModule {}
