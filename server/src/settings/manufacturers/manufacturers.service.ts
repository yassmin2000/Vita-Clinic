import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from './dto/manufacturers.dto';

@Injectable()
export class ManufacturersService {
  constructor(private readonly prisma: PrismaService) {}

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

  async create(createManufacturerDto: CreateManufacturerDto) {
    return this.prisma.manufacturer.create({
      data: createManufacturerDto,
    });
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
