import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from './prisma.service';

@Injectable()
export class TasksService {
  private readonly prisma = new PrismaService();

  @Cron(CronExpression.EVERY_HOUR)
  async handleDeleteExpiredOtp() {
    await this.prisma.otp.deleteMany({
      where: {
        expiryDate: {
          lte: new Date(),
        },
      },
    });
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async handleCancelOutdatedAppointments() {
    await this.prisma.appointment.updateMany({
      where: {
        OR: [
          {
            status: 'pending',
          },
          { status: 'approved' },
        ],
        date: {
          lte: new Date(new Date().getTime() - 6 * 60 * 60 * 1000),
        },
      },
      data: {
        status: 'cancelled',
      },
    });
  }
}
