import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  CreateMessageDto,
  CreateReportDto,
  UpdateReportDto,
} from './dto/reports.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByAppointmentId(appointmentId: string) {
    return this.prisma.report.findMany({
      where: { appointmentId },
      include: {
        appointment: true,
      },
    });
  }

  async findAllByPatientId(patientId: string) {
    return this.prisma.report.findMany({
      where: { appointment: { patientId } },
      include: {
        appointment: true,
      },
    });
  }

  async findById(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
        appointment: true,
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async create(createReportDto: CreateReportDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: createReportDto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.report.create({
      data: createReportDto,
    });
  }

  async update(id: string, updateReportDto: UpdateReportDto) {
    const existingReport = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException('Report not found');
    }

    const { appointmentId, reportURL, fileName, ...dto } = updateReportDto;

    return this.prisma.allergy.update({
      where: { id },
      data: dto,
    });
  }

  async updateStatus(id: string, status: 'processed' | 'failed') {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    if (report.status === 'processed') {
      throw new ConflictException('Report has already been processed');
    }

    return this.prisma.report.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string) {
    const existingReport = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException('Report not found');
    }

    return this.prisma.report.delete({
      where: { id },
    });
  }

  async getMessages(reportId: string, userId: string) {
    return this.prisma.message.findMany({
      where: { reportId, userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createMessage(
    reportId: string,
    userId: string,
    createMessageDto: CreateMessageDto,
  ) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return this.prisma.message.create({
      data: {
        ...createMessageDto,
        reportId,
        userId,
      },
    });
  }
}
