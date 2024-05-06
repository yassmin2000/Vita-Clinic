import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateSurgeryDto, UpdateSurgeryDto } from './dto/surgeries.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class SurgeriesService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService,
  ) {}

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

  async create(userId: string, createSurgeryDto: CreateSurgeryDto) {
    const createdSurgery = await this.prisma.surgery.create({
      data: createSurgeryDto,
    });

    await this.logService.create({
      userId,
      targetId: createdSurgery.id,
      targetName: createdSurgery.name,
      type: 'surgery',
      action: 'create',
    });

    return createdSurgery;
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
