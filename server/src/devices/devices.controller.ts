import type { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  Query,
  UnauthorizedException,
  UseGuards,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

import { DevicesService } from './devices.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateDeviceDto,
  DeviceDto,
  GetAllDevicesQuery,
  UpdateDeviceDto,
} from './dto/devices.dto';
import { ApiDocumentation } from 'src/decorators/documentation.decorator';

@ApiDocumentation({
  tags: 'Devices',
  security: 'bearer',
  unauthorizedResponse: {
    description: 'Unauthorized',
  },
  badRequestResponse: {
    description: 'Bad Request',
  },
})
@UseGuards(JwtGuard)
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @ApiDocumentation({
    operation: {
      summary: 'Get all devices',
      description: 'Get all devices data',
    },
    okResponse: {
      description: 'Devices data',
      type: [DeviceDto],
    },
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of devices per page',
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    description: 'Filter devices by status',
    enum: ['active', 'inactive', 'all'],
    required: false,
    example: 'active',
  })
  @ApiQuery({
    name: 'value',
    type: String,
    required: false,
    description: 'Search value',
    example: 'MX-1000',
  })
  @ApiQuery({
    name: 'sort',
    description: 'Sort devices by field',
    enum: ['name-asc', 'name-desc', 'purchaseDate-asc', 'purchaseDate-desc'],
    required: false,
    example: 'purchaseDate-desc',
  })
  @Get()
  async getAllDevices(
    @Query(new ValidationPipe({ transform: true })) query: GetAllDevicesQuery,
    @Req() request: Request,
  ): Promise<DeviceDto[]> {
    const user = request.user;

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.devicesService.findAll({ ...query });
  }

  @ApiDocumentation({
    operation: {
      summary: 'Get device by ID',
      description: 'Get device data by ID',
    },
    params: {
      name: 'deviceId',
      type: String,
      description: 'Device ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Device not found',
    },
    okResponse: {
      description: 'Device data',
      type: DeviceDto,
    },
  })
  @Get(':deviceId')
  async getDeviceById(
    @Param('deviceId') deviceId: string,
    @Req() request: Request,
  ): Promise<DeviceDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.devicesService.findById(deviceId);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Create device',
      description: 'Create new device',
    },
    body: {
      description: 'Create device data',
      type: CreateDeviceDto,
    },
    consumes: 'application/json',
    createdResponse: {
      description: 'Device created',
      type: DeviceDto,
    },
  })
  @Post()
  async createDevice(
    @Body(new ValidationPipe({ transform: true })) dto: CreateDeviceDto,
    @Req() request: Request,
  ): Promise<DeviceDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.devicesService.create(dto, user.id);
  }

  @ApiDocumentation({
    operation: {
      summary: 'Update device',
      description: 'Update device data',
    },
    params: {
      name: 'deviceId',
      type: String,
      description: 'Device ID',
      example: crypto.randomUUID(),
    },
    body: {
      description: 'Update device data',
      type: UpdateDeviceDto,
    },
    consumes: 'application/json',
    notFoundResponse: {
      description: 'Device not found',
    },
    okResponse: {
      description: 'Device updated',
      type: DeviceDto,
    },
  })
  @Patch(':deviceId')
  async updateDevice(
    @Param('deviceId') deviceId: string,
    @Body(new ValidationPipe({ transform: true }))
    updateDeviceDto: UpdateDeviceDto,
    @Req() request: Request,
  ): Promise<DeviceDto> {
    const user = request.user;

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const updatedDevice = await this.devicesService.update(
      deviceId,
      updateDeviceDto,
      user.id,
    );

    return updatedDevice;
  }

  @ApiDocumentation({
    operation: {
      summary: 'Delete device',
      description: 'Delete device data',
    },
    params: {
      name: 'deviceId',
      type: String,
      description: 'Device ID',
      example: crypto.randomUUID(),
    },
    notFoundResponse: {
      description: 'Device not found',
    },
    okResponse: {
      description: 'Device deleted',
      type: DeviceDto,
    },
  })
  @Delete(':deviceId')
  async deleteDevice(
    @Param('deviceId') deviceId: string,
    @Req() request: Request,
  ): Promise<DeviceDto> {
    const user = request.user;

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    const deleted = await this.devicesService.delete(deviceId, user.id);

    return deleted;
  }
}
