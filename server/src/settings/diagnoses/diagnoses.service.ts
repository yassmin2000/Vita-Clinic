import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDiagnosisDto, UpdateDiagnosisDto } from './dto/diagnoses.dto';

@Injectable()
export class DiagnosesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDiagnosis(createDiagnosisDto: CreateDiagnosisDto) {
    return this.prisma.diagnosis.create({
      data: createDiagnosisDto,
    });
  }

  async getAllDiagnoses() {
    return this.prisma.diagnosis.findMany();
  }

  async getDiagnosisById(id: string) {
    return this.prisma.diagnosis.findUnique({
      where: { id },
    });
  }

  async updateDiagnosis(id: string, updateDiagnosisDto: UpdateDiagnosisDto) {
    const existingDiagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
    });

    if (!existingDiagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    return this.prisma.diagnosis.update({
      where: { id },
      data: updateDiagnosisDto,
    });
  }

  async deleteDiagnosis(id: string) {
    const existingDiagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
    });

    if (!existingDiagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    return this.prisma.diagnosis.delete({
      where: { id },
    });
  }
}
