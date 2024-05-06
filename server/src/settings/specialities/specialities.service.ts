import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  UpdateSpecialityDto,
  CreateSpecialityDto,
} from './dto/specialities.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class SpecialitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll() {
    return this.prisma.speciality.findMany();
  }

  async findById(id: string) {
    const speciality = await this.prisma.speciality.findUnique({
      where: { id },
    });

    if (!speciality) {
      throw new NotFoundException('Speciality not found');
    }

    return speciality;
  }

  async create(userId: string, createSpecialityDto: CreateSpecialityDto) {
    const createdSpeciality = await this.prisma.speciality.create({
      data: createSpecialityDto,
    });

    await this.logService.create({
      userId,
      targetId: createdSpeciality.id,
      targetName: createdSpeciality.name,
      type: 'speciality',
      action: 'create',
    });

    return createdSpeciality;
  }

  async update(id: string, updateSpecialityDto: UpdateSpecialityDto) {
    const existingSpeciality = await this.prisma.speciality.findUnique({
      where: { id },
    });

    if (!existingSpeciality) {
      throw new NotFoundException('Speciality not found');
    }

    return this.prisma.speciality.update({
      where: { id },
      data: updateSpecialityDto,
    });
  }

  async delete(id: string) {
    const existingSpeciality = await this.prisma.speciality.findUnique({
      where: { id },
    });

    if (!existingSpeciality) {
      throw new NotFoundException('Speciality not found');
    }

    return this.prisma.speciality.delete({
      where: { id },
    });
  }
}
