import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateBiomarkerDto, UpdateBiomarkerDto } from './dto/biomarkers.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class BiomarkersService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService
  ) {}

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

  async create(userId: string,createBiomarkerDto: CreateBiomarkerDto) {
    const createdBiomarker = await this.prisma.biomarker.create({
      data: createBiomarkerDto,
    });

    await this.logService.create(
      userId,
      createdBiomarker.id,
      createdBiomarker.name,
      'Biomarker',
      'Create',
    );
    return createdBiomarker;
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
