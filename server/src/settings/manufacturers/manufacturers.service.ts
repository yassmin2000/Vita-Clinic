import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from './dto/manufacturers.dto';


@Injectable()
export class ManufacturersService {
  constructor(private readonly prisma: PrismaService) {}

  async createManufacturer(createManufacturerDto: CreateManufacturerDto) {
    const { name, description } = createManufacturerDto;
    return this.prisma.manufacturer.create({
      data: {
        name,
        description,
      },
    });
  }
  

  async findAll() {
    
    return await this.prisma.manufacturer.findMany();
  }

  async findById(id: string) {
    return this.prisma.manufacturer.findUnique({
      where: { id },
    });
  }

  async updateManufacturer(
    id: string,
    updateManufacturerDto: UpdateManufacturerDto,
  ) {
    const existingManufacturer =
      await this.prisma.manufacturer.findUnique({
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

  async deleteManufacturer(id: string) {
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
