import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  CreateModalityDto,
  ModalityDto,
  UpdateModalityDto,
} from './dto/modalities.dto';

@Injectable()
export class ModalitiesService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll(): Promise<ModalityDto[]> {
    return this.prisma.modality.findMany();
  }

  async findById(id: string): Promise<ModalityDto> {
    const modality = await this.prisma.modality.findUnique({
      where: { id },
    });

    if (!modality) {
      throw new NotFoundException('Modality not found');
    }

    return modality;
  }

  async create(
    userId: string,
    createModalityDto: CreateModalityDto,
  ): Promise<ModalityDto> {
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
  ): Promise<ModalityDto> {
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

  async delete(userId: string, id: string): Promise<ModalityDto> {
    const existingModality = await this.prisma.modality.findUnique({
      where: { id },
    });

    if (!existingModality) {
      throw new NotFoundException('Modality not found');
    }

    const isModalityUsed =
      (await this.prisma.appointmentServices.findFirst({
        where: {
          scans: {
            some: {
              id,
            },
          },
        },
      })) ||
      (await this.prisma.scan.findFirst({
        where: {
          modalityId: id,
        },
      }));

    if (isModalityUsed) {
      throw new ConflictException(
        'Modality is being used in a scan and cannot be deleted.',
      );
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
