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
} from '@nestjs/common';

import { ManufacturersService } from './manufacturers.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateManufacturerDto,
  UpdateManufacturerDto,
} from './dto/manufacturers.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('settings/manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getManufacturers(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createManufacturer(
    @Body() createManufacturerDto: CreateManufacturerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.create(createManufacturerDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateManufacturer(
    @Param('id') id: string,
    @Body() updateManufacturerDto: UpdateManufacturerDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role !== 'admin') {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.update(id, updateManufacturerDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteManufacturer(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.manufacturersService.delete(id);
  }
}
