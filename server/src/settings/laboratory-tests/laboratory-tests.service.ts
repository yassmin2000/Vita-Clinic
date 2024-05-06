import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { BiomarkersService } from '../biomarkers/biomarkers.service';

import {
  CreateLaboratoryTestDto,
  UpdateLaboratoryTestDto,
} from './dto/laboratory-test.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class LaboratoryTestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly biomarkersService: BiomarkersService,
    private logService: LogService,
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

  async create(
    userId: string,
    createLaboratoryTestDto: CreateLaboratoryTestDto,
  ) {
    const { biomarkers, ...dto } = createLaboratoryTestDto;

    await Promise.all(
      biomarkers.map(async (biomarkerId) => {
        await this.biomarkersService.findById(biomarkerId);
      }),
    );

    const createdLaboratoryTest = await this.prisma.laboratoryTest.create({
      data: {
        ...dto,
        biomarkers: {
          connect: biomarkers.map((id) => ({ id })),
        },
      },
      include: { biomarkers: true },
    });

    await this.logService.create({
      userId,
      targetId: createdLaboratoryTest.id,
      targetName: createdLaboratoryTest.name,
      type: 'laboratory-test',
      action: 'create',
    });

    return createdLaboratoryTest;
  }

  async update(id: string, updateLabTest: UpdateLaboratoryTestDto) {
    const { biomarkers, ...dto } = updateLabTest;

    const laboratoryTest = await this.findById(id);

    await Promise.all(
      biomarkers.map(async (biomarkerId) => {
        await this.biomarkersService.findById(biomarkerId);
      }),
    );

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
