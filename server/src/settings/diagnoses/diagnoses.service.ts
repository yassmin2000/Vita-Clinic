import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  CreateDiagnosisDto,
  DiagnosisDto,
  UpdateDiagnosisDto,
} from './dto/diagnoses.dto';

@Injectable()
export class DiagnosesService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll(): Promise<DiagnosisDto[]> {
    return this.prisma.diagnosis.findMany();
  }

  async findById(id: string): Promise<DiagnosisDto> {
    const diagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
    });

    if (!diagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    return diagnosis;
  }

  async create(
    userId: string,
    createDiagnosisDto: CreateDiagnosisDto,
  ): Promise<DiagnosisDto> {
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
  ): Promise<DiagnosisDto> {
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

  async delete(userId: string, id: string): Promise<DiagnosisDto> {
    const existingDiagnosis = await this.prisma.diagnosis.findUnique({
      where: { id },
    });

    if (!existingDiagnosis) {
      throw new NotFoundException('Diagnosis not found');
    }

    try {
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
    } catch {
      throw new ConflictException(
        'Diagnosis is being used in an EMR and cannot be deleted.',
      );
    }
  }
}
