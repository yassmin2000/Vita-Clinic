import { Injectable, UnauthorizedException } from '@nestjs/common';

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
import { Role } from '@prisma/client';

@Injectable()
export class DashboardsService {
  constructor(private prisma: PrismaService) {}

  async getStatistics(userId: string, role: Role) {
    const patientsCount = await this.prisma.user.count({
      where: {
        role: 'patient',
        isActive: true,
      },
    });

    const devicesCount = await this.prisma.device.count();

    if (role === 'admin') {
      const doctorsCount = await this.prisma.user.count({
        where: {
          role: 'doctor',
          isActive: true,
        },
      });

      const appointmentsCountByStatus = await this.prisma.appointment.groupBy({
        by: 'status',
        _count: true,
      });

      const appointmentsCount = {
        all: appointmentsCountByStatus.reduce((acc, item) => {
          acc += item._count;
          return acc;
        }, 0),
        completed:
          appointmentsCountByStatus.find(
            (count) => count.status === 'completed',
          )?._count || 0,
        approved:
          appointmentsCountByStatus.find((count) => count.status === 'approved')
            ?._count || 0,
        pending:
          appointmentsCountByStatus.find((count) => count.status === 'pending')
            ?._count || 0,
        cancelled:
          appointmentsCountByStatus.find(
            (count) => count.status === 'cancelled',
          )?._count || 0,
        rejected:
          appointmentsCountByStatus.find((count) => count.status === 'rejected')
            ?._count || 0,
      };

      return {
        patientsCount,
        doctorsCount,
        appointmentsCount,
        devicesCount,
      };
    } else if (role === 'doctor') {
      const doctorAppointmentsCount = await this.prisma.appointment.count({
        where: {
          status: 'approved',
          doctorId: userId,
        },
      });

      return {
        patientsCount,
        appointmentsCount: doctorAppointmentsCount,
        devicesCount,
      };
    }

    throw new UnauthorizedException();
  }

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
        isActive: true,
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
