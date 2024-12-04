import { Module } from '@nestjs/common';
import { CdssController } from './cdss.controller';
import { CdssService } from './cdss.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [HttpModule],
  controllers: [CdssController],
  providers: [
    CdssService,
    PrismaService,
    NotificationsService,
    NotificationsGateway,
    JwtService,
  ],
})
export class CdssModule {}
