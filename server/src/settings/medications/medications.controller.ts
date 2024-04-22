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
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';

import { MedicationsService } from './medications.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  UpdateMedicationDto,
  CreateMedicationDto,
} from './dto/medications.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('settings/medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllMedications(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getMedication(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createMedication(
    @Body(ValidationPipe) createMeidicationDto: CreateMedicationDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.createMedication(createMeidicationDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateMedication(
    @Param('id') id: string,
    @Body(ValidationPipe) updateMedicationDto: UpdateMedicationDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicationsService.updateMedication(id, updateMedicationDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteMedication(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.medicationsService.deleteMedication(id);
  }
}
