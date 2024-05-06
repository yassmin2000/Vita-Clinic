import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  CreateMedicalConditionDto,
  UpdateMedicalConditionDto,
} from './dto/medical-conditions.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class MedicalConditionsService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll() {
    return this.prisma.medicalCondition.findMany();
  }

  async findById(id: string) {
    const medicalCondition = await this.prisma.medicalCondition.findUnique({
      where: { id },
    });

    if (!medicalCondition) {
      throw new NotFoundException('Medical Condition not found');
    }

    return medicalCondition;
  }

  async create(
    userId: string,
    createMedicalConditionDto: CreateMedicalConditionDto,
  ) {
    const createdMedicalCondition = await this.prisma.medicalCondition.create({
      data: createMedicalConditionDto,
    });

    await this.logService.create({
      userId,
      targetId: createdMedicalCondition.id,
      targetName: createdMedicalCondition.name,
      type: 'medical-condition',
      action: 'create',
    });

    return createdMedicalCondition;
  }

  async update(
    id: string,
    updateMedicalConditionDto: UpdateMedicalConditionDto,
  ) {
    const existingMedicalCondition =
      await this.prisma.medicalCondition.findUnique({
        where: { id },
      });

    if (!existingMedicalCondition) {
      throw new NotFoundException('Medical Condition not found');
    }

    return this.prisma.medicalCondition.update({
      where: { id },
      data: updateMedicalConditionDto,
    });
  }

  async delete(id: string) {
    const existingMedicalConditions =
      await this.prisma.medicalCondition.findUnique({
        where: { id },
      });

    if (!existingMedicalConditions) {
      throw new NotFoundException('Medical Condition not found');
    }

    return this.prisma.medicalCondition.delete({
      where: { id },
    });
  }
}
