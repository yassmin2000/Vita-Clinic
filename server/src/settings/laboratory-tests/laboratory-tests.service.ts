import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import {
  CreateLaboratoryTestDto,
  UpdateLaboratoryTestDto,
} from './dto/laboratory-test.dto';

@Injectable()
export class LaboratoryTestsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.laboratoryTest.findMany({
      include: {
        biomarkers: true,
      },
    });
  }

  async findById(id: string) {
    const labtest = await this.prisma.laboratoryTest.findUnique({
      where: { id },
      include: {
        biomarkers: true,
      },
    });
    return labtest;
  }

  async create(createLaboratoryTestDto: CreateLaboratoryTestDto) {
    const { biomarkers, ...dto } = createLaboratoryTestDto;

    const validBiomarkerIds: string[] = [];
    for (const biomarkerId of biomarkers) {
      const biomarker = await this.prisma.biomarker.findUnique({
        where: { id: biomarkerId },
      });
      if (biomarker) {
        validBiomarkerIds.push(biomarkerId);
      }
    }
    if (validBiomarkerIds.length === 0) {
      throw new NotFoundException('No valid biomarkers found');
    }

    return this.prisma.laboratoryTest.create({
      data: {
        ...dto,
        biomarkers: {
          connect: validBiomarkerIds.map((id) => ({ id })),
        },
      },
      include: { biomarkers: true },
    });
  }

  async update(id: string, updateLabTest: UpdateLaboratoryTestDto) {
    const { biomarkers, ...dto } = updateLabTest;

    // Retrieve the existing lab test
    const labTest = await this.prisma.laboratoryTest.findUnique({
      where: { id },
      include: { biomarkers: true },
    });

    if (!labTest) {
      throw new NotFoundException('Lab test not found');
    }

    // Check if all biomarker IDs exist in the biomarker table
    const existingBiomarkerIds: string[] = [];
    for (const biomarkerId of biomarkers) {
      const biomarker = await this.prisma.biomarker.findUnique({
        where: { id: biomarkerId },
      });
      if (biomarker) {
        existingBiomarkerIds.push(biomarkerId);
      }
    }

    // Update the lab test
    await this.prisma.laboratoryTest.update({
      where: { id },
      data: {
        ...dto,
        biomarkers: {
          disconnect: labTest.biomarkers.map((b) => ({ id: b.id })),
          connect: existingBiomarkerIds.map((id) => ({ id })),
        },
      },
    });

    // Return the updated lab test
    return this.prisma.laboratoryTest.findUnique({
      where: { id },
      include: { biomarkers: true },
    });
  }

  async delete(id: string) {
    const existingLabTest = await this.prisma.laboratoryTest.findUnique({
      where: { id },
    });

    if (!existingLabTest) {
      throw new NotFoundException('Laboratory Test not found');
    }

    return this.prisma.laboratoryTest.delete({
      where: { id },
    });
  }
}
