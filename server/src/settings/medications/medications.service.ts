import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

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

  async updateMedication(
    userId: string,
    id: string,
    updateMedicationDto: UpdateMedicationDto,
  ) {
    const existingMedication = await this.prisma.medication.findUnique({
      where: { id },
    });

    if (!existingMedication) {
      throw new NotFoundException('Medication not found');
    }

    const updatedMedication = await this.prisma.medication.update({
      where: { id },
      data: updateMedicationDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedMedication.id,
      targetName: updatedMedication.name,
      type: 'medication',
      action: 'update',
    });

    return updatedMedication;
  }

  async deleteMedication(userId: string, id: string) {
    const existingMedication = await this.prisma.medication.findUnique({
      where: { id },
    });

    if (!existingMedication) {
      throw new NotFoundException('Medication not found');
    }

    try {
      const deletedMedication = await this.prisma.medication.delete({
        where: { id },
      });

      await this.logService.create({
        userId,
        targetId: deletedMedication.id,
        targetName: deletedMedication.name,
        type: 'medication',
        action: 'delete',
      });

      return deletedMedication;
    } catch {
      throw new ConflictException(
        'Medication is being used in an EMR/prescription and cannot be deleted.',
      );
    }
  }
}
