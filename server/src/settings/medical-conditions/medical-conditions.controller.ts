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

import { MedicalConditionsService } from './medical-conditions.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import {
  CreateMedicalConditionDto,
  UpdateMedicalConditionDto,
} from './dto/medical-conditions.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('settings/medical-conditions')
export class MedicalConditionsController {
  constructor(
    private readonly medicalConditionsService: MedicalConditionsService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllMedicalConditions(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getMedicalConditionById(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createMedicalCondition(
    @Body(ValidationPipe) dto: CreateMedicalConditionDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.create(user.id,dto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateMedicalCondition(
    @Param('id') id: string,
    @Body(ValidationPipe) UpdateMedicalConditionDto: UpdateMedicalConditionDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.update(id, UpdateMedicalConditionDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteMedicalCondition(
    @Param('id') id: string,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.medicalConditionsService.delete(id);
  }
}
