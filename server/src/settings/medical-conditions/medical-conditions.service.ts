import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  CreateMedicalConditionDto,
  MedicalConditionDto,
  UpdateMedicalConditionDto,
} from './dto/medical-conditions.dto';

@Injectable()
export class MedicalConditionsService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll(): Promise<MedicalConditionDto[]> {
    return this.prisma.medicalCondition.findMany();
  }

  async findById(id: string): Promise<MedicalConditionDto> {
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
  ): Promise<MedicalConditionDto> {
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
    userId: string,
    id: string,
    updateMedicalConditionDto: UpdateMedicalConditionDto,
  ): Promise<MedicalConditionDto> {
    const existingMedicalCondition =
      await this.prisma.medicalCondition.findUnique({
        where: { id },
      });

    if (!existingMedicalCondition) {
      throw new NotFoundException('Medical Condition not found');
    }

    const updatedMedicalConditions = await this.prisma.medicalCondition.update({
      where: { id },
      data: updateMedicalConditionDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedMedicalConditions.id,
      targetName: updatedMedicalConditions.name,
      type: 'medical-condition',
      action: 'update',
    });

    return updatedMedicalConditions;
  }

  async delete(userId: string, id: string): Promise<MedicalConditionDto> {
    const existingMedicalConditions =
      await this.prisma.medicalCondition.findUnique({
        where: { id },
      });

    if (!existingMedicalConditions) {
      throw new NotFoundException('Medical Condition not found');
    }

    try {
      const deletedMedicalConditions =
        await this.prisma.medicalCondition.delete({
          where: { id },
        });

      await this.logService.create({
        userId,
        targetId: deletedMedicalConditions.id,
        targetName: deletedMedicalConditions.name,
        type: 'medical-condition',
        action: 'delete',
      });

      return deletedMedicalConditions;
    } catch {
      throw new ConflictException(
        'Medical condition is being used in an EMR and cannot be deleted.',
      );
    }
  }
}
