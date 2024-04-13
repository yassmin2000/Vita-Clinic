import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateAllergyDto, UpdateAllergyDto } from './dto/allergies.dto';

@Injectable()
export class AllergiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.allergy.findMany();
  }

  async findById(id: string) {
    const allergy = await this.prisma.allergy.findUnique({
      where: { id },
    });

    if (!allergy) {
      throw new NotFoundException('Allergy not found');
    }

    return allergy;
  }

  async create(createAllergyDto: CreateAllergyDto) {
    return this.prisma.allergy.create({
      data: createAllergyDto,
    });
  }

  async update(id: string, updateAllergyDto: UpdateAllergyDto) {
    const existingAllergy = await this.prisma.allergy.findUnique({
      where: { id },
    });

    if (!existingAllergy) {
      throw new NotFoundException('Allergy not found');
    }

    return this.prisma.allergy.update({
      where: { id },
      data: updateAllergyDto,
    });
  }

  async delete(id: string) {
    const existingAllergy = await this.prisma.allergy.findUnique({
      where: { id },
    });

    if (!existingAllergy) {
      throw new NotFoundException('Allergy not found');
    }

    return this.prisma.allergy.delete({
      where: { id },
    });
  }
}
