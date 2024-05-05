import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateTherapyDto, UpdateTherapyDto } from './dto/therapies.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class TherapiesService {
  constructor(
    private readonly prisma: PrismaService,
    private logService:LogService
  ) {}

  async findAll() {
    return this.prisma.therapy.findMany();
  }

  async findById(id: string) {
    const therapy = await this.prisma.therapy.findUnique({
      where: { id },
    });

    if (!therapy) {
      throw new NotFoundException('Therapy not found');
    }

    return therapy;
  }

  async create(userId: string,createTherapyDto: CreateTherapyDto) {
    const createdTherapy = await this.prisma.therapy.create({
      data: createTherapyDto,
    });

 
    await this.logService.create(
      userId,
      createdTherapy.id,
      createdTherapy.name,
      'Therapy',
      'Create',
    );

    return createdTherapy;
  }

  async update(id: string, updateTherapyDto: UpdateTherapyDto) {
    const existingTherapy = await this.prisma.therapy.findUnique({
      where: { id },
    });

    if (!existingTherapy) {
      throw new NotFoundException('Therapy not found');
    }

    return this.prisma.therapy.update({
      where: { id },
      data: updateTherapyDto,
    });
  }

  async delete(id: string) {
    const existingTherapy = await this.prisma.therapy.findUnique({
      where: { id },
    });

    if (!existingTherapy) {
      throw new NotFoundException('Therapy not found');
    }

    return this.prisma.therapy.delete({
      where: { id },
    });
  }
}
