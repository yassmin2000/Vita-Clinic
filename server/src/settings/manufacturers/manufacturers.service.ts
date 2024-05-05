import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from './dto/manufacturers.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class ManufacturersService {
  constructor(
    private prisma: PrismaService,
    private logService: LogService
  ) {}

  async findAll() {
    return this.prisma.manufacturer.findMany();
  }

  async findById(id: string) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { id },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    return manufacturer;
  }

  async create(userId: string,createManufacturerDto: CreateManufacturerDto) {
    const createdManufacturer = await this.prisma.allergy.create({
      data: createManufacturerDto,
    });

    await this.logService.create(
      userId,
      createdManufacturer.id,
      createdManufacturer.name,
      'Manufacturer',
      'Create',
    );

    return createdManufacturer;
  }

  async update(id: string, updateManufacturerDto: UpdateManufacturerDto) {
    const existingManufacturer = await this.prisma.manufacturer.findUnique({
      where: { id },
    });

    if (!existingManufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    return this.prisma.manufacturer.update({
      where: { id },
      data: updateManufacturerDto,
    });
  }

  async delete(id: string) {
    const existingManufacturers = await this.prisma.manufacturer.findUnique({
      where: { id },
    });

    if (!existingManufacturers) {
      throw new NotFoundException('Manufacturer not found');
    }

    return this.prisma.manufacturer.delete({
      where: { id },
    });
  }
}
