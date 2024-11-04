import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  CreateTreatmentDto,
  UpdateTreatmentDto,
  GetPatientTreatmentsQuery,
  TreatmentDto,
  FullTreatmentDto,
  BasicTreatmentDto,
} from './dto/treatments.dto';

@Injectable()
export class TreatmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService,
  ) {}

  async findAllByAppointmentId(
    appointmentId: string,
  ): Promise<FullTreatmentDto[]> {
    return this.prisma.treatment.findMany({
      where: { appointmentId },
      include: {
        therapy: true,
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
    }: GetPatientTreatmentsQuery,
  ): Promise<TreatmentDto[]> {
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    return this.prisma.treatment.findMany({
      where: {
        appointment: { patientId },
        name: { contains: value, mode: 'insensitive' },
      },
      include: {
        therapy: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          name: sortField === 'name' ? sortOrder : undefined,
        },
        {
          createdAt: sortField === 'createdAt' ? sortOrder : undefined,
        },
      ],
    });
  }

  async create(
    createTreatmentDto: CreateTreatmentDto,
    userId: string,
  ): Promise<BasicTreatmentDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: createTreatmentDto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const therapy = await this.prisma.therapy.findUnique({
      where: { id: createTreatmentDto.therapyId },
    });

    if (!therapy) {
      throw new NotFoundException('Therapy not found');
    }

    const treatment = await this.prisma.treatment.create({
      data: createTreatmentDto,
    });

    await this.logService.create({
      userId,
      targetId: treatment.id,
      targetName: treatment.name,
      type: 'treatment',
      action: 'create',
      targetUserId: appointment.patientId,
    });

    return treatment;
  }

  async update(
    id: string,
    updateTreatmentDto: UpdateTreatmentDto,
    userId: string,
  ): Promise<BasicTreatmentDto> {
    const existingTreatment = await this.prisma.treatment.findUnique({
      where: { id },
    });

    if (!existingTreatment) {
      throw new NotFoundException('Treatment not found');
    }

    const { therapyId, appointmentId, ...dto } = updateTreatmentDto;

    const treatment = await this.prisma.treatment.update({
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
      targetId: treatment.id,
      targetName: treatment.name,
      type: 'treatment',
      action: 'update',
      targetUserId: treatment.appointment.patientId,
    });

    return treatment;
  }
}
