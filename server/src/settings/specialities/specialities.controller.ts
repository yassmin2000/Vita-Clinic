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

import { SpecialitiesService } from './specialities.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateSpecialityDto,
  UpdateSpecialityDto,
} from './dto/specialities.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('settings/specialities')
export class SpecialitiesController {
  constructor(private readonly specialitiesService: SpecialitiesService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllSpecialities(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.specialitiesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getSpecialityById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const speciality = await this.specialitiesService.findById(id);

    return speciality;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createSpeciality(
    @Body(ValidationPipe) dto: CreateSpecialityDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.specialitiesService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateSpeciality(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSpecialityDto: UpdateSpecialityDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.specialitiesService.update(id, updateSpecialityDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteSpeciality(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.specialitiesService.delete(id);
  }
}
