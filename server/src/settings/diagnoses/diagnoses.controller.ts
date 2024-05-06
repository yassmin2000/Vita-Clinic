import { Request } from 'express';
import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Param,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { DiagnosesService } from './diagnoses.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { CreateDiagnosisDto, UpdateDiagnosisDto } from './dto/diagnoses.dto';
import type { Payload } from 'src/types/payload.type';

@Controller('settings/diagnoses')
export class DiagnosesController {
  constructor(private readonly diagnosesService: DiagnosesService) {}

  @UseGuards(JwtGuard)
  @Get()
  async getAllDiagnoses(@Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getDiagnosisById(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Post()
  async createDiagnosis(
    @Body(ValidationPipe) createDiagnosisDto: CreateDiagnosisDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.create(user.id, createDiagnosisDto);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateDiagnosis(
    @Param('id') id: string,
    @Body(ValidationPipe) updateDiagnosisDto: UpdateDiagnosisDto,
    @Req() request: Request,
  ) {
    const user: Payload = request['user'];

    if (user.role === 'patient') {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.update(user.id, id, updateDiagnosisDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteDiagnosis(@Param('id') id: string, @Req() request: Request) {
    const user: Payload = request['user'];

    if (!user.isSuperAdmin) {
      throw new UnauthorizedException();
    }

    return this.diagnosesService.delete(user.id, id);
  }
}
