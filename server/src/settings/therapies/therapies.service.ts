import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  CreateTherapyDto,
  TherapyDto,
  UpdateTherapyDto,
} from './dto/therapies.dto';

@Injectable()
export class TherapiesService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll(): Promise<TherapyDto[]> {
    return this.prisma.therapy.findMany();
  }

  async findById(id: string): Promise<TherapyDto> {
    const therapy = await this.prisma.therapy.findUnique({
      where: { id },
    });

    if (!therapy) {
      throw new NotFoundException('Therapy not found');
    }

    return therapy;
  }

  async create(
    userId: string,
    createTherapyDto: CreateTherapyDto,
  ): Promise<TherapyDto> {
    const createdTherapy = await this.prisma.therapy.create({
      data: createTherapyDto,
    });

    await this.logService.create({
      userId,
      targetId: createdTherapy.id,
      targetName: createdTherapy.name,
      type: 'therapy',
      action: 'create',
    });

    return createdTherapy;
  }

  async update(
    userId: string,
    id: string,
    updateTherapyDto: UpdateTherapyDto,
  ): Promise<TherapyDto> {
    const existingTherapy = await this.prisma.therapy.findUnique({
      where: { id },
    });

    if (!existingTherapy) {
      throw new NotFoundException('Therapy not found');
    }

    const updatedTherapy = await this.prisma.therapy.update({
      where: { id },
      data: updateTherapyDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedTherapy.id,
      targetName: updatedTherapy.name,
      type: 'therapy',
      action: 'update',
    });

    return updatedTherapy;
  }

  async delete(userId: string, id: string): Promise<TherapyDto> {
    const existingTherapy = await this.prisma.therapy.findUnique({
      where: { id },
    });

    if (!existingTherapy) {
      throw new NotFoundException('Therapy not found');
    }

    const isTherapyUsed =
      (await this.prisma.appointmentServices.findFirst({
        where: {
          therapyId: id,
        },
      })) ||
      (await this.prisma.treatment.findFirst({
        where: {
          therapyId: id,
        },
      }));

    if (isTherapyUsed) {
      throw new ConflictException(
        'Therapy is being used in a treatment and cannot be deleted.',
      );
    }

    const deletedTherapy = await this.prisma.therapy.delete({
      where: { id },
    });

    await this.logService.create({
      userId,
      targetId: deletedTherapy.id,
      targetName: deletedTherapy.name,
      type: 'therapy',
      action: 'delete',
    });

    return deletedTherapy;
  }
}
