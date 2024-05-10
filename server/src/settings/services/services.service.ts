import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/services.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class ServicesService {
  constructor(
    private readonly prisma: PrismaService,
    private logService: LogService,
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

  async create(userId: string, createServiceDto: CreateServiceDto) {
    const createdService = await this.prisma.service.create({
      data: createServiceDto,
    });

    await this.logService.create({
      userId,
      targetId: createdService.id,
      targetName: createdService.name,
      type: 'service',
      action: 'create',
    });

    return createdService;
  }

  async update(userId: string, id: string, updateServiceDto: UpdateServiceDto) {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    const updatedService = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });

    await this.logService.create({
      userId,
      targetId: updatedService.id,
      targetName: updatedService.name,
      type: 'service',
      action: 'update',
    });

    return updatedService;
  }

  async delete(userId: string, id: string) {
    const existingService = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      throw new NotFoundException('Service not found');
    }

    const isServiceUsed = await this.prisma.appointmentServices.findFirst({
      where: {
        serviceId: id,
      },
    });

    if (isServiceUsed) {
      throw new ConflictException(
        'Service is being used by a patient in an appointment and cannot be deleted.',
      );
    }

    const deletedService = await this.prisma.service.delete({
      where: { id },
    });

    await this.logService.create({
      userId,
      targetId: deletedService.id,
      targetName: deletedService.name,
      type: 'service',
      action: 'delete',
    });

    return deletedService;
  }
}
