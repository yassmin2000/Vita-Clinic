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
    const createdDiagnosis = await this.prisma.diagnosis.create({
      data: createDiagnosisDto,
    });

    await this.logService.create({
      userId,
      targetId: createdDiagnosis.id,
      targetName: createdDiagnosis.name,
      type: 'diagnosis',
      action: 'create',
    });
    return createdDiagnosis;
  }

  async update(
    userId: string,
    id: string,
    updateDiagnosisDto: UpdateDiagnosisDto,
  ) {
    const existingDiagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
    });

    if (!existingDiagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    const updateDiagnosis = await this.prisma.diagnosis.update({
      where: { id },
      data: updateDiagnosisDto,
    });

    await this.logService.create({
      userId,
      targetId: updateDiagnosis.id,
      targetName: updateDiagnosis.name,
      type: 'diagnosis',
      action: 'update',
    });

    return updateDiagnosis;
  }

  async delete(userId: string, id: string) {
    const existingDiagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
    });

    if (!existingDiagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    const deleteDiagnosis = await this.prisma.diagnosis.delete({
      where: { id },
    });

    await this.logService.create({
      userId,
      targetId: deleteDiagnosis.id,
      targetName: deleteDiagnosis.name,
      type: 'diagnosis',
      action: 'delete',
    });

    return deleteDiagnosis;
  }
}
