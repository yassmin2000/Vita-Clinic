import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  CreateSurgeryDto,
  SurgeryDto,
  UpdateSurgeryDto,
} from './dto/surgeries.dto';

@Injectable()
export class SurgeriesService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll(): Promise<SurgeryDto[]> {
    return this.prisma.surgery.findMany();
  }

  async findById(id: string): Promise<SurgeryDto> {
    const surgery = await this.prisma.surgery.findUnique({
      where: { id },
    });

    if (!surgery) {
      throw new NotFoundException('Surgery not found');
    }

    return surgery;
  }

  async create(
    userId: string,
    createSurgeryDto: CreateSurgeryDto,
  ): Promise<SurgeryDto> {
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

  async delete(userId: string, id: string): Promise<SurgeryDto> {
    const existingSurgery = await this.prisma.surgery.findUnique({
      where: { id },
    });

    if (!existingSurgery) {
      throw new NotFoundException('Surgery not found');
    }

    try {
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
    } catch {
      throw new ConflictException(
        'Surgery is being used in an EMR and cannot be deleted.',
      );
    }
  }
}
