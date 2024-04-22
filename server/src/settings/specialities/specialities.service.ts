import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateSpecialityDto, CreateSpecialityDto } from './dto/specialities.dto';

@Injectable()
export class SpecialitiesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(createSpecialityDto: CreateSpecialityDto) {
    return this.prisma.speciality.create({
      data: createSpecialityDto,
    });
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
