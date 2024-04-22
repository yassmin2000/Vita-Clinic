import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateModalityDto, UpdateModalityDto } from './dto/modalities.dto';
@Injectable()
export class ModalitiesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(createModalityDto: CreateModalityDto) {
    return this.prisma.modality.create({
      data: createModalityDto,
    });
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
