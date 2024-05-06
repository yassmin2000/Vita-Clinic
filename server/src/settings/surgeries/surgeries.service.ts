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
  async update(userId: string, id: string, updateSurgeryDto: UpdateSurgeryDto) {
    const existingSurgery = await this.prisma.surgery.findUnique({
      where: { id },
    });

    if (!existingSurgery) {
      throw new NotFoundException('Surgery not found');
    }

    const updatedSurgery = await this.prisma.surgery.update({
      where: { id },
      data: updateSurgeryDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedSurgery.id,
      targetName: updatedSurgery.name,
      type: 'surgery',
      action: 'update',
    });

    return updatedSurgery;
  }

  async delete(userId: string, id: string) {
    const existingSurgery = await this.prisma.surgery.findUnique({
      where: { id },
    });

    if (!existingSurgery) {
      throw new NotFoundException('Surgery not found');
    }

    const deletedSurgery = await this.prisma.surgery.delete({
      where: { id },
    });

    await this.logService.create({
      userId,
      targetId: deletedSurgery.id,
      targetName: deletedSurgery.name,
      type: 'surgery',
      action: 'delete',
    });

    return deletedSurgery;
  }
}
