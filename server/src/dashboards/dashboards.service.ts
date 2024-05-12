import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';

import {
  processAppointmentsData,
  processInvoicesData,
  processPatientsData,
} from './utils';

import {
  GetAppointmentsDataQuery,
  GetInvoicesDataQuery,
} from './dto/dashboards.dto';

@Injectable()
export class DashboardsService {
  constructor(private prisma: PrismaService) {}

  async getInvoicesData({
    startDate = new Date().toISOString(),
    endDate = new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  }: GetInvoicesDataQuery) {
    const rawCompletedBillings = await this.prisma.billing.groupBy({
      by: ['date'],
      where: {
        OR: [
          {
            status: 'paid',
          },
          { status: 'insurance' },
        ],
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const rawPendingBillings = await this.prisma.billing.groupBy({
      by: ['date'],
      where: {
        status: 'initial',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const rawCancelledBillings = await this.prisma.billing.groupBy({
      by: ['date'],
      where: {
        status: 'cancelled',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    const completedBillings = {
      id: 'Completed',
      data: processInvoicesData(
        new Date(startDate),
        new Date(endDate),
        rawCompletedBillings,
      ),
    };

    const pendingBillings = {
      id: 'Pending',
      data: processInvoicesData(
        new Date(startDate),
        new Date(endDate),
        rawPendingBillings,
      ),
    };

    const cancelledBillings = {
      id: 'Cancelled',
      data: processInvoicesData(
        new Date(startDate),
        new Date(endDate),
        rawCancelledBillings,
      ),
    };

    return [completedBillings, pendingBillings, cancelledBillings];
  }

  async getAppointmentsData({
    year = new Date().getFullYear(),
    status = 'completed',
  }: GetAppointmentsDataQuery) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const rawData = await this.prisma.appointment.groupBy({
      by: ['date'],
      where: {
        status: status === 'all' ? undefined : status,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
      _count: true,
    });

    return processAppointmentsData(rawData);
  }

  async getPatientsAgeSexData() {
    const rawData = await this.prisma.user.findMany({
      where: {
        role: 'patient',
      },
      select: {
        birthDate: true,
        sex: true,
      },
    });

    return processPatientsData(rawData);
  }

  async getDoctorsSexData() {
    const data = await this.prisma.user.groupBy({
      by: 'sex',
      where: {
        role: 'doctor',
        isActive: true,
      },
      _count: true,
    });

    return data.map((item) => ({
      id: item.sex,
      value: item._count,
    }));
  }
}
