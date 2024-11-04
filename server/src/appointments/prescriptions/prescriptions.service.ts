import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  GetPatientPrescriptionsQuery,
  PrescriptionDto,
  BasicPrescriptionDto,
} from './dto/prescriptions.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService,
  ) {}

  async findAllByAppointmentId(
    appointmentId: string,
  ): Promise<PrescriptionDto[]> {
    return this.prisma.prescription.findMany({
      where: { appointmentId },
      include: {
        medication: true,
        appointment: true,
      },
    });
  }

  async findAllByPatientId(
    patientId: string,
    {
      page = 1,
      limit = 10,
      sort = 'createdAt-desc',
    }: GetPatientPrescriptionsQuery,
  ): Promise<BasicPrescriptionDto[]> {
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    return this.prisma.prescription.findMany({
      where: {
        appointment: { patientId },
      },
      include: {
        medication: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        {
          createdAt: sortField === 'createdAt' ? sortOrder : undefined,
        },
      ],
    });
  }

  async create(
    createPrescriptionDto: CreatePrescriptionDto,
    userId: string,
  ): Promise<BasicPrescriptionDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: createPrescriptionDto.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const medication = await this.prisma.medication.findUnique({
      where: { id: createPrescriptionDto.medicationId },
    });

    if (!medication) {
      throw new NotFoundException('Medication not found');
    }

    const prescription = await this.prisma.prescription.create({
      data: createPrescriptionDto,
      include: {
        medication: true,
      },
    });

    await this.logService.create({
      userId,
      targetId: prescription.id,
      targetName: prescription.medication.name,
      type: 'prescription',
      action: 'create',
      targetUserId: appointment.patientId,
    });

    return prescription;
  }

  async update(
    id: string,
    updatePrescriptionDto: UpdatePrescriptionDto,
    userId: string,
  ): Promise<BasicPrescriptionDto> {
    const existingPrescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!existingPrescription) {
      throw new NotFoundException('Prescription not found');
    }

    const { medicationId, appointmentId, ...dto } = updatePrescriptionDto;

    const prescription = await this.prisma.prescription.update({
      where: { id },
      data: dto,
      include: {
        medication: true,
        appointment: {
          select: {
            patientId: true,
          },
        },
      },
    });

    await this.logService.create({
      userId,
      targetId: prescription.id,
      targetName: prescription.medication.name,
      type: 'prescription',
      action: 'update',
      targetUserId: prescription.appointment.patientId,
    });

    return prescription;
  }
}
