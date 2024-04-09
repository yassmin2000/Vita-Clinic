import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medications.dto';

@Injectable()
export class MedicationsService {
    
  constructor(private readonly prisma: PrismaService) {}

  async createMedication(createMedicationDto: CreateMedicationDto) {
    return this.prisma.medication.create({
      data: createMedicationDto,
    });
  }

  async findAll() {
    return await this.prisma.medication.findMany();
  }

  async findById(id: string) {
    return this.prisma.medication.findUnique({
      where: { id },
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
