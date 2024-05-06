import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
} from './dto/medications.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class MedicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll() {
    return this.prisma.medication.findMany();
  }

  async findById(id: string) {
    const medication = await this.prisma.medication.findUnique({
      where: { id },
    });

    if (!medication) {
      throw new NotFoundException('Diagnosis not found');
    }

    return medication;
  }

  async create(userId: string, createMedicationDto: CreateMedicationDto) {
    const createdMedication = await this.prisma.medication.create({
      data: createMedicationDto,
    });

    await this.logService.create({
      userId,
      targetId: createdMedication.id,
      targetName: createdMedication.name,
      type: 'medication',
      action: 'create',
    });

    return createdMedication;
  }

  async updateMedication(id: string, updateMedicationDto: UpdateMedicationDto) {
    const existingMedication = await this.prisma.medication.findUnique({
      where: { id },
    });

    if (!existingMedication) {
      throw new NotFoundException('Medication not found');
    }

    return this.prisma.medication.update({
      where: { id },
      data: updateMedicationDto,
    });
  }

  async deleteMedication(id: string) {
    const existingMedication = await this.prisma.medication.findUnique({
      where: { id },
    });

    if (!existingMedication) {
      throw new NotFoundException('Medication not found');
    }

    return this.prisma.medication.delete({
      where: { id },
    });
  }
}
