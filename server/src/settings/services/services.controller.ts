import { Request } from 'express';
import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
  Patch,
  Param,
  Delete,
  ValidationPipe,
} from '@nestjs/common';

import { ServicesService } from './services.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateServiceDto, UpdateServiceDto } from './dto/services.dto';
import { Payload } from 'src/types/payload.type';

@Controller('settings/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllServices() {
    return this.servicesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getByID(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const service = await this.servicesService.findById(id);

    return service;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createService(
    @Body(ValidationPipe) dto: CreateServiceDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.servicesService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateService(
    @Param('id') id: string,
    @Body(ValidationPipe) updateServiceDto: UpdateServiceDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.servicesService.update(user.id, id, updateServiceDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteService(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.servicesService.delete(user.id, id);
  }
}
