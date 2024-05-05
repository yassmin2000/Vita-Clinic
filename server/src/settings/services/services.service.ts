import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/services.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService
  ) {}

  async findAll() {
    return this.prisma.service.findMany();
  }

  async findById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }


  async create(userId: string,createServiceDto: CreateServiceDto) {
    const createdService = await this.prisma.service.create({
      data: createServiceDto,
    });

 
    await this.logService.create(
      userId,
      createdService.id,
      createdService.name,
      'Service',
      'Create',
    );

    return createdService;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async delete(id: string) {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.service.delete({
      where: { id },
    });
  }
}
