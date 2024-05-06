import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateDiagnosisDto, UpdateDiagnosisDto } from './dto/diagnoses.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class DiagnosesService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll() {
    return this.prisma.diagnosis.findMany();
  }

  async findById(id: string) {
    const diagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
    });

    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    return diagnosis;
  }

  async create(userId: string, createDiagnosisDto: CreateDiagnosisDto) {
    const createDiagnosis = await this.prisma.diagnosis.create({
      data: createDiagnosisDto,
    });

    await this.logService.create({
      userId,
      targetId: createDiagnosis.id,
      targetName: createDiagnosis.name,
      type: 'diagnosis',
      action: 'create',
    });
    return createDiagnosis;
  }

  async update(id: string, updateDiagnosisDto: UpdateDiagnosisDto) {
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

  async delete(id: string) {
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
