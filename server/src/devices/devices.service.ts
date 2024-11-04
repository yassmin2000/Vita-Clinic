import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { LogService } from 'src/log/log.service';

import {
  CreateDeviceDto,
  DeviceDto,
  GetAllDevicesQuery,
  UpdateDeviceDto,
} from './dto/devices.dto';

@Injectable()
export class DevicesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logService: LogService,
  ) {}

  async findAll({
    page = 1,
    limit = 10,
    status = 'all',
    value = '',
    sort = 'purchaseDate-desc',
  }: GetAllDevicesQuery): Promise<DeviceDto[]> {
    const [sortField, sortOrder] = sort.split('-') as [string, 'desc' | 'asc'];

    return this.prisma.device.findMany({
      where: {
        name: {
          contains: value,
          mode: 'insensitive',
        },
        status: status === 'all' ? undefined : status,
      },
      include: {
        manufacturer: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        name: sortField === 'name' ? sortOrder : undefined,
        purchaseDate: sortField === 'purchaseDate' ? sortOrder : undefined,
      },
    });
  }

  async findById(id: string): Promise<DeviceDto> {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: {
        manufacturer: true,
      },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return device;
  }

  async create(
    createDeviceDto: CreateDeviceDto,
    userId: string,
  ): Promise<DeviceDto> {
    const existingSerialNumber = await this.prisma.device.findUnique({
      where: {
        serialNumber: createDeviceDto.serialNumber,
      },
    });

    if (existingSerialNumber) {
      throw new ConflictException('Serial number already exists');
    }

    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: createDeviceDto.manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    const device = await this.prisma.device.create({
      data: createDeviceDto,
      include: {
        manufacturer: true,
      },
    });

    await this.logService.create({
      userId,
      targetId: device.id,
      targetName: device.name,
      type: 'device',
      action: 'create',
    });

    return device;
  }

  async update(
    id: string,
    updateDeviceDto: UpdateDeviceDto,
    userId: string,
  ): Promise<DeviceDto> {
    const existingDevice = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!existingDevice) {
      throw new NotFoundException('Device not found');
    }

    if (updateDeviceDto.serialNumber) {
      const existingSerialNumber = await this.prisma.device.findUnique({
        where: {
          serialNumber: updateDeviceDto.serialNumber,
        },
      });

      if (existingSerialNumber && existingSerialNumber.id !== id) {
        throw new ConflictException('Serial number already exists');
      }
    }

    if (updateDeviceDto.manufacturerId) {
      const manufacturer = await this.prisma.manufacturer.findUnique({
        where: {
          id: updateDeviceDto.manufacturerId,
        },
      });

      if (!manufacturer) {
        throw new NotFoundException('Manufacturer not found');
      }
    }

    const updatedDevice = await this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
      include: {
        manufacturer: true,
      },
    });

    await this.logService.create({
      userId,
      targetId: id,
      targetName: updatedDevice.name,
      type: 'device',
      action: 'update',
    });

    return updatedDevice;
  }

  async delete(id: string, userId: string): Promise<DeviceDto> {
    const existingDevice = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!existingDevice) {
      throw new NotFoundException('Device not found');
    }

    const deletedDevice = await this.prisma.device.delete({
      where: { id },
      include: {
        manufacturer: true,
      },
    });

    await this.logService.create({
      userId,
      targetId: id,
      targetName: deletedDevice.name,
      type: 'device',
      action: 'delete',
    });

    return deletedDevice;
  }
}
