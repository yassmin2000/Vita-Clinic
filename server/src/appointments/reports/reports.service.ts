import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  BasicReportDto,
  CreateMessageDto,
  CreateReportDto,
  GetPatientReportsQuery,
  MessageDto,
  ReportDto,
  UpdateReportDto,
} from './dto/reports.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService,
  ) {}

  async findAllByAppointmentId(appointmentId: string): Promise<ReportDto[]> {
    return this.prisma.report.findMany({
      where: { appointmentId },
      include: {
        appointment: true,
      },
    });
  }

  async findAllByPatientId(
    patientId: string,
    {
      page = 1,
      limit = 10,
      value = '',
      sort = 'createdAt-desc',
    }: GetPatientReportsQuery,
  ): Promise<BasicReportDto[]> {
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    return this.prisma.report.findMany({
      where: {
        appointment: { patientId },
        title: { contains: value, mode: 'insensitive' },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          title: sortField === 'name' ? sortOrder : undefined,
        },
        {
          createdAt: sortField === 'createdAt' ? sortOrder : undefined,
        },
      ],
    });
  }

  async findById(id: string): Promise<ReportDto> {
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

  async create(
    createReportDto: CreateReportDto,
    userId: string,
  ): Promise<BasicReportDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: createReportDto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const report = await this.prisma.report.create({
      data: createReportDto,
    });

    await this.logService.create({
      userId,
      targetId: report.id,
      targetName: report.title,
      type: 'report',
      action: 'create',
      targetUserId: appointment.patientId,
    });

    return report;
  }

  async update(
    id: string,
    updateReportDto: UpdateReportDto,
    userId: string,
  ): Promise<BasicReportDto> {
    const existingReport = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!existingReport) {
      throw new NotFoundException('Report not found');
    }

    const { appointmentId, reportURL, fileName, ...dto } = updateReportDto;

    const report = await this.prisma.report.update({
      where: { id },
      data: dto,
      include: {
        appointment: {
          select: {
            patientId: true,
          },
        },
      },
    });

    await this.logService.create({
      userId,
      targetId: id,
      targetName: report.title,
      type: 'report',
      action: 'update',
      targetUserId: report.appointment.patientId,
    });

    return report;
  }

  async updateStatus(
    id: string,
    status: 'processed' | 'failed',
  ): Promise<BasicReportDto> {
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

  async getMessages(reportId: string, userId: string): Promise<MessageDto[]> {
    return this.prisma.message.findMany({
      where: { reportId, userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createMessage(
    reportId: string,
    userId: string,
    createMessageDto: CreateMessageDto,
  ): Promise<MessageDto> {
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
