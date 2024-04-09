import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAllergyDto, UpdateAllergyDto } from './dto/allergies.dto';

@Injectable()
export class AllergiesService {
  constructor(private readonly prisma: PrismaService) {}

  async createAllergy(createAllergyDto: CreateAllergyDto) {
    return this.prisma.allergy.create({
      data: createAllergyDto,
    });
  }

  async getAllAllergies() {
    return await this.prisma.allergy.findMany();
  }

  async getAllergyById(id: string) {
    return this.prisma.allergy.findUnique({
      where: { id },
    });
  }

  async updateAllergy(id: string, updateAllergyDto: UpdateAllergyDto) {
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

  async deleteAllergy(id: string) {
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
