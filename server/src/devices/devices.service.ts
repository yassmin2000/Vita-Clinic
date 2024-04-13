import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  CreateDeviceDto,
  GetAllDevicesQuery,
  UpdateDeviceDto,
} from './dto/devices.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    page = 1,
    limit = 10,
    status = 'all',
    value = '',
    sort = 'purchaseDate-desc',
  }: GetAllDevicesQuery) {
    const offset = (page - 1) * limit;
    const queryOptions: any = {
      skip: offset,
      take: limit,
      orderBy: this.constructOrderBy(sort),
    };
    if (status !== 'all') {
      queryOptions.where = { status };
    }

    if (value) {
      queryOptions.where = { ...queryOptions.where, name: { contains: value } };
    }

    return await this.prisma.device.findMany({
      where: {
        name: {
          contains: value,
          mode: 'insensitive',
        },
        status: status === 'all' ? undefined : status,
      },
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * offset,
      take: limit,
    });
  }

  async findById(id: string) {
    const device = await this.prisma.device.findUnique({
      where: { id },
      include: {
        manufacturer: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!device) {
      throw new NotFoundException('Device not found');
    }

    return device;
  }

  async create(createDeviceDto: CreateDeviceDto) {
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

    return this.prisma.device.create({
      data: createDeviceDto,
    });
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto) {
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

    return this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  async delete(id: string) {
    const existingDevice = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!existingDevice) {
      throw new NotFoundException('Device not found');
    }

    await this.prisma.device.delete({
      where: { id },
    });

    return true;
  }

  private constructOrderBy(sort: string) {
    const [field, order] = sort.split('-');
    switch (field) {
      case 'name':
        return { name: order };
      case 'lastMaintenanceDate':
        return { lastMaintenanceDate: order };
      case 'purchaseDate':
        return { purchaseDate: order };
      default:
        return { purchaseDate: 'desc' }; // Default sort by purchaseDate-desc
    }
  }
}
