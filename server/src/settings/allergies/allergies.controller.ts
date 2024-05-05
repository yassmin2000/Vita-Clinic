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

import { AllergiesService } from './allergies.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateAllergyDto, UpdateAllergyDto } from './dto/allergies.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('settings/allergies')
export class AllergiesController {
  constructor(private readonly allergiesService: AllergiesService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllAllergies(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.allergiesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getAllergyById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    const allergy = await this.allergiesService.findById(id);

    return allergy;
  }

  @UseGuards(JwtGuard)
  @Post()
  async createAllergy(
    @Body(ValidationPipe) dto: CreateAllergyDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }
    return this.allergiesService.create(dto,user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateAllergy(
    @Param('id') id: string,
    @Body(ValidationPipe) updateAllergyDto: UpdateAllergyDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.allergiesService.update(id, updateAllergyDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteAllergy(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.allergiesService.delete(id);
  }
}
