import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateSurgeryDto, UpdateSurgeryDto } from './dto/surgeries.dto';

@Injectable()
export class SurgeriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.surgery.findMany();
  }

  async findById(id: string) {
    const surgery = await this.prisma.surgery.findUnique({
      where: { id },
    });

    if (!surgery) {
      throw new NotFoundException('Surgery not found');
    }

    return surgery;
  }

  async create(createSurgeryDto: CreateSurgeryDto) {
    return this.prisma.surgery.create({
      data: createSurgeryDto,
    });
  }

  async update(id: string, updateSurgeryDto: UpdateSurgeryDto) {
    const existingSurgery = await this.prisma.surgery.findUnique({
      where: { id },
    });

    if (!existingSurgery) {
      throw new NotFoundException('Surgery not found');
    }

    return this.prisma.surgery.update({
      where: { id },
      data: updateSurgeryDto,
    });
  }

  async delete(id: string) {
    const existingSurgery = await this.prisma.surgery.findUnique({
      where: { id },
    });

    if (!existingSurgery) {
      throw new NotFoundException('Surgery not found');
    }

    return this.prisma.surgery.delete({
      where: { id },
    });
  }
}
