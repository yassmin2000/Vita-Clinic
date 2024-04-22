import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
} from './dto/medications.dto';

@Injectable()
export class MedicationsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async createMedication(createMedicationDto: CreateMedicationDto) {
    return this.prisma.medication.create({
      data: createMedicationDto,
    });
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
