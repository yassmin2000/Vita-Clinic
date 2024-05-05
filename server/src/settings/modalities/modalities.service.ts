import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateModalityDto, UpdateModalityDto } from './dto/modalities.dto';
import { LogService } from 'src/log/log.service';
@Injectable()
export class ModalitiesService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService
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


  async create(userId: string,createModalityDto: CreateModalityDto) {
    const createdModality = await this.prisma.modality.create({
      data: createModalityDto,
    });

 
    await this.logService.create(
      userId,
      createdModality.id,
      createdModality.name,
      'Modality',
      'Create',
    );

    return createdModality;
  }
  async update(id: string, updateModalityDto: UpdateModalityDto) {
    const existingModality = await this.prisma.modality.findUnique({
      where: { id },
    });

    if (!existingModality) {
      throw new NotFoundException('Modality not found');
    }

    return this.prisma.modality.update({
      where: { id },
      data: updateModalityDto,
    });
  }

  async delete(id: string) {
    const existingModality = await this.prisma.modality.findUnique({
      where: { id },
    });

    if (!existingModality) {
      throw new NotFoundException('Modality not found');
    }

    return this.prisma.modality.delete({
      where: { id },
    });
  }
}
