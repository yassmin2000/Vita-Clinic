import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  UpdateSpecialityDto,
  CreateSpecialityDto,
  SpecialityDto,
} from './dto/specialities.dto';

@Injectable()
export class SpecialitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll(): Promise<SpecialityDto[]> {
    return this.prisma.speciality.findMany();
  }

  async findById(id: string): Promise<SpecialityDto> {
    const speciality = await this.prisma.speciality.findUnique({
      where: { id },
    });

    if (!speciality) {
      throw new NotFoundException('Speciality not found');
    }

    return speciality;
  }

  async create(
    userId: string,
    createSpecialityDto: CreateSpecialityDto,
  ): Promise<SpecialityDto> {
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

  async update(
    userId: string,
    id: string,
    updateSpecialityDto: UpdateSpecialityDto,
  ): Promise<SpecialityDto> {
    const existingSpeciality = await this.prisma.speciality.findUnique({
      where: { id },
    });

    if (!existingSpeciality) {
      throw new NotFoundException('Speciality not found');
    }

    const updatedSpeciality = await this.prisma.speciality.update({
      where: { id },
      data: updateSpecialityDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedSpeciality.id,
      targetName: updatedSpeciality.name,
      type: 'speciality',
      action: 'update',
    });

    return updatedSpeciality;
  }

  async delete(userId: string, id: string): Promise<SpecialityDto> {
    const existingSpeciality = await this.prisma.speciality.findUnique({
      where: { id },
    });

    if (!existingSpeciality) {
      throw new NotFoundException('Speciality not found');
    }

    const isSpecialityUsed = await this.prisma.user.findFirst({
      where: {
        specialityId: id,
      },
    });

    if (isSpecialityUsed) {
      throw new ConflictException(
        'Speciality is being used by a doctor and cannot be deleted.',
      );
    }

    const deletedSpeciality = await this.prisma.speciality.delete({
      where: { id },
    });

    await this.logService.create({
      userId,
      targetId: deletedSpeciality.id,
      targetName: deletedSpeciality.name,
      type: 'speciality',
      action: 'delete',
    });

    return deletedSpeciality;
  }
}
