import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  BiomarkerDto,
  CreateBiomarkerDto,
  UpdateBiomarkerDto,
} from './dto/biomarkers.dto';

@Injectable()
export class BiomarkersService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService,
  ) {}

  async findAll(): Promise<BiomarkerDto[]> {
    return this.prisma.biomarker.findMany();
  }

  async findById(id: string): Promise<BiomarkerDto> {
    const biomarker = await this.prisma.biomarker.findUnique({
      where: { id },
    });

    if (!biomarker) {
      throw new NotFoundException('Biomarker not found');
    }

    return biomarker;
  }

  async create(
    userId: string,
    createBiomarkerDto: CreateBiomarkerDto,
  ): Promise<BiomarkerDto> {
    const createdBiomarker = await this.prisma.biomarker.create({
      data: createBiomarkerDto,
    });

    await this.logService.create({
      userId,
      targetId: createdBiomarker.id,
      targetName: createdBiomarker.name,
      type: 'biomarker',
      action: 'create',
    });
    return createdBiomarker;
  }

  async update(
    userId: string,
    id: string,
    updateBiomarkerDto: UpdateBiomarkerDto,
  ): Promise<BiomarkerDto> {
    const existingBiomarker = await this.prisma.biomarker.findUnique({
      where: { id },
    });

    if (!existingBiomarker) {
      throw new NotFoundException('Biomarker not found');
    }

    const updatedBiomarker = await this.prisma.biomarker.update({
      where: { id },
      data: updateBiomarkerDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedBiomarker.id,
      targetName: updatedBiomarker.name,
      type: 'biomarker',
      action: 'update',
    });

    return updatedBiomarker;
  }

  async delete(userId: string, id: string): Promise<BiomarkerDto> {
    const existingBiomarker = await this.prisma.biomarker.findUnique({
      where: { id },
    });

    if (!existingBiomarker) {
      throw new NotFoundException('Biomarker not found');
    }

    const isBiomarkerUsed = await this.prisma.laboratoryTest.findFirst({
      where: {
        biomarkers: {
          some: {
            id,
          },
        },
      },
    });

    if (isBiomarkerUsed) {
      throw new ConflictException(
        'Biomarker is being used in a laboratory test and cannot be deleted.',
      );
    }

    const deletedBiomarker = await this.prisma.biomarker.delete({
      where: { id },
    });

    await this.logService.create({
      userId,
      targetId: deletedBiomarker.id,
      targetName: deletedBiomarker.name,
      type: 'biomarker',
      action: 'delete',
    });

    return deletedBiomarker;
  }
}
