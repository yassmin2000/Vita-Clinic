import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateModalityDto, UpdateModalityDto } from './dto/modalities.dto';
import { LogService } from 'src/log/log.service';
@Injectable()
export class ModalitiesService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll() {
    return this.prisma.modality.findMany();
  }

  async findById(id: string) {
    const modality = await this.prisma.modality.findUnique({
      where: { id },
    });

    if (!modality) {
      throw new NotFoundException('Modality not found');
    }

    return modality;
  }

  async create(userId: string, createModalityDto: CreateModalityDto) {
    const createdModality = await this.prisma.modality.create({
      data: createModalityDto,
    });

    await this.logService.create({
      userId,
      targetId: createdModality.id,
      targetName: createdModality.name,
      type: 'modality',
      action: 'create',
    });

    return createdModality;
  }
  
  async update(
    userId: string,
    id: string,
    updateModalityDto: UpdateModalityDto,
  ) {
    const existingModality = await this.prisma.modality.findUnique({
      where: { id },
    });

    if (!existingModality) {
      throw new NotFoundException('Modality not found');
    }

    const updatedModality = await this.prisma.modality.update({
      where: { id },
      data: updateModalityDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedModality.id,
      targetName: updatedModality.name,
      type: 'modality',
      action: 'update',
    });

    return updatedModality;
  }

  async delete(userId: string, id: string) {
    const existingModality = await this.prisma.modality.findUnique({
      where: { id },
    });

    if (!existingModality) {
      throw new NotFoundException('Modality not found');
    }

    const deletedModality = await this.prisma.modality.delete({
      where: { id },
    });

    await this.logService.create({
      userId,
      targetId: deletedModality.id,
      targetName: deletedModality.name,
      type: 'modality',
      action: 'delete',
    });

    return deletedModality;
  }
}
