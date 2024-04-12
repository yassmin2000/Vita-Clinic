import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDeviceDto, UpdateDeviceDto } from './dto/devices.dto';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDevice(createDeviceDto: CreateDeviceDto) {
    const { name, description, serialNumber, manufacturerId, price, purchaseDate } = createDeviceDto;
  
    return this.prisma.device.create({
      data: {
        name,
        description,
        serialNumber,
        manufacturerId,
        price,
        purchaseDate,
      },
    });
  }

  async findAll(page: number, limit: number, status: string, value: string, sort: string) {
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
    return await this.prisma.device.findMany(queryOptions);
  }

  async findById(id: string) {
    return this.prisma.device.findUnique({
      where: { id },
    });
  }

  async updateDevice(id: string, updateDeviceDto: UpdateDeviceDto) {
    const existingDevice = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!existingDevice) {
      return null;
    }

    return this.prisma.device.update({
      where: { id },
      data: updateDeviceDto,
    });
  }

  async deleteDevice(id: string) {
    const existingDevice = await this.prisma.device.findUnique({
      where: { id },
    });

    if (!existingDevice) {
      return null;
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
