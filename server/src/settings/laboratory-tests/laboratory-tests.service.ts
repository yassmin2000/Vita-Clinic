import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { BiomarkersService } from '../biomarkers/biomarkers.service';

import {
  CreateLaboratoryTestDto,
  UpdateLaboratoryTestDto,
} from './dto/laboratory-test.dto';

@Injectable()
export class LaboratoryTestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly biomarkersService: BiomarkersService,
  ) {}

  async findAll() {
    return this.prisma.laboratoryTest.findMany({
      include: {
        biomarkers: true,
      },
    });
  }

  async findById(id: string) {
    const laboratoryTest = await this.prisma.laboratoryTest.findUnique({
      where: { id },
      include: {
        biomarkers: true,
      },
    });

    if (!laboratoryTest) {
      throw new NotFoundException('Laboratory Test not found');
    }

    return laboratoryTest;
  }

  async create(createLaboratoryTestDto: CreateLaboratoryTestDto) {
    const { biomarkers, ...dto } = createLaboratoryTestDto;

    for (const biomarkerId of biomarkers) {
      await this.biomarkersService.findById(biomarkerId);
    }

    return this.prisma.laboratoryTest.create({
      data: {
        ...dto,
        biomarkers: {
          connect: biomarkers.map((id) => ({ id })),
        },
      },
      include: { biomarkers: true },
    });
  }

  async update(id: string, updateLabTest: UpdateLaboratoryTestDto) {
    const { biomarkers, ...dto } = updateLabTest;

    const laboratoryTest = await this.findById(id);

    for (const biomarkerId of biomarkers) {
      await this.biomarkersService.findById(biomarkerId);
    }

    return this.prisma.laboratoryTest.update({
      where: { id },
      data: {
        ...dto,
        biomarkers: {
          disconnect: laboratoryTest.biomarkers.map((b) => ({ id: b.id })),
          connect: biomarkers.map((id) => ({ id })),
        },
      },
      include: {
        biomarkers: true,
      },
    });
  }

  async delete(id: string) {
    await this.findById(id);

    return this.prisma.laboratoryTest.delete({
      where: { id },
    });
  }
}
