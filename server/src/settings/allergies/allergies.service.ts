import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateAllergyDto, UpdateAllergyDto } from './dto/allergies.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class AllergiesService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll() {
    return this.prisma.allergy.findMany();
  }

  async findById(id: string) {
    const allergy = await this.prisma.allergy.findUnique({
      where: { id },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    return allergy;
  }

  async create(userId: string, createAllergyDto: CreateAllergyDto) {
    const createdAllergy = await this.prisma.allergy.create({
      data: createAllergyDto,
    });

    await this.logService.create({
      userId,
      targetId: createdAllergy.id,
      targetName: createdAllergy.name,
      type: 'allergy',
      action: 'create',
    });

    return createdAllergy;
  }

  async update(id: string, userId: string, updateAllergyDto: UpdateAllergyDto) {
    const existingAllergy = await this.prisma.allergy.findUnique({
      where: { id },
    });

    if (!existingAllergy) {
      throw new NotFoundException('Allergy not found');
    }

    const updatedAllergy = await this.prisma.allergy.update({
      where: { id },
      data: updateAllergyDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedAllergy.id,
      targetName: updatedAllergy.name,
      type: 'allergy',
      action: 'update',
    });

    return updatedAllergy;
  }

  async delete(id: string, userId: string) {
    const existingAllergy = await this.prisma.allergy.findUnique({
      where: { id },
    });

    if (!existingAllergy) {
      throw new NotFoundException('Allergy not found');
    }

    const deletedAllergy = await this.prisma.allergy.delete({
      where: { id },
    });

    await this.logService.create({
      userId,
      targetId: deletedAllergy.id,
      targetName: deletedAllergy.name,
      type: 'allergy',
      action: 'delete',
    });

    return deletedAllergy;
  }
}
