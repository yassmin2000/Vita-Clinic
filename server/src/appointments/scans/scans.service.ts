import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { CreateScanDto, UpdateScanDto } from './dto/scans.dto';

@Injectable()
export class ScansService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByPatientId(patientId: string) {
    return this.prisma.scan.findMany({
      where: { appointment: { patientId } },
      select: {
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        modality: true,
        appointment: true,
      },
    });
  }

  async findAllByAppointmentId(appointmentId: string) {
    return this.prisma.scan.findMany({
      where: { appointmentId },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        modality: true,
        appointment: true,
      },
    });
  }

  async findById(id: string) {
    const scan = await this.prisma.scan.findUnique({
      where: { id },
      include: {
        appointment: true,
        modality: true,
      },
    });

    if (!scan) {
      throw new NotFoundException('Scan not found');
    }

    return scan;
  }

  async create(createScanDto: CreateScanDto) {
    const { title, description, modalityId, scanURLs, appointmentId } =
      createScanDto;

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    const modality = await this.prisma.modality.findUnique({
      where: { id: modalityId },
    });

    if (!appointment || !modality) {
      throw new NotFoundException('Appointment not found');
    }

    return this.prisma.scan.create({
      data: {
        title,
        description,
        modality: { connect: { id: modalityId } },
        scanURLs,
        appointment: { connect: { id: appointmentId } },
      },
    });
  }

  async update(id: string, updateScanDto: UpdateScanDto) {
    const { title, description, modalityId, scanURLs, appointmentId } =
      updateScanDto;

    const existingScan = await this.prisma.scan.findUnique({
      where: { id },
    });

    if (!existingScan) {
      throw new NotFoundException('Scan not found');
    }

    return this.prisma.scan.update({
      where: { id },
      data: {
        title,
        description,
        scanURLs,
      },
    });
  }

  async delete(id: string) {
    const existingScan = await this.prisma.scan.findUnique({
      where: { id },
    });

    if (!existingScan) {
      throw new NotFoundException('Scan not found');
    }

    return this.prisma.scan.delete({
      where: { id },
    });
  }
}
