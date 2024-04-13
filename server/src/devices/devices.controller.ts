import { Request } from 'express';
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

import { DevicesService } from './devices.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateDeviceDto,
  GetAllDevicesQuery,
  UpdateDeviceDto,
} from './dto/devices.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createDevice(
    @Body(new ValidationPipe({ transform: true })) dto: CreateDeviceDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.devicesService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllDevices(
    @Query(new ValidationPipe({ transform: true })) query: GetAllDevicesQuery,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.devicesService.findAll({ ...query });
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getDeviceById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.devicesService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateDevice(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true }))
    updateDeviceDto: UpdateDeviceDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const updatedDevice = await this.devicesService.update(id, updateDeviceDto);

    return updatedDevice;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteDevice(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    const deleted = await this.devicesService.delete(id);

    return deleted;
  }
}
