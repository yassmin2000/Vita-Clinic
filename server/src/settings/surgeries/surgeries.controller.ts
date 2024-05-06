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

import { SurgeriesService } from './surgeries.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateSurgeryDto, UpdateSurgeryDto } from './dto/surgeries.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('settings/surgeries')
export class SurgeriesController {
  constructor(private readonly surgeriesService: SurgeriesService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllSurgeries(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.surgeriesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getSurgeryById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const surgery = await this.surgeriesService.findById(id);

    return surgery;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createSurgery(
    @Body(ValidationPipe) dto: CreateSurgeryDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.surgeriesService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateSurgery(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSurgeryDto: UpdateSurgeryDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.surgeriesService.update(id, updateSurgeryDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteSurgery(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.surgeriesService.delete(id);
  }
}
