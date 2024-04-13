import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateBiomarkerDto, UpdateBiomarkerDto } from './dto/biomarkers.dto';

@Injectable()
export class BiomarkersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.biomarker.findMany();
  }

  async findById(id: string) {
    const biomarker = await this.prisma.biomarker.findUnique({
      where: { id },
    });

    if (!biomarker) {
      throw new NotFoundException('Biomarker not found');
    }

    return biomarker;
  }

  async create(createBiomarkerDto: CreateBiomarkerDto) {
    return this.prisma.biomarker.create({
      data: createBiomarkerDto,
    });
  }

  async update(id: string, updateBiomarkerDto: UpdateBiomarkerDto) {
    const existingBiomarker = await this.prisma.biomarker.findUnique({
      where: { id },
    });

    if (!existingBiomarker) {
      throw new NotFoundException('Biomarker not found');
    }

    return this.prisma.biomarker.update({
      where: { id },
      data: updateBiomarkerDto,
    });
  }

  async delete(id: string) {
    const existingBiomarker = await this.prisma.biomarker.findUnique({
      where: { id },
    });

    if (!existingBiomarker) {
      throw new NotFoundException('Biomarker not found');
    }

    return this.prisma.biomarker.delete({
      where: { id },
    });
  }
}
